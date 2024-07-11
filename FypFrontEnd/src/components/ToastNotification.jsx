import PropTypes from "prop-types";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = ({ children }) => {
  return (
    <div>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        limit={1}
      />
    </div>
  );
};

ToastNotification.propTypes = {
  children: PropTypes.node,
};

ToastNotification.defaultProps = {
  children: null,
};

const defaultOptions = {
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};

export const emitToast = (message, type = "default", options = {}) => {
  const toastType = {
    success: toast.success,
    error: toast.error,
    warning: toast.warn,
    info: toast.info,
    default: toast,
  };

  const showToast = toastType[type] || toastType.default;
  showToast(message, { ...defaultOptions, ...options });
};

export default ToastNotification;
