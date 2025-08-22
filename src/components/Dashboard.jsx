import React, { useMemo } from 'react'
import { Card, Row, Col, ProgressBar, Badge } from 'react-bootstrap'
import { computeStats, academicYearFor } from '../utils/dateUtils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import dayjs from 'dayjs'

export default function Dashboard({entries}) {
  const stats = useMemo(()=>computeStats(entries), [entries])
  const { start, end } = academicYearFor()

  const data = useMemo(()=>{
    // Build months Oct .. Sep
    const months = []
    let cur = start
    while (cur.isBefore(end.add(1,'month'))) {
      const key = cur.format('YYYY-MM')
      const label = cur.format('MMM')
      const pm = stats.perMonth[key] || {A:0,G:0,F:0}
      months.push({ month: label, A: pm.A, G: pm.G, F: pm.F })
      cur = cur.add(1,'month')
    }
    return months
  }, [stats, start, end])

  return (
    <Row className="g-3">
      <Col md={4}>
        <Card className="glass p-3 rounded-4 h-100">
          <h5>Anno Accademico</h5>
          <div className="text-secondary">{start.format('DD MMM YYYY')} → {end.format('DD MMM YYYY')}</div>
          <div className="mt-3">
            <div className="d-flex justify-content-between">
              <span>Assenze conteggiate</span>
              <Badge bg="danger">{stats.counted}</Badge>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span>Rimanenti</span>
              <Badge bg="info">{stats.remaining}</Badge>
            </div>
            <div className="progress-outer mt-3">
              <div className="progress-inner" style={{width: stats.pct + '%'}}></div>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <small className="text-secondary">0</small>
              <small className="text-secondary">136</small>
            </div>
          </div>
        </Card>
      </Col>
      <Col md={8}>
        <Card className="glass p-3 rounded-4 h-100">
          <h5>Distribuzione mensile</h5>
          <div style={{width:'100%', height:260}}>
            <ResponsiveContainer>
              <BarChart data={data}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="A" stackId="a" />
                <Bar dataKey="G" stackId="a" />
                <Bar dataKey="F" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>
    </Row>
  )
}
