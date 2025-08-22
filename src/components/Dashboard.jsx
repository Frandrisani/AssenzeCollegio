import React, { useMemo } from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";
// 👇 LA CORREZIONE È ESATTAMENTE QUI. QUESTA RIGA DEVE ESSERE COSÌ.
import {
  computeStats,
  academicYearFor,
  ACADEMIC_LIMIT,
} from "../utils/dateUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import dayjs from "dayjs";

// Componente separato per la barra di progresso
const AbsencesProgress = ({ stats }) => (
  <Card className="glass p-3 rounded-4 h-100">
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <h5>Assenze Rimanenti</h5>
        <p className="text-secondary mb-0">Anno Accademico in corso</p>
      </div>
      <div className="text-end">
        <h3 className="mb-0">{stats.remaining}</h3>
        {/* Questa linea causa l'errore se ACADEMIC_LIMIT non è importato */}
        <span className="text-secondary">su {ACADEMIC_LIMIT}</span>
      </div>
    </div>
    <div className="progress-outer mt-3">
      <div className="progress-inner" style={{ width: stats.pct + "%" }}></div>
    </div>
    <div className="d-flex justify-content-between mt-1">
      <small className="text-secondary">0</small>
      {/* Anche questa linea causa l'errore */}
      <small className="text-secondary">{ACADEMIC_LIMIT}</small>
    </div>
  </Card>
);

// Componente separato per il grafico
const MonthlyChart = ({ stats, start, end }) => {
  const data = useMemo(() => {
    const months = [];
    let cur = start;
    while (cur.isBefore(end.add(1, "month"))) {
      const key = cur.format("YYYY-MM");
      const label = cur.format("MMM");
      const pm = stats.perMonth[key] || { A: 0, G: 0, F: 0 };
      months.push({ month: label, A: pm.A, G: pm.G, F: pm.F });
      cur = cur.add(1, "month");
    }
    return months;
  }, [stats, start, end]);

  const COLORS = { A: "#e74c3c", G: "#2ecc71", F: "#7f8c8d" };

  return (
    <Card className="glass p-3 rounded-4 h-100">
      <h5>Distribuzione mensile</h5>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
          >
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
            <Legend />
            <Bar dataKey="A" stackId="a" name="Assenze" fill={COLORS.A} />
            <Bar dataKey="G" stackId="a" name="Giustificate" fill={COLORS.G} />
            <Bar dataKey="F" stackId="a" name="Festivi" fill={COLORS.F} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default function Dashboard({
  entries,
  showProgress = false,
  showChart = false,
}) {
  const stats = useMemo(() => computeStats(entries), [entries]);
  const { start, end } = academicYearFor();

  return (
    <>
      {showProgress && <AbsencesProgress stats={stats} />}
      {showChart && <MonthlyChart stats={stats} start={start} end={end} />}
    </>
  );
}
