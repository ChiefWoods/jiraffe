const Toast = ({ type, message, onClose }) => {
  const isSuccess = type === "success";
  const iconColor = isSuccess ? "green" : "red";
  const Icon = isSuccess ? SuccessIcon : ErrorIcon;

  return (
    <div
      className="fixed right-[24px] top-[30px] mb-4 flex w-full max-w-xs animate-toast-swoop items-center gap-x-2 rounded-lg border-[1px] border-slate-200 bg-white p-4 text-gray-500 drop-shadow-lg"
      role="alert"
    >
      <div
        className={`inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-${iconColor}-100 text-${iconColor}-500 dark:bg-${iconColor}-800 dark:text-${iconColor}-200`}
      >
        <Icon />
        <span className="sr-only">{isSuccess ? "Success" : "Error"} icon</span>
      </div>
      <div className="overflow-x-hidden text-ellipsis text-start text-sm font-normal">
        {message}
      </div>
      <button
        type="button"
        className="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <CloseIcon />
      </button>
    </div>
  );
};

const SuccessIcon = () => (
  <svg
    className="h-5 w-5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
  </svg>
);

const ErrorIcon = () => (
  <svg
    className="h-5 w-5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="h-3 w-3"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 14 14"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
    />
  </svg>
);

export default Toast;
