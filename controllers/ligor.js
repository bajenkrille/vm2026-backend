import { prisma } from '../prismaClient.ts'

const toJSON = (obj) =>
  JSON.parse(
    JSON.stringify(obj, (_, v) =>
      typeof v === 'bigint' ? Number(v) : v
    )
  )

export const skapaLiga = async (req, res) => {
  console.log("Received ligadata: ",req.body);
  console.log("Recieved userId: ",req.user.userId);
  console.log("Admin: ",req.body.admin);
  let adminId = null
  // return
  try {
    if (req.body.admin) adminId = req.user.userId
    console.log("adminId: ",adminId);
    const nameExists = await prisma.liga.findUnique({
      where: { liga_name: req.body.liganamn },
    });
    if (nameExists){
      res.status(409).json({msg: "Liganamnet existerar redan"})
    }
    
    const liga = await prisma.liga.create({
      data: {
        liga_name: req.body.liganamn,
        description: req.body.beskrivning,
        admin_id: adminId,
        creator_id: req.user.userId,
        private: req.body.private
      },
    });    
    console.log("Lagrad liga: ",liga);    

    if (!liga) res.status(500).json({msg: "Något gick fel vid skapande av liga"})
  
    const ligaId = liga.id
    const deltagare = req.body.valda
    const ligaDeltagare = await prisma.liga_deltagare.createMany({
      data: deltagare.map((deltagareId) => ({
        liga_id: BigInt(ligaId),
        deltagare_id: BigInt(deltagareId),
      })),
      skipDuplicates: true,
    });
    console.log("ligaDeltagare: ", ligaDeltagare);

    if (ligaDeltagare) res.status(200).json({msg: "Skapande av liga gick bra"})
    else res.status(500).json({msg: "Något gick fel när deltagare skulle läggas till"})
  
  } catch (error) {
    console.log("error: ",error);    
  }
}

export const getLigor = async (req ,res) => {
  console.log("GETLIGOR!!!!!!!");
  const allaLigor = await prisma.liga.findMany();
  console.log("allaLigor: ",allaLigor);
  res.json(toJSON(allaLigor));
}

export const getLigaDeltagare = async(req,res) => {
  console.log("Till getLigaDeltagare inkommo: ");
  const ligaId = BigInt(req.query.ligaId)
  console.log("Tjohoo ligaId: ",ligaId);
  const ligaDeltagare = await prisma.liga_deltagare.findMany({
    where: { liga_id: ligaId },
  });
 
  console.log("ligaDeltagare: ",ligaDeltagare);
  if (ligaDeltagare){
    res.status(200).json(toJSON(ligaDeltagare))
  } else {
    res.status(500).json({msg: "Något gick fel vid hämtning av ligadeltagare"})
  }
  
  // const result = users.map(u => ({
  //   deltagare_id: u.id,
  //   user: u.nick_name,
  //   fornamn: u.first_name,
  //   efternamn: u.last_name,
  //   antal_tips: u._count.match_tips,
  //   betalat: u.has_paid,
  // }));  

  // console.log("Result: ", result);

  // res.status(200).json(toJSON(result));
}

export const setBetalning = async(req, res) => {
  console.log("Received betalning: ",req.body);
  const deltagareIds = req.body.map(id => BigInt(id));

  const result = await prisma.deltagare.updateMany({
    where: { id: {
      in: deltagareIds
    } },
    data: { has_paid: true },
  })

  console.log("ID: ",deltagareIds, "result: ", result);
  if (result){
    res.status(200).json(result)
  }
  res.status(500).json({msg: "Något gick fel"})
}
