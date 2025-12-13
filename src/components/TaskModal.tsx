import { useEffect } from "react";
import { Modal, Button, Spinner, Badge } from "react-bootstrap";
import { useTaskModalStore } from "../store/taskModalStore";
import { useBoardStore } from "../hooks/useBoardStore";

type TaskModalProps = {
  show: boolean;
  onHide: () => void;
};

const PRIORITIES: Record<string, string> = {
  low: "info",
  medium: "warning",
  high: "danger",
};

export default function TaskModal({ show, onHide }: TaskModalProps) {
  const { activeCardId } = useTaskModalStore();
  const { fetchCardDetails, cardDetails, setCardDetails } = useBoardStore();

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

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header
        closeButton
        style={{ borderBottom: "none" }}
        className="pt-4 px-4"
      ></Modal.Header>
      <Modal.Body className="pt-0 px-4">
        {cardDetails ? (
          <>
            <div className="d-flex align-items-center gap-3">
              <div>
                {cardDetails && (
                  <Badge
                    bg={PRIORITIES[cardDetails.priority as string]}
                    className="fs-6"
                  >
                    {" "}
                  </Badge>
                )}
              </div>

              <h4 className="mb-0">{cardDetails?.title}</h4>
            </div>
            <p className="my-4 text-muted fw-light">
              {cardDetails?.description}
            </p>
          </>
        ) : (
          <div className="text-center mt-3">
            <Spinner />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
