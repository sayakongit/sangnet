import * as Yup from "yup";

export const signinSchema = Yup.object({
  fname: Yup.string().min(2).max(30).required("You must enter a valid name"),
  lname: Yup.string().min(2).max(30).required("You must enter a valid surname"),
  email: Yup.string().email().required("Please enter a valid email"),
  date: Yup.date().required("Please enter a valid date of birth"),
  address: Yup.string().required("Please enter your address"),
  phone_number: Yup.number(),
  number: Yup.number()
    .min(10)
    .positive()
    .integer()
    .required("You must enter a valid number"),
  adhaar_number: Yup.string()
    .min(12)
    .max(12)
    .required("You must enter a valid adhaar number"),
  password: Yup.string()
    .min(4)
    .required("Your password must be atleast 4 character long"),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Password must match"),
});
