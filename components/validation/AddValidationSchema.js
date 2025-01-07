import * as yup from "yup";

const addValidationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    organization: yup.string().required('Organization is required'),
    date_time: yup
      .string()
      .required('Date & Time is required')
      .test('valid-datetime', 'Invalid date format', (value) => {
        return !!value;
      }),
    //   type: yup
    //   .string()
    //   .required('Type is required'),    // serialNo: yup.string().test('serial No-required', 'Serial No is required', function (value) {
    //   const { type } = this.parent; // Get 'type' from the parent form data
    //   if (type === 'Programming' && !value) {
    //     return this.createError({ message: 'Serial No is required' });
    //   }
    //   return true; // No validation if 'type' is not 'Programming'
    // }),
  
    // id: yup.string().test('id-required', 'ID is required', function (value) {
    //   const { type } = this.parent; // Access the parent form values (e.g., 'type')
    //   if (type === 'Programming' && !value) {
    //     return this.createError({ message: 'ID is required' });
    //   }
    //   return true; // If the type is not 'Programming', the id field is not required
    // }),
  
    // description: yup.string().test('description-required', 'Description is required', function (value) {
    //   const { type } = this.parent;
    //   if (type === 'Programming' && !value) {
    //     return this.createError({ message: 'Description is required' });
    //   }
    //   return true; // No validation for 'description' if 'type' is not 'Programming'
    // }),
  
    // pdfUpload: yup.mixed().test('pdf-upload-required', 'Supporting Document is required', function (value) {
    //   const { type } = this.parent;
    //   if (type === 'Programming') {
    //     if (!value) {
    //       return this.createError({ message: 'Supporting Document is required' });
    //     }
    //     // File size validation: limit to 10MB
    //     if (value.size > 10 * 1024 * 1024) {
    //       return this.createError({ message: 'File too large. Maximum size is 10MB' });
    //     }
    //   }
    //   return true; // No validation for 'pdfUpload' if 'type' is not 'Programming'
    // }),
  
    // notes: yup.string().test('notes-required', 'Notes are required', function (value) {
    //   const { type } = this.parent;
    //   if (type === 'New' && !value) {
    //     return this.createError({ message: 'Notes are required' });
    //   }
    //   return true; // No validation for 'notes' if 'type' is not 'New'
    // }),
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