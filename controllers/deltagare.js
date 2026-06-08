import { prisma } from '../prismaClient.ts'

const toJSON = (obj) =>
  JSON.parse(
    JSON.stringify(obj, (_, v) =>
      typeof v === 'bigint' ? Number(v) : v
    )
  )

export const getAllDeltagare = async (req ,res) => {
  console.log("GETALLDELTAGARE!!!!!!!");
  const allaDeltagare = await prisma.deltagare.findMany();
  res.json(toJSON(allaDeltagare));
}

export const getDeltagareAndCompleteness = async(req,res) => {
  const users = await prisma.deltagare.findMany({
    select: {
      id: true,
      nick_name: true,
      first_name: true,
      last_name: true,
      has_paid: true,
      _count: {
        select: {
          match_tips: true,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  });

  console.log("Users: ",users);
  
  const result = users.map(u => ({
    deltagare_id: u.id,
    user: u.nick_name,
    fornamn: u.first_name,
    efternamn: u.last_name,
    antal_tips: u._count.match_tips,
    betalat: u.has_paid,
  }));  

  console.log("Result: ", result);

  res.status(200).json(toJSON(result));
}

export const setBetalning = async(req, res) => {
  console.log("Received: ",req.body);
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
