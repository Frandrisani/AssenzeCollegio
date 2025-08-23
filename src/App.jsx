import React, { useEffect, useState } from "react";
import { Container, Navbar, Button, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import dayjs from "dayjs";

// Funzioni da firebase
import { onAuth, logout } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

// Componenti UI
import AuthGate from "./components/AuthGate";
import CalendarGrid from "./components/CalendarGrid";
import Dashboard from "./components/Dashboard";
import SplashScreen from "./components/SplashScreen"; // Assicurati di aver creato questo file

// Utility per le date
import { academicYearFor, isWithinAcademicYear } from "./utils/dateUtils";

// Stili
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  // --- STATI DELL'APPLICAZIONE ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Per gestire lo splash screen
  const [entries, setEntries] = useState({});

  // Gestione del tema con salvataggio in localStorage
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  // Logica per impostare il mese iniziale del calendario
  const [yearMonth, setYearMonth] = useState(() => {
    const today = dayjs();
    const { start, end } = academicYearFor();
    let initialDate = start; // Default: primo mese dell'anno accademico
    if (isWithinAcademicYear(today, { start, end })) {
      initialDate = today; // Se siamo nell'anno accademico, usa il mese corrente
    }
    return { year: initialDate.year(), month: initialDate.month() };
  });

  // --- EFFECTS ---

  // Effetto per applicare il tema al body
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Effetto per l'autenticazione
  useEffect(() => {
    const unsub = onAuth((u) => {
      setUser(u || null);
      setLoading(false); // Fine del caricamento
    });
    return () => unsub();
  }, []);

  // Effetto per la sincronizzazione dati con Firestore
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

  // --- FUNZIONI HANDLER ---

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

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

  // --- RENDERIZZAZIONE CONDIZIONALE ---

  // 1. Mostra lo splash screen mentre si verifica l'auth
  if (loading) {
    return (
      <>
        <SplashScreen />
        <ToastContainer position="bottom-right" theme={theme} />
      </>
    );
  }

  // 2. Se l'utente non è loggato, mostra la schermata di accesso
  if (!user) {
    return (
      <>
        <AuthGate />
        <ToastContainer position="bottom-right" theme={theme} />
      </>
    );
  }

  // 3. L'utente è loggato, mostra l'app principale
  const { start, end } = academicYearFor();
  return (
    <>
      <Navbar expand="lg" className="glass rounded-bottom-4 mb-4">
        <Container>
          <Navbar.Brand>Assenze Alloggio</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <div className="d-flex align-items-center gap-3">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={toggleTheme}
                className="rounded-pill"
              >
                {theme === "light" ? "🌙" : "☀️"}
              </Button>
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
