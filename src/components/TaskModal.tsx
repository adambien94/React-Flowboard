import { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useTaskModalStore } from "../store/taskModalStore";
import { useBoardStore } from "../hooks/useBoardStore";
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
    setAiSteps(null);
    setAiError(null);
    setIsGeneratingAi(false);
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
        setAiError("Failed to generate steps for this task.");
        return;
      }

      const stepsRaw = (data as { steps?: unknown } | null | undefined)?.steps;
      const steps = Array.isArray(stepsRaw) ? stepsRaw : [];

      const cleaned = formatStepsForPreview(
        steps.filter((s): s is string => typeof s === "string"),
      ).slice(0, 5);

      if (!cleaned.length) {
        setAiError("AI did not return any steps. Try again.");
        return;
      }

      setAiSteps(cleaned);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Unknown error occurred";
      setAiError(`An error occurred while generating steps: ${msg}`);
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
  };

  const handleRejectAi = () => {
    setAiSteps(null);
    setAiError(null);
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
            <div className="fb-field fb-field-wide-gap">
              <div className="fb-field-label">
                <i className="fb-field-label bi bi-text-left me-2"></i>
                <span>Title</span>
              </div>

              <div className="fb-task-title-value">{cardDetails.title}</div>
            </div>

            <div className="fb-field fb-field-wide-gap">
              <div className="fb-field-label">
                <i className="bi bi-card-text me-2"></i>
                <span className="fb-field-label">Description</span>
              </div>

              <div className="fb-task-description-box">
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
                Generate AI steps
              </button>
              {aiError && (
                <div className="fb-ai-error">
                  <i className="bi bi-exclamation-circle mx-1"></i> {aiError}
                </div>
              )}
            </div>

            {stepsToRender && stepsToRender.length > 0 && (
              <div className="fb-field fb-ai-steps-box">
                <div className="fb-field-label fb-ai-steps-label">
                  <i className="bi bi-lightning-charge me-2 fb-ai-steps-icon"></i>
                  <span>Action steps (AI)</span>
                </div>
                <ol className="fb-ai-steps-list">
                  {stepsToRender.map((s, idx) => (
                    <li key={`${idx}-${s}`} className="fb-ai-step-item">
                      {s}
                    </li>
                  ))}
                </ol>
                {aiSteps?.length ? (
                  <div className="fb-ai-steps-actions">
                    <button
                      type="button"
                      className="fb-btn fb-btn-ghost"
                      onClick={handleRejectAi}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="fb-btn fb-btn-primary"
                      onClick={handleConfirmSaveAi}
                    >
                      Accept
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            <div className="d-flex justify-content-between fb-task-meta-row">
              <div className="col ">
                <div className="fb-field-label mt-1">
                  <span className="fb-field-label">Priority</span>
                </div>

                <div className="fb-priority fb-priority-none mt-2 fb-priority-badge-inline">
                  <i className="fb-field-label bi bi-record-fill me-2"></i>
                  {cardDetails.priority}
                </div>
              </div>
              <div className="col ">
                <i className="fb-field-label bi bi-clock me-2"></i>
                <span className="fb-field-label">Time logged</span>

                <div className="mt-1 fb-time-logged-value">
                  {cardDetails.logged_time
                    ? formatTime(cardDetails.logged_time, true)
                    : "0h 0min "}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center fb-modal-loading">
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
          className="fb-btn fb-btn-ghost fb-btn-ml-auto"
          onClick={onHide}
        >
          Close
        </button>
      </div>

    </Modal>
  );
}
