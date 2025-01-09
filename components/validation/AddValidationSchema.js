import * as yup from "yup";

const addValidationSchema = yup.object().shape({
    // name: yup.string().required('Name is required'),
    // organization: yup.string().required('Organization is required'),
    // date_time: yup
    //   .string()
    //   .required('Date & Time is required')
    //   .test('valid-datetime', 'Invalid date format', (value) => {
    //     return !!value;
    //   }),
  });
  


export default addValidationSchema;


export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required'),
    password: yup
    .string()
    .required('Password is required')
})