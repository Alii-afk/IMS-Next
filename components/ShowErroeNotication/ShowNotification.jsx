import { useEffect } from "react";
import { toast } from "react-toastify";

export const ShowErrorNotifications = ({ result }) => {
  useEffect(() => {
    const showErrorNotifications = async () => {
      if (result?.isError) {
        const errorTitle = result.error?.data?.error;
        if (errorTitle && Array.isArray(result.error?.data?.message)) {
          for (let msg of result.error?.data?.message) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            toast.error(`${msg}`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        } else {
          toast.error(
            result.error?.data?.message ||
              "Please check your network connection",
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
        }
      }
    };

    showErrorNotifications();
  }, [result]);

  return <></>;
};
