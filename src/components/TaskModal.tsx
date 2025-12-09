import { useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useTaskModalStore } from "../store/taskModalStore";
import { useBoardStore } from "../hooks/useBoardStore";

interface TaskModalProps {
  show: boolean;
  onHide: () => void;
}

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
      <Modal.Body className="pt-0 text-muted px-4">
        {cardDetails ? (
          <>
            <h3>{cardDetails?.title}</h3>

            <p className="mt-4">{cardDetails?.description}</p>

            <div>
              <span className="text-secondary">
                Priority: {cardDetails.priority?.toLocaleUpperCase()}
              </span>
            </div>
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
