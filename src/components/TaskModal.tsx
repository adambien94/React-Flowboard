import { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useTaskModalStore } from "../store/taskModalStore";
import { useBoardStore } from "../hooks/useBoardStore";
import ConfirmModal from "./ConfirmModal";
import { supabase } from "../api/supabaseClient";
import formatTime from "../utils/formatTime";

type TaskModalProps = {
  show: boolean;
  onHide: () => void;
};

export default function TaskModal({ show, onHide }: TaskModalProps) {
  const { activeCardId } = useTaskModalStore();
  const { fetchCardDetails, cardDetails, setCardDetails, updateCard } =
    useBoardStore();

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSteps, setAiSteps] = useState<string[] | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [confirmAiShow, setConfirmAiShow] = useState(false);

  useEffect(() => {
    if (activeCardId) fetchCardDetails(activeCardId);
  }, [activeCardId, fetchCardDetails, setCardDetails]);

  useEffect(() => {
    if (!show) {
      const timeout = setTimeout(() => {
        setCardDetails(null);
      }, 250);

      return () => clearTimeout(timeout);
    }
  }, [show, setCardDetails]);

  useEffect(() => {
    // Reset AI preview when opening a different card or closing the modal.
    if (!show || !activeCardId) {
      setAiSteps(null);
      setAiError(null);
      setConfirmAiShow(false);
      setIsGeneratingAi(false);
    } else {
      setAiSteps(null);
      setAiError(null);
      setConfirmAiShow(false);
      setIsGeneratingAi(false);
    }
  }, [activeCardId, show]);

  const formatStepsForPreview = (steps: string[]) => {
    return steps.map((s) => s.trim()).filter(Boolean);
  };

  const handleGenerateAiSteps = async () => {
    if (!activeCardId || !cardDetails) return;
    if (isGeneratingAi) return;

    setIsGeneratingAi(true);
    setAiError(null);

    try {
      const title = cardDetails.title;
      const description = cardDetails.description ?? "";

      const { data, error } = await supabase.functions.invoke(
        "generate-steps",
        {
          body: { title, description },
        },
      );

      if (error) {
        console.error(error);
        setAiError(`Nie udało się wygenerować kroków dla tego zadania.`);
        return;
      }

      const stepsRaw = (data as { steps?: unknown } | null | undefined)?.steps;
      const steps = Array.isArray(stepsRaw) ? stepsRaw : [];

      const cleaned = formatStepsForPreview(
        steps.filter((s): s is string => typeof s === "string"),
      ).slice(0, 5);

      if (!cleaned.length) {
        setAiError("AI nie zwróciło żadnych kroków. Spróbuj ponownie.");
        return;
      }

      setAiSteps(cleaned);
      setConfirmAiShow(true);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Wystąpił nieznany błąd";
      setAiError(`Wystąpił błąd podczas generowania kroków: ${msg}`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleConfirmSaveAi = async () => {
    if (!activeCardId) return;
    if (!aiSteps?.length) return;

    await updateCard(activeCardId, { taskSteps: aiSteps });
    // Make modal reflect the change immediately.
    if (cardDetails) {
      setCardDetails({ ...cardDetails, taskSteps: aiSteps });
    }

    setAiSteps(null);
    setConfirmAiShow(false);
  };

  const stepsToRender =
    aiSteps && aiSteps.length > 0 ? aiSteps : (cardDetails?.taskSteps ?? null);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="fb-modal"
      backdropClassName="fb-modal-backdrop"
      data-bs-theme="dark"
    >
      <div className="fb-modal-header">
        <div className="fb-modal-icon">
          <i className="bi bi-card-text"></i>
        </div>
        <span className="fb-modal-title">Card details</span>
        <button
          type="button"
          className="fb-modal-close"
          onClick={onHide}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="fb-modal-body">
        {cardDetails ? (
          <>
            <div className="fb-field" style={{ gap: 8 }}>
              <div className="fb-field-label">
                <i className="fb-field-label bi bi-text-left me-2"></i>
                <span>Title</span>
              </div>

              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--fb-text)",
                }}
              >
                {cardDetails.title}
              </div>
            </div>

            <div className="fb-field" style={{ gap: 8 }}>
              <div className="fb-field-label">
                <i className="bi bi-card-text me-2"></i>
                <span className="fb-field-label">Description</span>
              </div>

              <div
                style={{
                  fontSize: 14,
                  color: "var(--fb-text-muted)",
                  lineHeight: 1.5,
                  background: "var(--fb-bg3)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--fb-border)",
                  padding: "12px",
                }}
              >
                {cardDetails.description || "—"}
              </div>
            </div>

            <div className="mt-1">
              <button
                type="button"
                className="fb-btn fb-btn-primary"
                onClick={handleGenerateAiSteps}
                disabled={isGeneratingAi}
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                {isGeneratingAi ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <i className="bi bi-robot" />
                )}
                Wygeneruj kroki w AI
              </button>
              {aiError && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    color: "var(--fb-text-muted)",
                  }}
                >
                  <i className="bi bi-exclamation-circle mx-1"></i> {aiError}
                </div>
              )}
            </div>

            {stepsToRender && stepsToRender.length > 0 && (
              <div
                className="fb-field"
                style={{
                  marginTop: 8,
                  gap: 8,
                  border: "1px solid var(--fb-border)",
                  borderRadius: "var(--radius-sm)",
                  padding: 12,
                  background: "var(--fb-bg3)",
                }}
              >
                <div className="fb-field-label" style={{ marginBottom: 4 }}>
                  <i
                    className="bi bi-lightning-charge me-2"
                    style={{ color: "var(--fb-accent)" }}
                  ></i>
                  <span>Kroki działania (AI)</span>
                </div>
                <ol
                  style={{
                    margin: 0,
                    paddingLeft: 20,
                    fontSize: 14,
                    color: "var(--fb-text-muted)",
                  }}
                >
                  {stepsToRender.map((s, idx) => (
                    <li key={`${idx}-${s}`} style={{ marginBottom: 4 }}>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="d-flex justify-content-between" style={{ gap: 8 }}>
              <div className="col">
                <div className="fb-field-label">
                  <span>Priority</span>
                </div>

                <div
                  className="fb-priority fb-priority-none mt-2"
                  style={{ display: "inline-block" }}
                >
                  <i className="fb-field-label bi bi-record-fill me-2"></i>
                  {cardDetails.priority}
                </div>
              </div>
              <div className="col ">
                <i className="fb-field-label bi bi-clock me-2"></i>
                <span className="fb-field-label">Time logged</span>

                <div
                  className="mt-1"
                  style={{
                    fontSize: "14px",
                    color: "var(--fb-text-muted)",
                    fontFamily:
                      '"DM Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
                  }}
                >
                  {cardDetails.logged_time
                    ? formatTime(cardDetails.logged_time, true)
                    : "0h 0min "}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center" style={{ padding: "10px 0" }}>
            <Spinner data-testid="task-modal-spinner" />
          </div>
        )}
      </div>

      <div className="fb-modal-footer">
        <button
          type="button"
          className="fb-btn fb-btn-ghost"
          title="Delete card"
        >
          <i className="bi bi-trash me-2"></i>
          Delete
        </button>
        <button
          type="button"
          className="fb-btn fb-btn-ghost"
          onClick={onHide}
          style={{ marginLeft: "auto" }}
        >
          Close
        </button>
      </div>

      <ConfirmModal
        show={confirmAiShow}
        onHide={() => {
          setConfirmAiShow(false);
          setAiSteps(null);
          setAiError(null);
        }}
        onConfirm={handleConfirmSaveAi}
        title="Zapisz kroki wygenerowane przez AI?"
        btnVariant="primary"
        confirmBtnText="Zapisz"
        message={
          aiSteps && aiSteps.length
            ? `Zapisz poniższe kroki do pola taskSteps: ${aiSteps
                .map((s, idx) => `${idx + 1}. ${s}`)
                .join("; ")}`
            : "Zapisz wygenerowane kroki?"
        }
      />
    </Modal>
  );
}
