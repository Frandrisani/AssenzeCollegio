import React, { useMemo } from "react";
import { Card } from "react-bootstrap";
import { computeStats, ACADEMIC_LIMIT } from "../utils/dateUtils";

// Componente per la barra di progresso (rimasto invariato)
const AbsencesProgress = ({ stats }) => (
  <Card className="glass p-3 rounded-4 h-100">
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <h5>Assenze Rimanenti</h5>
        <p className="text-secondary mb-0">Anno Accademico in corso</p>
      </div>
      <div className="text-end">
        <h3 className="mb-0">{stats.remaining}</h3>
        <span className="text-secondary">su {ACADEMIC_LIMIT}</span>
      </div>
    </div>
    <div className="progress-outer mt-3">
      <div className="progress-inner" style={{ width: stats.pct + "%" }}></div>
    </div>
    <div className="d-flex justify-content-between mt-1">
      <small className="text-secondary">0</small>
      <small className="text-secondary">{ACADEMIC_LIMIT}</small>
    </div>
  </Card>
);

// --- NUOVO COMPONENTE PER LE STATISTICHE ---
const StatsDisplay = ({ stats }) => (
  <Card className="glass p-3 rounded-4 h-100">
    <h5 className="mb-3">Riepilogo Assenze</h5>
    <ul className="list-group list-group-flush">
      <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 px-1 py-2">
        <span>- Assenze totali</span>
        <span className="badge bg-danger rounded-pill fs-6">
          {stats.counted || 0}
        </span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 px-1 py-2">
        <span>- Assenze questo mese</span>
        <span className="badge bg-danger rounded-pill fs-6">
          {stats.currentMonthAbsences || 0}
        </span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 px-1 py-2">
        <span>- Giustifiche totali</span>
        <span className="badge bg-success rounded-pill fs-6">
          {stats.totalJustified || 0}
        </span>
      </li>
      <li className="list-group-item d-flex flex-column align-items-start bg-transparent border-0 px-1 py-2">
        <span>- Mese con più assenze</span>
        <span className="fw-bold mt-1 text-primary">
          {stats.topMonth.name} ({stats.topMonth.count}{" "}
          {stats.topMonth.count === 1 ? "assenza" : "assenze"})
        </span>
      </li>
    </ul>
  </Card>
);

// Componente principale che decide cosa mostrare
export default function Dashboard({
  entries,
  showProgress = false,
  showStats = false,
}) {
  const stats = useMemo(() => computeStats(entries), [entries]);

  return (
    <>
      {showProgress && <AbsencesProgress stats={stats} />}
      {showStats && <StatsDisplay stats={stats} />}
    </>
  );
}
