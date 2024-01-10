import axios, { AxiosError } from "axios";

const LogIn = async (values: { email: string; password: string; }) => {

    if (values.email === "" || values.password === "") {
      // TODO: toast.warn("Please fill all the fields!");
      return;
    }

  try {

    let { data } = await axios.post(
      `${URL}/accounts/login/`,
      {
        email: values.email,
        password: values.password,
      },
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    if (!data.data.is_verified) {
      // TODO: toast.warn("Please verify your email!");
      navigate("/otp", { state: { email: values.email } });
      return;
    }
    console.log("logged");
    // TODO: toast.success("Logged in successfully!");

    localStorage.setItem("refresh", data.token.refresh);
    localStorage.setItem("access", data.token.access);
    localStorage.setItem("user_id", data.data.user_id);

    const User = await userData(data.data.user_id);
    dispatch({ type: "LOGIN", payload: { ...User } });

    navigate("/", { state: { user_id: data.data.user_id } });
  } catch (error) {
    const e = error as AxiosError;
    console.log(error);
    if (e.response?.status === 400) {
      // TODO: toast.error(error.response.data.message);
    } else if (e.response?.status === 404) {
      console.log(error);
      navigate("/error");
    } else {
      // TODO: toast.error("Something went wrong!");
    }
  }
};

export default LogIn;
