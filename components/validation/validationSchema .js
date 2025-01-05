// utils/validationSchema.js
import * as yup from "yup";

const validationSchema = yup.object().shape({
  stockName: yup.string().required("Stock Name is required."),
  modelNumber: yup.string().required("Model Number is required."),
  manufacturer: yup.string().required("Manufacturer is required."),
  serialNumber: yup.string().required("Serial Number is required."),
});

export default validationSchema;
