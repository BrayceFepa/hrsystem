import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteConfirmation = ({ show, onHide, onConfirm, title = 'Confirm Delete', message = 'Are you sure you want to delete this item? This action cannot be undone.' }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="bg-gradient-to-r from-red-600 to-red-800 text-white border-b border-red-500">
        <Modal.Title className="text-xl font-semibold">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message}
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button className="btn btn-danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmation;
