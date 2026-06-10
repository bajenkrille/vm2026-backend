import { prisma } from '../prismaClient.ts'

const pointsCalculator = (gh, gb, th, tb) => {
  let points = 0
  // console.log(gh, gb, th, tb);
  if ((gh > gb && th > tb) || (gh == gb && th == tb) || (gh < gb && th < tb)) points = 1
  if (gh === th && gb === tb) points++
  if (points === 2 && (gh + gb) > 3) points++
        // if ((gh > gb && th > tb) || (gh == gb && th == tb) || (gh < gb && th < tb)) {console.log("1 poäng")}
        // if (gh === th && gb === tb) {console.log("2 poäng");}
        // if (points === 2 && (gh + gb) > 3) {console.log("3 poäng");}
  return points
}  

const calculatePoints = async (results) => {
  const stored = await prisma.$transaction(
    results.map(result =>
      prisma.matchen.update({
        where: { id: BigInt(result.id) },
        data: {
          hemma_mal: Number(result.goals[0]),
          borta_mal: Number(result.goals[1]),
          played: result.played,
        }
      })
    )
  )

  const allTips = await prisma.match_tips.findMany({
  });

  console.log("results: ", results);
  let pointsArray = []

  results.forEach(match => {
    const matchId = match.id
    const gjordaHemmaMal = match.goals[0]
    const gjordaBortaMal = match.goals[1]
    const filteredTips = allTips.filter(tips => Number(tips.matchen_id) === matchId)
    const pointsData = filteredTips.map(tips => {
      const points = pointsCalculator(Number(gjordaHemmaMal), Number(gjordaBortaMal), tips.hemma_mal, tips.borta_mal)
      const matchTipsMatch = Number(tips.matchen_id)
      if (matchTipsMatch === matchId){
        return {
          points: points,
          deltagare_id: tips.deltagare_id,
          match_tips_id: tips.id
        }
      }
    }) 
    console.log("pointsData: ",pointsData);
    pointsArray.push(pointsData)
  });
  console.log("pointsArray: ",pointsArray);
  console.log("pointsArrayPlatt: ",pointsArray.flat());
  // return pointsArray.flat()
  
  const pointsSet = await prisma.points.createMany({
    data: pointsArray.flat(),
    skipDuplicates: true, // Skip records with duplicate unique fields
  });
  // Returns: { count: 2 }
  console.log("pointsSet: ",pointsSet);
  return pointsSet
}

export {
  calculatePoints
};