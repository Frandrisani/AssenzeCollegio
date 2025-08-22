import React, { useEffect, useMemo, useState } from 'react'
import { Container, Navbar, Nav, Button, Row, Col, Dropdown } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import dayjs from 'dayjs'
import { onAuth, auth, logout } from './firebase'
import AuthGate from './components/AuthGate'
import CalendarGrid from './components/CalendarGrid'
import Dashboard from './components/Dashboard'
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import { academicYearFor } from './utils/dateUtils'

export default function App() {
  const [user, setUser] = useState(null)
  const [entries, setEntries] = useState({})
  const [yearMonth, setYearMonth] = useState(()=>{
    const { start } = academicYearFor()
    return { year: start.year(), month: start.month() }
  })

  useEffect(()=>{
    const unsub = onAuth(u => {
      setUser(u || null)
    })
    return () => unsub()
  }, [])

  // Sync entries
  useEffect(()=>{
    if (!user) return
    const { start } = academicYearFor()
    const docRef = doc(db, 'users', user.uid, 'datasets', String(start.year()))
    const unsub = onSnapshot(docRef, (snap)=>{
      const data = snap.data() || {}
      setEntries(data.entries || {})
    })
    return () => unsub()
  }, [user])

  const saveEntries = async (newMap) => {
    const { start } = academicYearFor()
    const docRef = doc(db, 'users', user.uid, 'datasets', String(start.year()))
    await setDoc(docRef, { entries: newMap }, { merge: true })
  }

  const handleToggleDay = (dateStr, current) => {
    const order = [null, 'A', 'G', 'F']
    const next = order[(order.indexOf(current) + 1) % order.length]
    const updated = { ...entries }
    if (!next) delete updated[dateStr]
    else updated[dateStr] = next
    setEntries(updated)
    saveEntries(updated).then(()=>{
      toast.success(`Giorno ${dateStr} impostato a ${next || 'vuoto'}`)
    }).catch(err=>{
      toast.error('Errore nel salvataggio')
      console.error(err)
    })
  }

  const months = useMemo(()=>{
    const list = []
    const { start, end } = academicYearFor()
    let cur = start
    while (cur.isBefore(end.add(1,'month'))) {
      list.push({label: cur.format('MMMM YYYY'), value: {year: cur.year(), month: cur.month()}})
      cur = cur.add(1,'month')
    }
    return list
  }, [])

  if (!user) return <><AuthGate /><ToastContainer position="bottom-right" /></>

  return (
    <>
      <Navbar expand="lg" className="glass rounded-bottom-4 mb-4">
        <Container>
          <Navbar.Brand>Assenze Alloggio</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav className="me-3">
              <Dropdown>
                <Dropdown.Toggle className="rounded-pill" variant="secondary">
                  {months.find(m=>m.value.year===yearMonth.year && m.value.month===yearMonth.month)?.label}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {months.map((m, idx)=>(
                    <Dropdown.Item key={idx} onClick={()=>setYearMonth(m.value)}>{m.label}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
            <div className="d-flex align-items-center gap-2">
              <span className="text-secondary small">{user.displayName}</span>
              <Button size="sm" variant="outline-light" className="rounded-pill" onClick={logout}>Esci</Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="pb-4">
        <Row className="g-3">
          <Col md={6}>
            <CalendarGrid
              year={yearMonth.year}
              month={yearMonth.month}
              entries={entries}
              onToggleDay={handleToggleDay}
            />
          </Col>
          <Col md={6}>
            <Dashboard entries={entries} />
          </Col>
        </Row>

        <footer className="mt-4 text-center footer">
          <div>✨ Chicche speciali: interfaccia glass, progress bar animata, chart interattivo, toasts, stato sincronizzato in tempo reale.</div>
          <div className="mt-1">Suggerimento: clicca sui giorni per ciclare tra A → G → F → vuoto.</div>
        </footer>
      </Container>
      <ToastContainer position="bottom-right" />
    </>
  )
}
