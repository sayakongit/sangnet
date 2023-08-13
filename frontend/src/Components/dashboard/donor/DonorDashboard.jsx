import React, { useEffect, useState } from "react";
import "./DonorDashboard.css";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { LinearProgress, Alert, CircularProgress } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../Hooks/useAuthContext";
import dayjs from "dayjs";

const DonorDashboard = () => {
  const sidebarProp = {
    home: true,
    historyReciever: false,
    rewards: false,
    donor: true,
    recieverPage: false,
    active: {
      padding: "18px",
      border: "none",
      textAlign: "center",
      color: "#40339F",
      borderRadius: "8px",
      backgroundColor: "#fff",
      cursor: "pointer",
    },
  };

  const { user } = useAuthContext();
  const [donorData, setDonorData] = useState({
    level: 0,
    donation_required_to_reach_next_level: 0,
  });

  const url = "http://localhost:8000";
  const [response, setResponse] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const fetchPendingRequests = async (donor_id) => {
    try {
      let { data } = await axios.post(
        `${url}/donation/pending-request-list/`,
        {
          donor_id: donor_id,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setResponse(data);
      console.log("Pending", data);
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  const fetchDonorData = async (donor_id) => {
    try {
      const { data } = await axios.get(`${url}/donor/profile/${donor_id}`);
      setDonorData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptRequest = async (request_id) => {
    try {
      setLoader(true);
      const { data } = await axios.put(
        `${url}/donation/donation-status-update/${request_id}/`,
        {
          current_status: "active",
          donor_id: user?.donor_id,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      fetchPendingRequests(user?.donor_id);
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
    setLoader(false);
  };

  const fulfillRequest = async (request_id) => {
    try {
      const { data } = await axios.post(
        `${url}/donation/fullfill-donation/donor/${request_id}/`,
        {
          user_id: user?.id,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      fetchPendingRequests(user?.donor_id);
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  useEffect(() => {
    if (user === null) {
      return;
    } else if (user?.donor_id === "null") {
      toast.error("You haven't registered for donor yet!");
      navigate("/", { replace: true });
      return;
    } else {
      fetchPendingRequests(user?.donor_id);
      fetchDonorData(user?.donor_id);
    }
  }, [user]);

  return (
    <div className="donorPageConatiner">
      <div className="donorPageConatinerLeft">
        <Sidebar {...sidebarProp} />
      </div>
      <div className="donorPageConatinerRight">
        <div className="donorHeader">
          <Header />
        </div>
        <div className="donorBody">
          <div className="donor-body-top">
            <div className="pending-requests">
              <h3>Donation Requests </h3>
              {loader ? (
                <div className="loader-area">
                  <CircularProgress />
                </div>
              ) : (
                <div className="requests-box">
                  {response && response.length !== 0 ? (
                    response.map((item) => (
                      <div className="donation-card" key={item.request_id}>
                        <div className="d-card-content">
                          <h5>
                            {item.requested_by.first_name +
                              " " +
                              item.requested_by.last_name}
                          </h5>
                          <h5>{item.phone_number}</h5>
                          <h5>{item.blood_group}</h5>
                          <h5>{item.units_required} Units</h5>
                          <h5>1.3km away</h5>
                          <h5 className="tag">
                            {dayjs(item.required_on).format("DD/MM/YYYY")}
                          </h5>
                          <h5>{item.place_of_donation}</h5>
                          {item.is_urgent ? (
                            <h5 className="tag danger">EMERGENCY</h5>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="d-card-button">
                          {item.current_status == "active" &&
                          item.donor_approved == true ? (
                            <button className="btn-outline-pending">
                              {"Waiting for Reciever's Approval"}
                            </button>
                          ) : item.current_status === "active" ? (
                            <button
                              onClick={() => {
                                fulfillRequest(item.request_id);
                              }}
                              className="btn-outline-success"
                            >
                              Mark it as completed
                            </button>
                          ) : item.current_status === "pending" ? (
                            <button
                              onClick={() => {
                                acceptRequest(item.request_id);
                              }}
                            >
                              Accept
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <Alert severity="error">
                      No pending donations at the moment!
                    </Alert>
                  )}
                </div>
              )}
            </div>
            <div className="level-card">
              <h3>Profile Level</h3>
              <div className="level-card-box">
                <h5>Level</h5>
                <h1>{donorData.level.toFixed(1)}</h1>
                <LinearProgress variant="determinate" value={50} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
