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
import { Box } from "@mui/material";
import ThemeToggleButton from "../UI/ThemeToggleButton";

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

  const themeColor = localStorage.getItem("theme");

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Box
        sx={{
          display: "flex",
          margin: 0,
          flexDirection: "row",
          height: "100vh",
          scrollBehavior: "smooth",
          border: "none",
        }}
      >
        <div
          style={{
            backgroundColor: "#40339f",
            color: "white",
            border: "2px solid #40339f;",
            width: "35vw",
            height: "100vh",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 className="logo-h1"> Sangnet </h1>
          <p>"Connecting Lives, Saving Futures."</p>
        </div>
        <div style={{ display: "flex", flex : 2, flexDirection: "column-reverse" }}>
          <div
            style={{
              // paddingLeft: "30px",
              display : "grid",
              placeItems : "center",

              // position: "fixed",
              // top: "100px",
              // bottom: "100px",
              // left: "700px",
              // marginLeft: "50px",
              // marginRight: "auto",
              color: "black",
              borderRadius: "10px",
              overflow: "auto",
            }}
          >
            <Box className="form-container">
              <Box className="auth-heading">
                <h6
                  className="auth-heading"
                  style={{
                    color:
                      themeColor === null || themeColor === "light"
                        ? "black"
                        : "white",
                  }}
                >
                  Log in to Sangnet
                </h6>
              </Box>
              <form onSubmit={handleSubmit} autoComplete="off">
                <Box className="Email">
                  <label
                    style={{
                      color:
                        themeColor === null || themeColor === "light"
                          ? "black"
                          : "white",
                    }}
                    htmlFor="email"
                    className="input-label"
                  >
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
                </Box>
                {errors.email && touched.email ? (
                  <Box className="errors">
                    <p>{errors.email}</p>
                  </Box>
                ) : null}
                <Box className="Password">
                  <label
                    style={{
                      color:
                        themeColor === null || themeColor === "light"
                          ? "black"
                          : "white",
                    }}
                    htmlFor="password"
                    className="input-label"
                  >
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
                </Box>
                {errors.password && touched.password ? (
                  <Box className="errors">
                    <p>{errors.password}</p>
                  </Box>
                ) : null}

                <Box className="buttons">
                  <LoadingButton
                    text={"Login"}
                    onClick={() => {
                      loginUser(values);
                    }}
                    loading={loading}
                  />
                </Box>

                <Box className="form-bottom">
                  <span
                    style={{
                      color:
                        themeColor === null || themeColor === "light"
                          ? "black"
                          : "white",
                    }}
                  >
                    Have notregistered yet?{" "}
                  </span>
                  <Link to="/signup">Sign up</Link>
                </Box>
              </form>
            </Box>
          </div>
          <div style={{display : "flex" , flex : 1 , justifyContent : "flex-end" , alignItems : "flex-start" , padding : "1.5rem"}}>
            <ThemeToggleButton />
          </div>
        </div>
      </Box>
    </Box>
  );
};
// const Box = styled.Box`
//   margin: 0px;
//   border: none;
//   display: flex;
//   flex-direction: row;
// `;

// const Container_left = styled.Box`
//   background: #40339f;
//   color: White;
//   border: 2px solid #40339f;
//   width: 35vw;
//   height: 100vh;
//   text-align: center;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   p {
//     color: #ffffffca;
//   }
// `;

// const Box = styled.Box`
//   padding: 30px;
//   position: fixed;
//   top: 100px;
//   bottom: 100px;
//   left: 700px;
//   margin-left: 50px;
//   margin-right: auto;
//   color: black;
//   /* border: 1px solid black; */
//   border-radius: 10px;
//   input {
//     color: black;
//   }
//   overflow: auto;
// `;

export default Login;
