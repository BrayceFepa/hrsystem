import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationDialog = ({ 
  show, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  variant = 'primary'
}) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationDialog;
