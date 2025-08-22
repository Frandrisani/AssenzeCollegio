import React, { useEffect, useState } from "react";
import { Container, Navbar, Button, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import dayjs from "dayjs";
import { onAuth, logout } from "./firebase";
import AuthGate from "./components/AuthGate";
import CalendarGrid from "./components/CalendarGrid";
import Dashboard from "./components/Dashboard";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { academicYearFor } from "./utils/dateUtils";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState({});
  const [yearMonth, setYearMonth] = useState(() => {
    const { start } = academicYearFor();
    return { year: start.year(), month: start.month() };
  });

  // --- BLOCCO DI DEBUG ---
  useEffect(() => {
    console.log("... [App.jsx] Imposto il listener onAuth...");
    const unsub = onAuth((u) => {
      // Questo è il messaggio PIÙ IMPORTANTE. Se non appare dopo il login,
      // la comunicazione con Firebase non sta funzionando.
      console.log("🔥 [App.jsx] Listener onAuth ATTIVATO! L'utente è:", u);
      setUser(u || null);
    });

    // Questa è una "funzione di pulizia" che viene eseguita quando il componente non è più visibile
    return () => {
      console.log("... [App.jsx] Pulisco il listener onAuth.");
      unsub();
    };
  }, []); // L'array vuoto [] assicura che questo codice venga eseguito solo una volta

  // Sincronizzazione dati con Firestore
  useEffect(() => {
    if (!user) return;
    const { start } = academicYearFor();
    const docRef = doc(db, "users", user.uid, "datasets", String(start.year()));
    const unsub = onSnapshot(docRef, (snap) => {
      const data = snap.data() || {};
      setEntries(data.entries || {});
    });
    return () => unsub();
  }, [user]);

  const saveEntries = async (newMap) => {
    const { start } = academicYearFor();
    const docRef = doc(db, "users", user.uid, "datasets", String(start.year()));
    await setDoc(docRef, { entries: newMap }, { merge: true });
  };

  const handleToggleDay = (dateStr, current) => {
    const order = [null, "A", "G", "F"];
    const next = order[(order.indexOf(current) + 1) % order.length];
    const updated = { ...entries };
    if (!next) delete updated[dateStr];
    else updated[dateStr] = next;

    const formattedDate = dayjs(dateStr, "YYYY-MM-DD").format("DD/MM/YYYY");

    saveEntries(updated)
      .then(() => {
        toast.success(`Giorno ${formattedDate} impostato a ${next || "vuoto"}`);
      })
      .catch((err) => {
        toast.error("Errore nel salvataggio");
        console.error(err);
      });
    setEntries(updated);
  };

  const handlePrevMonth = () => {
    const current = dayjs().year(yearMonth.year).month(yearMonth.month);
    const prev = current.subtract(1, "month");
    setYearMonth({ year: prev.year(), month: prev.month() });
  };

  const handleNextMonth = () => {
    const current = dayjs().year(yearMonth.year).month(yearMonth.month);
    const next = current.add(1, "month");
    setYearMonth({ year: next.year(), month: next.month() });
  };

  // Se l'utente non è loggato, mostra la schermata di accesso
  if (!user)
    return (
      <>
        <AuthGate />
        <ToastContainer position="bottom-right" theme="colored" />
      </>
    );

  // Se l'utente è loggato, calcola i dati e mostra la dashboard
  const { start, end } = academicYearFor();

  return (
    <>
      <Navbar expand="lg" className="glass rounded-bottom-4 mb-4">
        <Container>
          <Navbar.Brand>Assenze Alloggio</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <div className="d-flex align-items-center gap-2">
              <span className="text-secondary small d-none d-lg-block">
                {user.displayName}
              </span>
              <Button
                size="sm"
                variant="outline-danger"
                className="rounded-pill"
                onClick={logout}
              >
                Esci
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="pb-4">
        <Row className="mb-4">
          <Col>
            <Dashboard entries={entries} showProgress={true} />
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={7} md={12}>
            <CalendarGrid
              year={yearMonth.year}
              month={yearMonth.month}
              entries={entries}
              onToggleDay={handleToggleDay}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              academicStart={start}
              academicEnd={end}
            />
          </Col>
          <Col lg={5} md={12}>
            <Dashboard entries={entries} showStats={true} />
          </Col>
        </Row>
      </Container>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="colored"
      />
    </>
  );
}
