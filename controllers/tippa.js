import { prisma } from '../prismaClient.ts'
import { toMatchDto } from '../services/matchenMapper.js';

const toJSON = (obj) =>
  JSON.parse(
    JSON.stringify(obj, (_, v) =>
      typeof v === 'bigint' ? Number(v) : v
    )
  )

export const storeTips = async (req ,res) => {
  console.log("Tips: ",req.body);
  console.dir(req.body, { depth: null });
  const matchSchedule = await prisma.matchen.findMany();
  res.sendStatus(200);
}
