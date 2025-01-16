import { useEffect, useState } from "react";
import { MdOutlineNumbers } from "react-icons/md";
import {
  GrCertificate,
  GrTechnology,
  GrChannels,
  GrCube,
} from "react-icons/gr";
import InputField from "../InputGroup/InputField";
import { Controller, useForm, useWatch, FormProvider } from "react-hook-form";

const StockModel = ({ userRole, currentRowData, handleCloseModal }) => {
  const [serialInputs, setSerialInputs] = useState([]);
  const methods = useForm();

  const { handleSubmit, control, register } = methods;

  const quantityNumber = useWatch({
    control: methods.control,
    name: "quantityNumber",
    defaultValue: 1,
  });

  useEffect(() => {
    const quantity = parseInt(quantityNumber) || 1;
    const newInputs = Array.from({ length: quantity }, (_, index) => ({
      id: `serialNumber${index + 1}`,
      value: "",
    }));
    setSerialInputs(newInputs);
  }, [quantityNumber]);

  // ✅ Handle form submission
  const onSubmit = async (data) => {
    const serial_no = Object.keys(data)
      .filter(
        (key) =>
          key.startsWith("serialNumber") &&
          data[key] &&
          data[key] !== null &&
          data[key] !== ""
      )
      .map((key) => data[key]);

    const submissionData = {
      sign_code: data.sign_code,
      codeplug: data.codeplug,
      channels: data.channels,
      unit:data.unit,
      serial_no,
    };

    console.log(submissionData);
    // const token = Cookies.get("authToken");

    // try {
    //   await axios.post(
    //     `${process.env.NEXT_PUBLIC_MAP_KEY}/api/warehouse-stock`,
    //     submissionData,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );

    //   toast.success("Stock successfully added!");

    //   // Reset the form fields
    //   methods.reset();

    //   methods.setValue("name", "");
    //   methods.setValue("model_name", ""); // Reset model name
    //   methods.setValue("manufacturer", ""); // Reset manufacturer

    //   // Clear serial number inputs
    //   setSerialInputs([]);
    // } catch (error) {
    //   toast.error("Error submitting stock data.");
    // }
  };

  return (
    <>
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
          <h2 className="text-xl font-bold mb-4">Add New Stock</h2>

          {/* ✅ FormProvider wraps all form inputs */}
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Quantity Number Input */}
              <InputField
                label="Enter the Quantity Number"
                name="quantityNumber"
                icon={MdOutlineNumbers}
                defaultValue={1}
                placeholder="Enter Quantity Number"
                type="number"
                {...register("quantityNumber")}
              />

              {/* Dynamic Serial Number Inputs */}
              {serialInputs.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Enter Serial Numbers
                  </h3>

                  <div
                    className={`${
                      serialInputs.length > 2
                        ? "overflow-x-auto hide-scrollbar"
                        : ""
                    } rounded-md`}
                  >
                    <div
                      className={`${
                        serialInputs.length > 2
                          ? "flex gap-4 overflow-x-auto w-max"
                          : `grid gap-4 ${
                              serialInputs.length === 1
                                ? "grid-cols-1"
                                : "grid-cols-2"
                            } w-full`
                      }`}
                    >
                      {serialInputs.map((input, index) => (
                        <Controller
                          key={input.id}
                          name={input.id}
                          control={control}
                          render={({ field }) => (
                            <InputField
                              {...field}
                              label={`Serial No. ${index + 1}`}
                              placeholder={`Enter Serial Number ${index + 1}`}
                              icon={MdOutlineNumbers}
                              type="text"
                            />
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Inputs */}
              <InputField
                label="Sign Code"
                name="sign_code"
                icon={GrCertificate}
                placeholder="Enter Sign Code"
                type="text"
                {...register("sign_code")}
              />
              <InputField
                label="Codeplug"
                name="codeplug"
                icon={GrTechnology}
                placeholder="Enter Codeplug"
                type="text"
                {...register("codeplug")}
              />
              <InputField
                label="Channels"
                name="channels"
                icon={GrChannels}
                placeholder="Enter Channels"
                type="text"
                {...register("channels")}
              />
              <InputField
                label="Unit"
                name="unit"
                icon={GrCube}
                placeholder="Enter Unit"
                type="text"
                {...register("unit")}
              />

              {/* Action Buttons */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-md px-4 py-2 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md px-4 py-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </FormProvider>

          {/* Close Button (X) */}
          <button
            onClick={handleCloseModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          >
            &times;
          </button>
        </div>
      </div>
    </>
  );
};

export default StockModel;
