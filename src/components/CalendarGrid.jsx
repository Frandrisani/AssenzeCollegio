import React from "react";
import { Card, Badge, Alert, Button } from "react-bootstrap";
import dayjs from "dayjs";
import { daysInMonth, monthName, ymd, isAugust } from "../utils/dateUtils";

export default function CalendarGrid({
  year,
  month,
  entries,
  onToggleDay,
  onPrevMonth,
  onNextMonth,
  academicStart,
  academicEnd,
}) {
  const days = daysInMonth(year, month);
  const startWeekday = dayjs(days[0]).isoWeekday() - 1;
  const blanks = Array(startWeekday).fill(null);
  const cells = [...blanks, ...days];
  const header = ["L", "M", "M", "G", "V", "S", "D"];

  // Logica per disabilitare le frecce
  const currentMonth = dayjs().year(year).month(month);
  const isFirstMonth = currentMonth.isSame(academicStart, "month");
  const isLastMonth = currentMonth.isSame(academicEnd, "month");

  return (
    <Card className="glass rounded-4 p-3 h-100">
      {/* --- MODIFICA PRINCIPALE: NUOVA NAVIGAZIONE --- */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onPrevMonth}
          disabled={isFirstMonth}
        >
          &lt;
        </Button>
        <h5 className="mb-0 text-center" style={{ width: "150px" }}>
          {monthName(month)} {year}
        </h5>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onNextMonth}
          disabled={isLastMonth}
        >
          &gt;
        </Button>
      </div>

      <div
        className="d-grid"
        style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}
      >
        {header.map((h, i) => (
          <div
            key={i}
            className="text-center text-secondary small mb-1 fw-bold"
          >
            {h}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={"b" + i}></div>;
          const dateStr = d.format("YYYY-MM-DD");
          const s = entries[dateStr] || null;
          const disabled =
            !d.isAfter(academicStart.subtract(1, "day")) ||
            !d.isBefore(academicEnd.add(1, "day"));
          const august = isAugust(d);
          const cls = [
            "calendar-day",
            disabled || august ? "disabled" : "",
          ].join(" ");

          return (
            <div
              key={dateStr}
              className={cls}
              onClick={() => !disabled && !august && onToggleDay(dateStr, s)}
            >
              <div className="date-num">{d.date()}</div>
              <div className="d-flex justify-content-end align-items-end h-100">
                {s && <Badge className={"badge-status badge-" + s}>{s}</Badge>}
              </div>
            </div>
          );
        })}
      </div>
      <Alert
        variant="light"
        className="mt-3 text-center small p-2 mb-0 border-0"
      >
        <strong>Come funziona:</strong> clicca sui giorni per ciclare tra A → G
        → F → vuoto.
      </Alert>
    </Card>
  );
}
