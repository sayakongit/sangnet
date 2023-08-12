import React, { useState } from "react";
import "./Request.css"; // Import the CSS file for styling
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingButton from "../../UI/LoadingButton";
import { useNavigate } from "react-router-dom";

const Request = () => {
  const [loading, setLoading] = useState(false);
  const [requestedBy, setrequestedBy] = useState("");
  const [donationType, setDonationType] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [requiredOn, setRequiredOn] = useState("");
  const [PlaceOfDonation, setPlaceOfDonation] = useState("");
  const [numberOfUnits, setNumberOfUnits] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reason, setReason] = useState("");
  const [emergencyRequirement, setEmergencyRequirement] = useState(false);
  const [inputErrorDate, setinputErrorDate] = useState(false);
  const [inputErrorPhone, setinputErrorPhone] = useState(false);
  const [inputErrorUnits, setinputErrorUnits] = useState(false);
  const handlerequestedByChange = (event) => {
    setrequestedBy(event.target.value);
  };

  const handleDonationTypeChange = (event) => {
    setDonationType(event.target.value);
  };

  const handleBloodGroupChange = (event) => {
    setBloodGroup(event.target.value);
  };

  const handleRequiredOnChange = (event) => {
    setRequiredOn(event.target.value);
    const current = new Date();
    const date = new Date(event.target.value);
    if (current.getFullYear() === date.getFullYear()) {
      if (date.getMonth() < current.getMonth()) {
        setinputErrorDate(true);
      } else if (
        date.getMonth() === current.getMonth() &&
        date.getDate() < current.getDate()
      ) {
        setinputErrorDate(true);
      } else {
        setinputErrorDate(false);
      }
    }
  };
  const handlePlaceOfDonationChange = (event) => {
    setPlaceOfDonation(event.target.value);
  };
  const handleNumberOfUnitsChange = (event) => {
    setNumberOfUnits(event.target.value);
    if (event.target.value <= 0) {
      setinputErrorUnits(true);
    } else {
      setinputErrorUnits(false);
    }
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
    if (
      event.target.value.length < 10 ||
      event.target.value.length > 10 ||
      event.target.value.length === 0
    ) {
      setinputErrorPhone(true);
    } else {
      setinputErrorPhone(false);
    }
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const navigate = useNavigate();

  const handleEmergencyRequirementChange = (event) => {
    setEmergencyRequirement(event.target.checked);
  };
  const URL = "http://localhost:8000";

  const createRequest = async () => {
    const user_id = localStorage.getItem("user_id");
    setLoading(true);
    try {
      let { data } = await axios.post(
        `${URL}/donation/request/`,
        {
          requested_by: user_id,
          phone_number: phoneNumber,
          blood_group: bloodGroup,
          required_on: requiredOn,
          place_of_donation: PlaceOfDonation,
          units_required: numberOfUnits,
          type_of_donation: donationType,
          reason: reason,
          is_urgent: emergencyRequirement,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      toast.success("Request created successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
  };

  return (
    <div className="request-container">
      <h1 className="request-heading">Request for Donor</h1>
      <form className="request-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="donationType">Type of Donation</label>
          <select
            id="donationType"
            value={donationType}
            onChange={handleDonationTypeChange}
            className="activecls"
          >
            <option value="" className="active">
              Select a donation type
            </option>
            <option value="plasma">Plasma</option>
            <option value="blood">Blood</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="bloodGroup">Blood Group</label>
          <select
            id="bloodGroup"
            value={bloodGroup}
            onChange={handleBloodGroupChange}
            className="activecls"
          >
            <option value="">Select a blood group</option>
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="O+">O+</option>
            <option value="AB+">AB+</option>
            <option value="A-">A-</option>
            <option value="B-">B-</option>
            <option value="O-">O-</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="requiredOn">Required On</label>
          <input
            id="requiredOn"
            type="date"
            value={requiredOn}
            onChange={handleRequiredOnChange}
            className="activecls"
          />
          {inputErrorDate && (
            <p className="errorProfileMsg">Past dates cannot be entered</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="PlaceOfDonation">Place of Donation</label>
          <input
            id="PlaceOfDonation"
            type="text"
            value={PlaceOfDonation}
            onChange={handlePlaceOfDonationChange}
            className="activecls placeOfDonation"
          />
        </div>

        <div className="form-group">
          <label htmlFor="numberOfUnits">Number of Units</label>
          <input
            id="numberOfUnits"
            type="number"
            value={numberOfUnits}
            onChange={handleNumberOfUnitsChange}
            className="activecls"
          />
          {inputErrorUnits && (
            <p className="errorProfileMsg">
              Number of units cannot be negative or zero
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            type="number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className="activecls"
          />
          {inputErrorPhone && (
            <p className="errorProfileMsg">Enter a valid phone number</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason(Optional)</label>
          <textarea
            id="reason"
            value={reason}
            onChange={handleReasonChange}
            className="activecls"
          />
        </div>

        <div className="form-group emergencyRequirementBox">
          <label htmlFor="emergencyRequirement">
            <input
              id="emergencyRequirement"
              type="checkbox"
              checked={emergencyRequirement}
              onChange={handleEmergencyRequirementChange}
            />
            Emergency Requirement
          </label>
        </div>
        <LoadingButton
          text={"Submit Request"}
          loading={loading}
          onClick={createRequest}
        />
      </form>
    </div>
  );
};

export default Request;
