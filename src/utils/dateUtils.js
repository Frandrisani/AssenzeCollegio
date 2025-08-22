import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(isoWeek)

export const ACADEMIC_LIMIT = 136

export const academicYearFor = (d = dayjs()) => {
  const date = dayjs(d)
  const startYear = date.month() >= 9 ? date.year() : date.year() - 1 // month 9 = October (0-indexed 0..11)
  const start = dayjs(`${startYear}-10-01`)
  const end = dayjs(`${startYear + 1}-09-30`)
  return { start, end }
}

export const isWithinAcademicYear = (date, {start, end}) => {
  const d = dayjs(date)
  return (d.isAfter(start.subtract(1, 'day')) && d.isBefore(end.add(1, 'day')))
}

export const isAugust = (date) => dayjs(date).month() === 7 // 0-indexed => 7 = August

export const monthName = (monthIdx) => dayjs().month(monthIdx).format('MMMM')

export const daysInMonth = (year, monthIdx) => {
  const start = dayjs().year(year).month(monthIdx).date(1)
  const days = []
  const total = start.daysInMonth()
  for (let i = 0; i < total; i++) {
    const d = start.add(i, 'day')
    days.push(d)
  }
  return days
}

export const ymd = (d) => dayjs(d).format('YYYY-MM-DD')

export const monthKey = (d) => dayjs(d).format('YYYY-MM')

export const statusCycle = (s) => {
  const order = [null, 'A', 'G', 'F']
  const idx = order.indexOf(s)
  const next = order[(idx + 1) % order.length]
  return next
}

export const computeStats = (entries) => {
  // entries: map { 'YYYY-MM-DD': 'A'|'G'|'F'|null }
  const { start, end } = academicYearFor()
  let counted = 0
  const perMonth = {}
  Object.entries(entries).forEach(([date, s]) => {
    const d = dayjs(date)
    if (!isWithinAcademicYear(d, {start, end})) return
    if (isAugust(d)) return
    const mk = monthKey(d)
    perMonth[mk] = perMonth[mk] || { A:0, G:0, F:0 }
    if (s === 'A') { counted += 1; perMonth[mk].A++ }
    else if (s === 'G') { perMonth[mk].G++ }
    else if (s === 'F') { perMonth[mk].F++ }
  })
  const remaining = Math.max(ACADEMIC_LIMIT - counted, 0)
  const pct = Math.min((counted / ACADEMIC_LIMIT) * 100, 100)
  return { counted, remaining, pct, perMonth }
}
