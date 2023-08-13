import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingButton from "../UI/LoadingButton";
import "./EditProfile.css";
import { useAuthContext } from "../../Hooks/useAuthContext";

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [prevData, setprevData] = useState(null);
  const [inputErrorFname, setinputErrorFname] = useState(false);
  const [inputErrorLname, setinputErrorLname] = useState(false);
  const [inputErrorPhone, setinputErrorPhone] = useState(false);
  const [inputErrorAddress, setinputErrorAddress] = useState(false);
  const { user, dispatch } = useAuthContext();

  // const fetchProfileData = async (user_id) => {
  //   try {
  //     let { data } = await axios.get(
  //       `http://localhost:8000/accounts/profile/${user_id}`
  //     );
  //     setprevData(data);
  //     console.log("Data", data);
  //   } catch (error) {
  //     if (error) {
  //       toast.error("Some error happened while retrieving your previous data");
  //     }
  //   }
  // };
  const registerUser = async () => {
    try {
      setLoading(true);
      const user_id = localStorage.getItem("user_id");
      let { data } = await axios.put(
        `http://localhost:8000/accounts/profile/${user_id}/`,
        {
          first_name: prevData.first_name,
          last_name: prevData.last_name,
          phone: prevData.phone,
          address: prevData.address,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      dispatch({ type: "LOGIN", payload: prevData });

      toast.success("Profile updated successfully");

      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
    setLoading(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleChange = (e) => {
    if (e.target.name === "fname") {
      if (e.target.value.length > 30 || e.target.value.length === 0) {
        setinputErrorFname(true);
      } else {
        setinputErrorFname(false);
      }
    } else if (e.target.name === "lname") {
      if (e.target.value.length > 30 || e.target.value.length === 0) {
        setinputErrorLname(true);
      } else {
        setinputErrorLname(false);
      }
    } else if (e.target.name === "address") {
      if (e.target.value.length > 100 || e.target.value.length === 0) {
        setinputErrorAddress(true);
      } else {
        setinputErrorAddress(false);
      }
    } else if (e.target.name === "number") {
      if (
        e.target.value.length > 10 ||
        e.target.value.length < 10 ||
        !Number(e.target.value)
      ) {
        setinputErrorPhone(true);
      } else {
        setinputErrorPhone(false);
      }
    }
  };

  useEffect(() => {
    // const user_id = localStorage.getItem("user_id");
    // fetchProfileData(user_id);
    setprevData(user);
    console.log("hye");
  }, [user]);
  return (
    <div className="editContainer">
      <div className="editContainerLeft">
        <h1 className="logo-h1">Sangnet</h1>
      </div>
      <div className="editContainerRight">
        <div className="form-container sign-up">
          <div className="edit_text">
            <h1>Edit your profile </h1>
          </div>
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            autoComplete="off"
          >
            {/* name */}
            <div className="name_container">
              {/* FirstName */}
              <div className="form-group">
                <label htmlFor="fname" className="input-label">
                  First Name{" "}
                </label>
                <input
                  type="text"
                  name="fname"
                  id="fname"
                  autoComplete="off"
                  value={prevData?.first_name}
                  onChange={(e) => {
                    setprevData({ ...prevData, first_name: e.target.value });
                    handleChange(e);
                  }}
                  className="class_fname"
                />
                {inputErrorFname && (
                  <p className="errorProfileMsg">enter a valid name</p>
                )}
              </div>

              {/* LastName */}
              <div className="form-group">
                <label htmlFor="lname" className="input-label">
                  Last Name{" "}
                </label>
                <input
                  type="text"
                  name="lname"
                  id="lname"
                  autoComplete="off"
                  value={prevData?.last_name}
                  onChange={(e) => {
                    setprevData({ ...prevData, last_name: e.target.value });
                    handleChange(e);
                  }}
                />
                {inputErrorLname && (
                  <p className="errorProfileMsg">enter a valid name</p>
                )}
              </div>
            </div>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="input-label">
                Email{" "}
              </label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="off"
                value={prevData?.email}
                readOnly
              />
            </div>

            {/* address */}
            <div className="form-group">
              <label htmlFor="address" className="input-label">
                Address{" "}
              </label>
              <input
                type="address"
                name="address"
                id="address"
                autoComplete="off"
                value={prevData?.address}
                onChange={(e) => {
                  setprevData({ ...prevData, address: e.target.value });
                  handleChange(e);
                }}
              />
              {inputErrorAddress && (
                <p className="errorProfileMsg">enter a valid address</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label htmlFor="date" className="input-label">
                Date of Birth{" "}
              </label>
              <input
                type="date"
                name="date"
                id="date"
                autoComplete="off"
                style={{ color: "black" }}
                value={prevData?.date_of_birth}
                readOnly
              />
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="number" className="input-label">
                Phone Number{" "}
              </label>
              <input
                type="number"
                name="number"
                id="number"
                autoComplete="off"
                value={prevData?.phone}
                onChange={(e) => {
                  setprevData({ ...prevData, phone: e.target.value });
                  handleChange(e);
                }}
              />
              {inputErrorPhone && (
                <p className="errorProfileMsg">enter a valid number</p>
              )}
            </div>
            {/* Adhaar card number */}
            <div className="form-group">
              <label htmlFor="adhaar_number" className="input-label">
                Adhaar Card Number{" "}
              </label>
              <input
                type="number"
                name="adhaar_number"
                id="adhaar_number"
                autoComplete="off"
                value={prevData?.adhaar_number}
                readOnly
              />
            </div>

            {/* Submit button  */}
            <div className="buttons">
              <LoadingButton
                text={"Edit Profile"}
                loading={loading}
                onClick={() => {
                  registerUser();
                  console.log(prevData);
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
