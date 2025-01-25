import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }) {
  
  const getLayout = Component.getLayout ?? ((page) => page);
  
  return (
    <>
      {getLayout(<Component {...pageProps} />)}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
