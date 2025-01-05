
import * as yup from "yup";

const Editschema = yup.object().shape({
    name: yup.string().required("Name is required"),
    organization: yup.string().required("Organization is required"),
    time: yup
        .string()
        .required("Date & Time is required")
        .test("valid-date", "Please enter a valid date", (value) => value && !isNaN(new Date(value).getTime())),
    type: yup.string().required("Type is required"),
    status: yup.string().required("Status is required"),
});

export default Editschema