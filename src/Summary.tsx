import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useBoardStore } from "./store/useBoardStore";
import formatTime from "./utils/formatTime";
import type { Card } from "./types/index";
import BoardLoader from "./components/dashboard/BoardLoader";

const tableStyles: React.CSSProperties = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  borderRadius: "18px",
  overflow: "hidden",
  backdropFilter: "blur(43px)",
  color: "var(--fb-text-muted)",
  background: "var(--fb-bg2)",
  border: "1px solid var(--fb-border)",
};

const headerStyles: React.CSSProperties = {
  color: "var(--fb-text-muted)",
  fontWeight: 600,
  fontSize: "14px",
  padding: "16px 20px",
  borderBottom: "1px solid var(--fb-border)",
};

const cellStyles: React.CSSProperties = {
  padding: "8px 20px",
  borderBottom: "1px solid var(--fb-border)",
  color: "var(--fb-text-muted)",
  fontSize: "14px",
};

const rowStyles: React.CSSProperties = {
  transition: "background 0.2s ease",
  background: "var(--fb-bg2)",
};

const summaryRowStyles: React.CSSProperties = {
  fontWeight: 600,
};

const priorityClass = (priority?: string) => {
  switch (priority) {
    case "high":
      return "fb-priority fb-priority-high";
    case "medium":
      return "fb-priority fb-priority-medium";
    case "low":
      return "fb-priority fb-priority-low";
    default:
      return "fb-priority fb-priority-none";
  }
};

export default function Summary() {
  const { boardId } = useParams();
  const loadBoard = useBoardStore((state) => state.loadBoard);
  const columns = useBoardStore((state) => state.columns);
  const loading = useBoardStore((state) => state.loading);

  useEffect(() => {
    if (boardId) {
      loadBoard(boardId);
    }
  }, [boardId, loadBoard]);

  const allCards = useMemo(() => {
    return columns.flatMap((col) => col.cards || []);
  }, [columns]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatLoggedTime = (time?: number) => {
    if (!time) return "0h 0min";
    // Match the pattern used in TaskCard
    return formatTime(time, true);
  };

  const formatTotalLoggedTime = (time: number) => {
    return formatTime(time, true);
  };

  if (loading) {
    return <BoardLoader />;
  }

  return (
    <Container fluid className="px-3 py-4">
      {allCards.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "var(--fb-bg2)",
            backdropFilter: "blur(43px)",
          }}
        >
          <p style={{ color: "var(--text-muted)", margin: 0 }}>
            No tasks found in this board.
          </p>
        </div>
      ) : (
        <div
          style={{
            background: "transparent",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {columns.map((column) => {
              const columnCards = column.cards;
              const totalLoggedTimeForColumn = columnCards.reduce(
                (total, card) => total + (card.logged_time || 0),
                0,
              );

              return (
                <div key={column.id} style={{ width: "100%" }}>
                  <div className="fb-col-header" style={{ paddingBottom: 10 }}>
                    <span
                      className="fb-col-dot"
                      style={{ background: `var(--bs-${column.color})` }}
                    />
                    <span className="flex-grow-1">{column.title}</span>
                    <span className="fb-col-count">{columnCards.length}</span>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={tableStyles}>
                      <thead>
                        <tr>
                          <th style={{ ...headerStyles, textAlign: "left" }}>
                            Title
                          </th>
                          <th style={{ ...headerStyles, textAlign: "center" }}>
                            Priority
                          </th>
                          <th style={{ ...headerStyles, textAlign: "left" }}>
                            <i className="bi bi-calendar me-2"></i>
                            Created
                          </th>
                          <th style={{ ...headerStyles, textAlign: "right" }}>
                            <i className="bi bi-clock me-2"></i>
                            Logged Time
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {columnCards.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              style={{
                                ...cellStyles,
                                textAlign: "center",
                                fontSize: 12,
                                borderBottom: "1px solid var(--fb-border)",
                              }}
                            >
                              List is empty.
                            </td>
                          </tr>
                        ) : (
                          columnCards.map((card: Card, index: number) => (
                            <tr
                              key={card.id}
                              style={{
                                ...rowStyles,
                                background:
                                  index % 2 === 0
                                    ? "transparent"
                                    : "var(--fb-bg2)",
                              }}
                            >
                              <td style={{ ...cellStyles, width: "45%" }}>
                                {card.title}
                              </td>
                              <td
                                style={{
                                  ...cellStyles,
                                  textAlign: "center",
                                  width: "20%",
                                }}
                              >
                                <span className={priorityClass(card.priority)}>
                                  {card.priority ? card.priority : "Backlog"}
                                </span>
                              </td>
                              <td
                                style={{
                                  ...cellStyles,
                                  color: "var(--text-muted)",
                                  fontSize: "12px",
                                  width: "20%",
                                }}
                              >
                                {formatDate(card.created_at)}
                              </td>
                              <td
                                style={{
                                  ...cellStyles,
                                  textAlign: "right",
                                  fontSize: "12px",
                                  fontFamily: "DM Mono",
                                }}
                              >
                                {formatLoggedTime(card.logged_time)}
                              </td>
                            </tr>
                          ))
                        )}

                        <tr
                          style={{
                            ...summaryRowStyles,
                            background:
                              columnCards.length % 2 === 0
                                ? "transparent"
                                : "rgba(255, 255, 255, 0.01)",
                          }}
                        >
                          <td
                            colSpan={3}
                            style={{
                              ...cellStyles,
                              textAlign: "left",
                              fontSize: "14px",
                            }}
                          >
                            TOTAL LOGGED TIME:
                          </td>
                          <td
                            style={{
                              ...cellStyles,
                              textAlign: "right",
                              fontSize: "14px",
                              fontFamily: "DM Mono",
                              fontWeight: 100,
                            }}
                          >
                            {formatTotalLoggedTime(totalLoggedTimeForColumn)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Container>
  );
}
