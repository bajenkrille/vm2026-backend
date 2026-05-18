import { prisma } from '../prismaClient.ts'

const toJSON = (obj) =>
  JSON.parse(
    JSON.stringify(obj, (_, v) =>
      typeof v === 'bigint' ? Number(v) : v
    )
  )

export const getAllDeltagare = async (req ,res) => {
  const allaDeltagare = await prisma.deltagare.findMany();
  res.json(toJSON(allaDeltagare));
}
