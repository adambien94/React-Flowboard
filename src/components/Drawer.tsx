import React from "react";
import { Offcanvas, ListGroup, Button, Badge } from "react-bootstrap";

interface DrawerProps {
  show: boolean;
  onHide: () => void;
}

export default function Drawer({ show, onHide }: DrawerProps) {
  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="start"
      backdrop={false}
      scroll={true}
      className="shadow-none"
      data-bs-theme="dark"
    >
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="fw-bold text-light">
          <i className="bi bi-kanban me-2"></i>
          Flowboard
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="p-0">
        <div className="p-3">
          {/* Quick Actions */}
          <div className="mb-4">
            <h6 className="text-muted mb-3">
              <i className="bi bi-lightning me-2"></i>
              Quick Actions
            </h6>
            <Button variant="primary" size="sm" className="w-100 mb-2">
              <i className="bi bi-plus-circle me-2"></i>
              Create Board
            </Button>
            <Button variant="outline-secondary" size="sm" className="w-100">
              <i className="bi bi-search me-2"></i>
              Search Cards
            </Button>
          </div>

          {/* Recent Boards */}
          <div className="mb-4">
            <h6 className="text-muted mb-3">
              <i className="bi bi-clock me-2"></i>
              Recent Boards
            </h6>
            <ListGroup variant="flush">
              <ListGroup.Item action className="border-0 py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">Todo Tasks</div>
                    <small className="text-muted">3 cards updated</small>
                  </div>
                  <Badge bg="danger" pill>
                    5
                  </Badge>
                </div>
              </ListGroup.Item>

              <ListGroup.Item action className="border-0 py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">In progress Tasks</div>
                    <small className="text-muted">2 cards updated</small>
                  </div>
                  <Badge bg="warning" pill>
                    8
                  </Badge>
                </div>
              </ListGroup.Item>

              <ListGroup.Item action className="border-0 py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">Done Tasks</div>
                    <small className="text-muted">1 card updated</small>
                  </div>
                  <Badge bg="success" pill>
                    12
                  </Badge>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </div>

          {/* Navigation Menu */}
          <div className="mb-4">
            <h6 className="text-muted mb-3">
              <i className="bi bi-grid me-2"></i>
              Navigation
            </h6>
            <ListGroup variant="flush">
              <ListGroup.Item action className="border-0 py-2">
                <i className="bi bi-house me-3"></i>
                Dashboard
              </ListGroup.Item>

              <ListGroup.Item action className="border-0 py-2">
                <i className="bi bi-star me-3"></i>
                Starred Boards
              </ListGroup.Item>

              <ListGroup.Item action className="border-0 py-2">
                <i className="bi bi-person me-3"></i>
                Personal
              </ListGroup.Item>

              <ListGroup.Item action className="border-0 py-2">
                <i className="bi bi-briefcase me-3"></i>
                Work
              </ListGroup.Item>
            </ListGroup>
          </div>

          {/* Settings */}
          <div className="border-top pt-3">
            <ListGroup variant="flush">
              <ListGroup.Item action className="border-0 py-2">
                <i className="bi bi-box-arrow-right me-3"></i>
                Logout
              </ListGroup.Item>
            </ListGroup>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
