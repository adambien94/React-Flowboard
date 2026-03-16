import { Spinner } from "react-bootstrap";

export default function FullPageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 gap-3">
      <Spinner animation="border" role="status" aria-label={label} />
      <div className="text-muted">{label}</div>
    </div>
  );
}

