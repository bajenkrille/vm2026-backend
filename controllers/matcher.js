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

export const getDagensMatcher = async (req ,res) => {
  const today = new Date().toLocaleDateString('sv-SE')
  const tomorrowDate = new Date()
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const tomorrow = tomorrowDate.toLocaleDateString('sv-SE')
  
  console.log(today)     // 2026-06-18
  console.log(tomorrow)  // 2026-06-19

  const matches = await prisma.matchen.findMany({
    where: {
      OR: [
        {
          datum: today,
          tid: { gte: '17:45' }
        },
        {
          datum: tomorrow,
          tid: { lte: '06:15' }
        }
      ]
    }
  })
  res.json(matches.map(toMatchDto));
  console.log("Dagens matcher: ",matches.map(toMatchDto));
}

export const getLastUpdate = async (req, res) => {
  const lastUpdate = await prisma.matchen.aggregate({
    _max: {
      updated_at: true
    }
  })
  
  console.log("Updated at: ",lastUpdate._max.updated_at)
  res.json(lastUpdate._max.updated_at)
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

