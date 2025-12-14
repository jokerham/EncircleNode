import { toast } from 'react-toastify';

const unknowErrorMessage = 'Unknown Error';
const showToast = (message: Error | string | unknown, type: 'success' | 'warning' | 'error') => {
  const errorMessage = (message instanceof Error) ? (
    message.message
  ) : (
    (typeof message === 'string') ? message : unknowErrorMessage
  );

  toast(errorMessage, {
    type: type,
    position: 'top-right',
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    theme: 'light'
  });

  if (errorMessage === unknowErrorMessage) {
    console.log(message);
  }
};

export { showToast };