import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const notifySuccess = (message: string, options?: ToastOptions) => {
  return toast.success(message, { ...defaultOptions, ...options });
};

export const notifyError = (message: string, options?: ToastOptions) => {
  return toast.error(message, { ...defaultOptions, ...options });
};

export const notifyWarning = (message: string, options?: ToastOptions) => {
  return toast.warning(message, { ...defaultOptions, ...options });
};

export const notifyInfo = (message: string, options?: ToastOptions) => {
  return toast.info(message, { ...defaultOptions, ...options });
};