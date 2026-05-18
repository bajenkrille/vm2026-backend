import { prisma } from '../prismaClient.ts'
import { toMatchDto } from '../services/matchenMapper.js';

const toJSON = (obj) =>
  JSON.parse(
    JSON.stringify(obj, (_, v) =>
      typeof v === 'bigint' ? Number(v) : v
    )
  )

export const getMatcher = async (req ,res) => {
  const matchSchedule = await prisma.matchen.findMany();
  res.json(matchSchedule.map(toMatchDto));
}
