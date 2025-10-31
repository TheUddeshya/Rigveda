import React from 'react';
const Modal: React.FC<{open: boolean, onClose?: () => void, children?: React.ReactNode}> = ({ open }) =>
  open ? (<div>Modal: Feature coming soon</div>) : null;
export default Modal;
