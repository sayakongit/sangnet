import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import "./Login.css";
import { useFormik } from "formik";
import { signinSchema } from "../Schema/Schema";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import LoadingButton from "../UI/LoadingButton";
import { useLogin } from "../../Hooks/useLogin";

const Login = () => {
  const initialvalues = {
    email: "",
    password: "",
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialvalues,
      validationSchema: signinSchema,
      onSubmit: (values, action) => {
        // console.log(values);
        action.resetForm();
      },
    });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const URL = "http://localhost:8000";
  const token = localStorage.getItem("access");
  const { login, Loading } = useLogin();

  const access = async () => {
    if (token !== null) {
      console.log(`Access Token ${token}`);
      try {
        await axios.post(
          `${URL}/accounts/token/verify/`,
          {
            token: token,
          },
          {
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const loginUser = async (values) => {
    login(values);
    //   try {
    //     if (values.email === "" || values.password === "") {
    //       toast.warn("Please fill all the fields!");
    //       return;
    //     }

    //     setLoading(true);

    //     let { data } = await axios.post(
    //       `${URL}/accounts/login/`,
    //       {
    //         email: values.email,
    //         password: values.password,
    //       },
    //       {
    //         headers: {
    //           "Content-type": "application/json",
    //         },
    //       }
    //     );

    //     if (!data.data.is_verified) {
    //       toast.warn("Please verify your email!");
    //       navigate("/otp", { state: { email: values.email } });
    //       return;
    //     }
    //     console.log("logged");
    //     toast.success("Logged in successfully!");

    //     localStorage.setItem("refresh", data.token.refresh);
    //     localStorage.setItem("access", data.token.access);
    //     localStorage.setItem("user_id", data.data.user_id);

    //     navigate("/", { state: { user_id: data.data.user_id } });
    //   } catch (error) {
    //     console.log(error);
    //     if (error.response.status === 400) {
    //       toast.error(error.response.data.message);
    //     } else if (error.response.status === 404) {
    //       navigate("/error");
    //     } else {
    //       toast.error("Something went wrong!");
    //     }
    //   }

    //   setLoading(false);
  };
  // console.log(errors);

  useEffect(() => {
    access();
  }, []);

  return (
    <div>
      <Wapper>
        <Container_left>
          <h1> BloodLink </h1>
          <p>"Connecting Lives, Saving Futures."</p>
        </Container_left>
        <Container_right className="container_right login">
          <div className="form-container">
            <div className="auth-heading">
              <p>Log in to BloodLink</p>
            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="Email">
                <label htmlFor="email" className="input-label">
                  Email{" "}
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  autoComplete="off"
                  placeholder="Enter your Email ID"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {errors.email && touched.email ? (
                <div className="errors">
                  <p>{errors.email}</p>
                </div>
              ) : null}
              <div className="Password">
                <label htmlFor="password" className="input-label">
                  Password{" "}
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="off"
                  placeholder="Enter your Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {errors.password && touched.password ? (
                <div className="errors">
                  <p>{errors.password}</p>
                </div>
              ) : null}

              <div className="buttons">
                <LoadingButton
                  text={"Login"}
                  onClick={() => {
                    loginUser(values);
                  }}
                  loading={loading}
                />
              </div>

              <div className="form-bottom">
                Have not registered yet? <Link to="/signup">Sign up</Link>
              </div>
            </form>
          </div>
        </Container_right>
      </Wapper>
    </div>
  );
};
const Wapper = styled.div`
  margin: 0px;
  border: none;
  display: flex;
  flex-direction: row;
`;

const Container_left = styled.div`
  background: #850000;
  color: White;
  border: 2px solid #850000;
  width: 35vw;
  height: 100vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  h1 {
    background-color: #850000;
  }
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    background-color: #850000;
  }
  p {
    color: #ffffffca;
  }
`;

const Container_right = styled.div`
  padding: 30px;
  position: fixed;
  top: 100px;
  bottom: 100px;
  left: 700px;
  margin-left: 50px;
  margin-right: auto;
  color: black;
  /* border: 1px solid black; */
  border-radius: 10px;
  input {
    color: black;
  }
  overflow: auto;
`;

export default Login;
