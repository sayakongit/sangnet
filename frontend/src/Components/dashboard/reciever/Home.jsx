import { useState, useEffect } from "react";
import "./Home.css";
import pin from "../../Assets/pin.png";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Modal from "@mui/material/Modal";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LoopIcon from "@mui/icons-material/Loop";
import LoadingButton from "../../UI/LoadingButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Map, { Marker } from "react-map-gl";
import person from "../../Assets/person.png";
import bloodBank from "../../Assets/blood-bank.png";
import bloodBankData from "../../../Data/blood_banks.json";
import { useAuthContext } from "../../../Hooks/useAuthContext";
import { getDistance } from "geolib";
import donorImage from "../../Assets/donor.png";

const Home = () => {
  const navigate = useNavigate();

  const sidebarProp = {
    home: true,
    historyReciever: false,
    rewards: false,
    donor: false,
    recieverPage: true,
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
  // modal
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    border: "none",
    borderRadius: "10px",
    p: 4,
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [value, setValue] = useState("1");
  const [loading, setLoading] = useState(false);
  const [nearByData, setNearByData] = useState([]);
  const [donorData, setDonorData] = useState([]);
  const [donorBloodGroupData, setDonorBloodGroupData] = useState([]);
  const [lastDonated, setLastDonated] = useState([]);
  const [donorRequestData, setDonorRequestData] = useState({
    blood_group: "",
    last_donated: "",
  });
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const { user, dispatch } = useAuthContext();
  const [buttonText, setButtonText] = useState(
    user ? user.donor_application_status : ""
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const url = `http://localhost:8000`;
  const token = localStorage.getItem("access");
  const user_id = localStorage.getItem("user_id");

  const [donorLocations, setDonorLocations] = useState([]);
  const [inputErrorDate, setinputErrorDate] = useState(false);

  const [mapState, setMapState] = useState({
    longitude: 88.3832,
    latitude: 22.518,
    zoom: 15,
  });

  const [bloodBanksLocation, setBloodBanksLocation] = useState([]);

  const checkAccess = async () => {
    if (token !== null) {
      try {
        await axios.post(
          `${url}/accounts/token/verify/`,
          {
            token: token,
          },
          {
            headers: {
              "Content-type": "application/json",
            },
          }
        );
      } catch (error) {
        if (error.response.status === 401) {
          toast.error("Please login again!");
          navigate("/login");
          return;
        }
      }
    } else {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
  };

  useEffect(() => {
    if (user?.donor_application_status === "AP") {
      setButtonText("Applied for Donor");
    } else if (user?.donor_application_status == "NA") {
      setButtonText("Be a donor");
    } else if (user?.donor_application_status == "VR") {
      setButtonText("Go to Donor Dashboard");
    }
    console.log("changed button text");
  }, [user]);

  const fetchNearbyDonorData = async (user_id) => {
    try {
      const { data } = await axios.get(`${url}/donor/nearby/${user_id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setNearByData(data);
      for (let i = 0; i < data.length; i++) {
        setDonorLocations((prev) => [
          ...prev,
          [data[i].latitude, data[i].longitude],
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const findNearbyBloodBanks = (radiusKm) => {
    const nearbyBloodBanks = bloodBanksLocation
      .map((bloodBank) => {
        const distance = getDistance(
          { latitude: latitude, longitude: longitude },
          { latitude: bloodBank.latitude, longitude: bloodBank.longitude }
        );
        return {
          ...bloodBank,
          distance: distance / 1000, // Convert distance from meters to kilometers
        };
      })
      .filter((bloodBank) => bloodBank.distance <= radiusKm);

    // Sort the nearby blood banks by distance (from lower to higher)
    nearbyBloodBanks.sort((a, b) => a.distance - b.distance);

    return nearbyBloodBanks;
  };

  const fetchUserProfile = async (user_id) => {
    try {
      const { data } = await axios.get(`${url}/accounts/profile/${user_id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setDonorData(data);
      setLongitude(parseFloat(data.coordinates.longitude));
      setLatitude(parseFloat(data.coordinates.latitude));

      setMapState({
        longitude: parseFloat(data.coordinates.longitude),
        latitude: parseFloat(data.coordinates.latitude),
        zoom: 15,
        
      });
    } catch (error) {
      console.log(error);
    }
  };

  const donorOptions = () => {
    if (user?.donor_application_status == "AP") {
      console.log("applied");
    } else if (user?.donor_application_status == "NA") {
      handleOpen();
    } else if (user?.donor_application_status == "VR") {
      navigate("/donor-dashboard");
    }
    // const btn = document.getElementById("donorStatusButton");
    // const text = btn.innerText;
    // if (text === "NA") {
    //   handleOpen();
    // } else if (text === "Go to Donor Dashboard") {
    //   navigate("/donor-dashboard");
    // } else if (text === "Applied for Donor") {
    // } else {
    //   console.log("Not an Option");
    // }
  };

  useEffect(() => {
    if (user_id === null) {
      navigate("/login", { replace: true });
      toast.error("Please login first!");
      console.log("nearby ", nearByData);
      return;
    }
    checkAccess();
    fetchNearbyDonorData(user_id);
    setBloodBanksLocation(bloodBankData.blood_banks);
    fetchUserProfile(user_id);
  }, []);

  const nearbyBloodBanks = findNearbyBloodBanks(5);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleBloodGroupChange = (event) => {
    setDonorBloodGroupData(event.target.value);
    setDonorRequestData({
      ...donorRequestData,
      blood_group: event.target.value,
    });
  };

  const handleRequiredOnChange = (event) => {
    setLastDonated(event.target.value);
    const current = new Date();
    const date = new Date(event.target.value);
    if (current.getFullYear() === date.getFullYear()) {
      if (date.getMonth() > current.getMonth()) {
        setinputErrorDate(true);
      } else if (
        date.getMonth() === current.getMonth() &&
        date.getDate() > current.getDate()
      ) {
        setinputErrorDate(true);
      } else {
        setinputErrorDate(false);
      }
    }

    setDonorRequestData({
      ...donorRequestData,
      last_donated: event.target.value,
    });
  };

  const handleDonorRequest = async () => {
    try {
      if (donorRequestData.blood_group === "") {
        toast.warn("Blood Group field cannot be empty ");
      } else {
        const { data } = await axios.post(
          `${url}/donor/apply/`,
          { user_id: user_id, blood_group: donorRequestData.blood_group },
          {
            headers: { " Content-Type": "application/json" },
          }
        );
        dispatch({
          type: "UPDATE",
          payload: "AP",
        });
        setDonorData(data);
        handleClose();
        // console.log(data);
        toast.success("Request submitted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const goto__request = () => {
    navigate("/request");
  };

  return (
    <div className="homeContainer">
      <div className="homeLeft">
        <div className="sidebarComponent">
          <Sidebar {...sidebarProp} />
        </div>
      </div>
      <div className="homeRight">
        <div className="headerComponent">
          {/* */}
          <Header />
        </div>
        <div className="donor">
          <div className="donorList">
            <Box
              sx={{
                width: "95%",
                typography: "body1",
              }}
              className="tabBox"
            >
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Nearby Donors" value="1" />
                    <Tab label="Nearby Blood Banks" value="2" />
                  </TabList>
                </Box>

                <TabPanel value="1">
                  {nearByData && nearByData.length !== 0 ? (
                    nearByData.map((data) => (
                      <div className="donorContainer" key={data.donor_id}>
                        <div className="detailbox">
                          <div className="donorDetails">
                            <div className="donorName">
                              <h2>{data.name}</h2>
                            </div>
                            <div className="donorAddress">
                              <h4>Blood Group - {data.blood_group}</h4>
                              <h4>
                                {data.donation_count} donations made till now
                              </h4>
                            </div>
                          </div>
                          <div className="donorDistance">
                            <LocationOnIcon />
                            <p>{data.distance} Kms away</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>
                      Sorry! No nearby donors found. Please try again later!
                    </p>
                  )}
                </TabPanel>
                <TabPanel value="2" className="tab-panel">
                  {nearbyBloodBanks && nearbyBloodBanks.length !== 0 ? (
                    nearbyBloodBanks.map((data, index) => (
                      <div className="donorContainer" key={index}>
                        <div className="detailbox hospital">
                          <div className="donorDetails">
                            <div className="donorName">
                              <h2>{data.name}</h2>
                            </div>
                            <div className="donorAddress">
                              <h4>
                                Blood Types Available: <br />
                                {data["blood"]?.join(", ")}
                              </h4>
                            </div>
                          </div>
                          <div className="donorDistance">
                            <LocationOnIcon />
                            <p>{data.distance.toFixed(1)} Kms away</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>
                      Sorry! No nearby blood banks found. Please try again
                      later!
                    </p>
                  )}
                </TabPanel>
              </TabContext>
            </Box>
          </div>
          <div className="map-area">
            <h3 className="map-area-heading">Nearby Donors & Bloodbanks</h3>

            {user?.coordinates?.longitude && user?.coordinates?.latitude ? (
              <Map
                mapboxAccessToken="pk.eyJ1Ijoic2F5YWsxMCIsImEiOiJjbGp2amwwZWIwMXdsM2Vsb2FvMjViYzUwIn0.OlDv7VNB3W_UlYCuh6PpQA"
                initialViewState={mapState}
                style={{ width: 600, height: 340 }}
                mapStyle="mapbox://styles/mapbox/streets-v9"

              >
                  <Marker 
                    longitude={longitude}
                    latitude={latitude}
                    anchor="bottom"
                  >
                  <img style={{ width: "26px", height: "40px" }} src={pin} alt="pin" />
                  </Marker>
                  
                {donorLocations.map((location, index) => (
                  <Marker
                    key={index}
                    longitude={location[1]}
                    latitude={location[0]}
                    anchor="bottom"
                  >
                    <img src={person} alt="pin" />
                  </Marker>
                ))}

                {bloodBanksLocation.map((location, index) => (
                  <Marker
                    key={index}
                    longitude={location.longitude}
                    latitude={location.latitude}
                    anchor="bottom"
                  >
                    <img
                      src={bloodBank}
                      alt="pin"
                      style={{ width: "30px", height: "30px" }}
                    />
                  </Marker>
                ))}
              </Map>
            ) : (
              "Loading"
            )}
          </div>
        </div>
        <div className="home-footer">
          <div className="footer-card">
            <div>
              <div className="footer-card-content">
                <h3>Want to be a Donor?</h3>
              </div>
              <div className="footer-card-button">
                <button onClick={donorOptions}>{buttonText}</button>
              </div>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <form
                    onSubmit={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    <div className="form-group">
                      <label htmlFor="bloodGroup">Blood Group *</label>
                      <select
                        id="bloodGroup"
                        value={donorBloodGroupData}
                        onChange={handleBloodGroupChange}
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
                      <label htmlFor="requiredOn">Last donated on</label>
                      <input
                        id="requiredOn"
                        type="date"
                        value={lastDonated}
                        onChange={handleRequiredOnChange}
                        className="activecls"
                      />
                      {inputErrorDate && (
                        <p className="errorProfileMsg">
                          Future dates cannot be entered
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleDonorRequest}
                      className="requestDonorButton"
                    >
                      Submit
                    </button>
                  </form>
                </Box>
              </Modal>
            </div>
            <div>
              <img src={donorImage} alt="donor" />
            </div>
          </div>
        </div>
        {/* <div className="submitRequest">
              <LoadingButton
                text={"Submit Request"}
                loading={loading}
                onClick={goto__request}
              />
              
              <button id="donorStatusButton" onClick={donorOptions}>
                {buttonText}
              </button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <form
                    onSubmit={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    <div className="form-group">
                      <label htmlFor="bloodGroup">Blood Group *</label>
                      <select
                        id="bloodGroup"
                        value={donorBloodGroupData}
                        onChange={handleBloodGroupChange}
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
                      <label htmlFor="requiredOn">Last donated on</label>
                      <input
                        id="requiredOn"
                        type="date"
                        value={lastDonated}
                        onChange={handleRequiredOnChange}
                        className="activecls"
                      />
                      {inputErrorDate && (
                        <p className="errorProfileMsg">
                          Future dates cannot be entered
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleDonorRequest}
                      className="requestDonorButton"
                    >
                      Submit
                    </button>
                  </form>
                </Box>
              </Modal>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
