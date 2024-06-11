import React from 'react';
import './Modal.css';

const Modal = ({ message, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{message}</h2>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default Modal;
