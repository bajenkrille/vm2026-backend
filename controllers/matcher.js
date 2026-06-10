import { prisma } from '../prismaClient.ts'
import { toMatchDto } from '../services/matchenMapper.js';
import { calculatePoints } from '../services/resultsService.js'

const toJSON = (obj) =>
  JSON.parse(
    JSON.stringify(obj, (_, v) =>
      typeof v === 'bigint' ? Number(v) : v
    )
  )

export const getMatcher = async (req ,res) => {
  const matchSchedule = await prisma.matchen.findMany();
  res.json(matchSchedule.map(toMatchDto));
  console.log("Matcherna: ",matchSchedule.map(toMatchDto));
}

export const setResults = async(req,res) => {
  const results = req.body
  console.log("Rec results",results);
  const stored = await calculatePoints(results)
  console.log("Stored results: ",stored);
  if (stored){
    res.status(200).json(stored)
  } else {
    res.status(500).json({msg: "Något gick fel"})
  }
  console.log("I bakänden!!");
}

