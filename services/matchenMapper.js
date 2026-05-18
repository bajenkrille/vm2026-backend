// matchenMapper.js

function formatDate(dateString) {
  if (!dateString) return null

  const [year, month, day] = dateString.split("-")
  return `${Number(day)}/${Number(month)}`
}

function getWeekday(dateString) {
  if (!dateString) return null

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const date = new Date(dateString)
  return days[date.getDay()]
}

export function toMatchDto(match) {
  return {
    id: Number(match.id),
    home: match.hemma_lag,
    away: match.borta_lag,
    homeGoals: match.hemma_mal,
    awayGoals: match.borta_mal,
    played: match.played,
    weekday: getWeekday(match.datum),
    date: formatDate(match.datum),  // <-- use it here
    time: match.tid,
    place: match.location,
    group: match.grupp
  }
}