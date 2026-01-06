import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Badge, Spinner, Button } from "react-bootstrap";
import { useBoardStore } from "./hooks/useBoardStore";
import formatTime from "./utils/formatTime";
import type { Card } from "./types/index";
import DashboardTopBar from "./components/dashboard/DashboardTopBar";

// const PRIORITIES: Record<string, { label: string; variant: string }> = {
//   low: { label: "Low", variant: "info" },
//   medium: { label: "Medium", variant: "warning" },
//   high: { label: "High", variant: "danger" },
// };

const tableStyles: React.CSSProperties = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  borderRadius: "18px",
  overflow: "hidden",
  backdropFilter: "blur(43px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const headerStyles: React.CSSProperties = {
  color: "var(--text-primary)",
  fontWeight: 600,
  fontSize: "14px",
  padding: "16px 20px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
};

const cellStyles: React.CSSProperties = {
  padding: "8px 20px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  color: "var(--text-primary)",
  fontSize: "14px",
};

const rowStyles: React.CSSProperties = {
  transition: "background 0.2s ease",
};

const summaryRowStyles: React.CSSProperties = {
  fontWeight: 600,
};

export default function Summary() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const loadBoard = useBoardStore((state) => state.loadBoard);
  const columns = useBoardStore((state) => state.columns);
  const boardTitle = useBoardStore((state) => state.boardTitle);
  const loading = useBoardStore((state) => state.loading);

  useEffect(() => {
    if (boardId) {
      loadBoard(boardId);
    }
  }, [boardId, loadBoard]);

  const allCards = useMemo(() => {
    return columns.flatMap((col) => col.cards || []);
  }, [columns]);

  const totalLoggedTime = useMemo(() => {
    return allCards.reduce((total, card) => {
      return total + (card.logged_time || 0);
    }, 0);
  }, [allCards]);

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
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid>
      {/* <div className="d-flex justify-content-between align-items-center mb-3">
        <h2
          className="mb-0"
          style={{
            color: "var(--text-primary)",
            fontWeight: 600,
            fontSize: "24px",
          }}
        >
          {boardTitle || "Board"}
          <i className="bi bi-arrow-right mx-3"></i>
          Summary
        </h2>
        <Button
          variant="outline-secondary"
          onClick={() => navigate(boardId ? `/${boardId}` : "/")}
          style={{
            borderColor: "rgba(255, 255, 255, 0.2)",
            color: "var(--text-primary)",
          }}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Board
        </Button>
      </div> */}

      <div className="mb-3">
        <DashboardTopBar
          openAddColumnModal={() => setAddColumnModalShow(true)}
        />
      </div>

      {allCards.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "rgba(22, 24, 33, 0.9)",
            backdropFilter: "blur(43px)",
          }}
        >
          <p style={{ color: "var(--text-muted)", margin: 0 }}>
            No tasks found in this board.
          </p>
        </div>
      ) : (
        <div
          className="card"
          style={{
            padding: 0,
            background: "transparent",
            backdropFilter: "blur(43px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "18px",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyles}>
              <thead>
                <tr>
                  <th style={{ ...headerStyles, textAlign: "left" }}>Title</th>
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
                {allCards.map((card: Card, index: number) => (
                  <tr
                    key={card.id}
                    style={{
                      ...rowStyles,
                      background:
                        index % 2 === 0
                          ? "transparent"
                          : "rgba(255, 255, 255, 0.01)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.03)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        index % 2 === 0
                          ? "transparent"
                          : "rgba(255, 255, 255, 0.01)";
                    }}
                  >
                    <td
                      style={{
                        ...cellStyles,
                        fontWeight: 500,
                      }}
                      className="text-muted"
                    >
                      {card.title}
                    </td>
                    <td style={{ ...cellStyles, textAlign: "center" }}>
                      {card.priority ? (
                        // <Badge
                        //   bg={PRIORITIES[card.priority]?.variant || "secondary"}
                        //   style={{
                        //     fontSize: "12px",
                        //     padding: "4px 10px",
                        //     borderRadius: "6px",
                        //   }}
                        // >
                        //   {" "}
                        // </Badge>
                        <span style={{ color: "var(--text-muted)" }}>
                          {card.priority.toUpperCase()}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>-</span>
                      )}
                    </td>
                    <td style={{ ...cellStyles, color: "var(--text-muted)" }}>
                      {formatDate(card.created_at)}
                    </td>
                    <td
                      style={{
                        ...cellStyles,
                        textAlign: "right",
                        fontWeight: 500,
                        color: "var(--accent-blue)",
                      }}
                    >
                      {formatLoggedTime(card.logged_time)}
                    </td>
                  </tr>
                ))}
                <tr
                  style={{
                    ...summaryRowStyles,
                    background:
                      allCards.length % 2 === 0
                        ? "transparent"
                        : "rgba(255, 255, 255, 0.01)",
                  }}
                >
                  <td
                    colSpan={3}
                    style={{
                      ...cellStyles,
                      textAlign: "left",
                      color: "var(--text-primary)",
                      fontSize: "15px",
                    }}
                  >
                    {/* TOTAL LOGGED TIME: */}
                  </td>
                  <td
                    style={{
                      ...cellStyles,
                      textAlign: "right",
                      color: "var(--accent-blue)",
                      fontSize: "15px",
                    }}
                  >
                    {formatTotalLoggedTime(totalLoggedTime)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Container>
  );
}
