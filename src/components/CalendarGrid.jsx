import React from 'react'
import { Card, Button, Badge } from 'react-bootstrap'
import dayjs from 'dayjs'
import { daysInMonth, monthName, statusCycle, ymd, isAugust, academicYearFor } from '../utils/dateUtils'

export default function CalendarGrid({year, month, entries, onToggleDay}) {
  const days = daysInMonth(year, month)
  const startWeekday = dayjs(days[0]).day() // 0 Sunday .. 6 Saturday
  const blanks = Array(startWeekday).fill(null)
  const { start, end } = academicYearFor()

  const cells = [...blanks, ...days]

  const header = ['D', 'L', 'M', 'M', 'G', 'V', 'S']

  return (
    <Card className="glass rounded-4 p-3">
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="mb-2">{monthName(month)} {year}</h5>
        <div className="d-flex gap-2 align-items-center">
          <Badge bg="danger" className="badge-status badge-A">A</Badge>
          <span className="text-secondary small">Assenza (conteggia)</span>
          <Badge bg="success" className="badge-status badge-G">G</Badge>
          <span className="text-secondary small">Giustificata</span>
          <Badge bg="secondary" className="badge-status badge-F">F</Badge>
          <span className="text-secondary small">Festivo</span>
        </div>
      </div>
      <div className="d-grid" style={{gridTemplateColumns:'repeat(7, 1fr)', gap:'6px'}}>
        {header.map((h,i)=>(
          <div key={i} className="text-center text-secondary small mb-1">{h}</div>
        ))}
        {cells.map((d, i)=>{
          if (!d) return <div key={'b'+i}></div>
          const dateStr = ymd(d)
          const s = entries[dateStr] || null
          const disabled = !d.isAfter(start.subtract(1,'day')) || !d.isBefore(end.add(1,'day'))
          const august = isAugust(d)
          const cls = ['calendar-day','rounded-3', (disabled || august) ? 'disabled' : ''].join(' ')
          return (
            <div key={dateStr} className={cls} onClick={()=> !disabled && !august && onToggleDay(dateStr, s)}>
              <div className="date-num">{d.date()}</div>
              <div className="d-flex justify-content-end">
                {s && <Badge className={'badge-status badge-' + s}>{s}</Badge>}
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-2 text-secondary small">* Agosto non viene conteggiato.</p>
    </Card>
  )
}
