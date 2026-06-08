import { prisma } from '../prismaClient.ts'
// import { toMatchDto } from '../services/matchenMapper.js';
import { sendTipsConfirmationMail, sendTipsInformationMail } from '../services/mailService.js'


export const storeTips = async (req ,res) => {
  console.log("Tips: ",req.body);
  console.dir(req.body, { depth: null });
  console.log("Decoded: ", req.user);
  try {
    const deltagare_id = req.user.userId
    const data = req.body.map(match => {
      const matchId = match.matchId
      const [hemma, borta] = match.tips
      return {
        hemma_mal: Number(hemma),
        borta_mal: Number(borta),
        deltagare_id: BigInt(deltagare_id),
        matchen_id: BigInt(matchId),
      }
    })
    const {nick_name, email} = await prisma.deltagare.findUnique({
      where: { id: deltagare_id },
    })
    console.log("Antal tippade matcher: ",data.length);
    await prisma.$transaction(
      data.map(tip =>
        prisma.match_tips.upsert({
          where: {
            deltagare_id_matchen_id: {
              deltagare_id: tip.deltagare_id,
              matchen_id: tip.matchen_id,
            },
          },
          update: {
            hemma_mal: tip.hemma_mal,
            borta_mal: tip.borta_mal,
          },
          create: tip,
        })
      )
    )    
    const antalTippadeMatcher = data.length
    let msg = ""
    if (antalTippadeMatcher === 72){
      msg = "Du har tippat samtliga matcher, du kan ta det lugnt, men har möjlighet att ändra ditt tips fram till VM-starten."
    } else {
      const rest = 72 - antalTippadeMatcher
      msg = `Du har kvar att tippa ${rest} matcher. Glöm inte att göra det innan den 11/6 kl. 21.00!`
    }
    sendTipsConfirmationMail(email, nick_name, antalTippadeMatcher, msg)
    sendTipsInformationMail("krille.home@gmail.com", nick_name, antalTippadeMatcher, email)
    res.status(200).json({msg: "Stored"})
  } catch (err){
    console.error(err)
    res.status(500).json({error: "Boing boing"})
  }
}

export const getTips = async (req ,res) => {
  try {
    const deltagare_id = req.user.userId
    const tippadeMatcher = await prisma.match_tips.findMany({
      where: { deltagare_id: deltagare_id },
    });
    console.log("Tippade matcher: ",tippadeMatcher);
    const data = tippadeMatcher.map((item) => {
      return {
        matchId: Number(item.matchen_id),
        tips: [item.hemma_mal, item.borta_mal]
      }
    })
    console.log("Data: ",data);
    const tippadeMatcherAlla = await prisma.match_tips.findMany({
    });
    console.log("Allas tippade matcher: ",tippadeMatcherAlla);

    res.status(200).json(data)    
  } catch (err) {
    console.error(err)
    res.status(500).json({error: "Boing boing"})    
  }
}

export const getAllTips = async (req ,res) => {
  try {
    const deltagare_id = req.user.userId
    const tippadeMatcherAlla = await prisma.match_tips.findMany({
    });
    // console.log("Tippade matcher: ",tippadeMatcherAlla);
    const data = tippadeMatcherAlla.map((item) => {
      return {
        deltagareId: deltagare_id,
        matchId: Number(item.matchen_id),
        tips: [item.hemma_mal, item.borta_mal]
      }
    })
    console.log("Data: ",data);
    res.status(200).json(data)    
  } catch (err) {
    console.error(err)
    res.status(500).json({error: "Boing boing"})    
  }
}
