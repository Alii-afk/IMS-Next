import { AiOutlineClose } from "react-icons/ai";

export const Modal = ({ onClose, title, children }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          <AiOutlineClose />
        </button>
      </div>
      <div>{children}</div>
    </div>
  </div>
);

export default Modal;
