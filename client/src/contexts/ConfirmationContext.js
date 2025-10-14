import React, { createContext, useState, useCallback } from 'react';
import ConfirmationDialog from '../components/common/ConfirmationDialog';

export const ConfirmationContext = createContext({});

export const ConfirmationProvider = ({ children }) => {
  const [state, setState] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'primary'
  });

  const confirm = useCallback(({ title, message, confirmText, cancelText, variant = 'primary' }) => {
    return new Promise((resolve) => {
      setState({
        show: true,
        title,
        message,
        confirmText,
        cancelText,
        variant,
        onConfirm: (confirmed) => {
          setState(prev => ({ ...prev, show: false }));
          resolve(confirmed);
        }
      });
    });
  }, []);

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      <ConfirmationDialog
        show={state.show}
        title={state.title}
        message={state.message}
        confirmText={state.confirmText}
        cancelText={state.cancelText}
        variant={state.variant}
        onConfirm={() => state.onConfirm(true)}
        onCancel={() => state.onConfirm(false)}
      />
    </ConfirmationContext.Provider>
  );
};
