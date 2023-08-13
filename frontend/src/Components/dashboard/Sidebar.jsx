import React from "react";
import "./Sidebar.css";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { useAuthContext } from "../../Hooks/useAuthContext";

const Sidebar = ({
  home,
  historyDonor,
  historyReciever,
  donor,
  recieverPage,
  active,
}) => {
  const navigate = useNavigate();
  // const access = localStorage.getItem("access");
  // const refresh = localStorage.getItem("refresh");
  // const url = "http://localhost:8000";
  // const { dispatch } = useAuthContext();
  // const signOut = async () => {
  //   try {
  //     let { data } = await axios.post(
  //       `${url}/accounts/logout/`,
  //       {
  //         refresh_token: refresh,
  //       },
  //       {
  //         headers: {
  //           "Content-type": "application/json",
  //           Authorization: `Bearer ${access}`,
  //         },
  //       }
  //     );
  //     localStorage.clear();
  //     toast.success("Signed out successfully");

  //     dispatch({ type: "LOGOUT" });
  //     navigate("/login", { replace: true });
  //   } catch (error) {
  //     console.log(error);
  //     if (error.response.status === 400) {
  //       toast.error(error.response.data.message);
  //     } else {
  //       toast.error("Something went wrong");
  //     }
  //   }
  // };

  return (
    <div>
      <div className="sidebar">
        <div className="logo">
          <h1>Sangnet</h1>
          {/* <button className="beDonor">Be a Donor!</button> */}
        </div>
        {donor ? (
          <ul className="list">
            {home ? (
              <button
                className="listItem"
                style={{
                  padding: active.padding,
                  border: active.border,
                  textAlign: active.textAlign,
                  color: active.color,
                  borderRadius: active.borderRadius,
                  backgroundColor: active.backgroundColor,
                  cursor: active.cursor,
                }}
              >
                <HomeIcon className="icon" />
                Home
              </button>
            ) : (
              <button
                className="listItem"
                onClick={() => {
                  navigate("/donor-dashboard");
                }}
              >
                <HomeIcon className="icon" />
                Home
              </button>
            )}

            {historyDonor ? (
              <button
                className="listItem"
                onClick={() => {
                  navigate("/history-donor");
                }}
                style={{
                  padding: active.padding,
                  border: active.border,
                  textAlign: active.textAlign,
                  color: active.color,
                  borderRadius: active.borderRadius,
                  backgroundColor: active.backgroundColor,
                  cursor: active.cursor,
                }}
              >
                <HistoryIcon className="icon" />
                Requests
              </button>
            ) : (
              <button
                className="listItem"
                onClick={() => {
                  navigate("/history-donor");
                }}
              >
                <HistoryIcon className="icon" />
                Requests
              </button>
            )}

            {recieverPage ? (
              <button
                className="listItem"
                style={{
                  padding: active.padding,
                  border: active.border,
                  textAlign: active.textAlign,
                  color: active.color,
                  borderRadius: active.borderRadius,
                  backgroundColor: active.backgroundColor,
                  cursor: active.cursor,
                }}
              >
                <AssignmentIndIcon className="icon" />
                Reciever's Page
              </button>
            ) : (
              <button
                className="listItem"
                onClick={() => {
                  navigate("/");
                }}
              >
                <AssignmentIndIcon className="icon" />
                Reciever's Page
              </button>
            )}

            <button className="signout donorExists" onClick={signOut}>
              <ExitToAppIcon className="icon signoutIcon" />
              Sign Out
            </button>
          </ul>
        ) : (
          <ul className="list">
            {home ? (
              <button
                className="listItem"
                onClick={() => {
                  navigate("/");
                }}
                style={{
                  padding: active.padding,
                  border: active.border,
                  textAlign: active.textAlign,
                  color: active.color,
                  borderRadius: active.borderRadius,
                  backgroundColor: active.backgroundColor,
                  cursor: active.cursor,
                }}
              >
                <HomeIcon className="icon" />
                Home
              </button>
            ) : (
              <button
                className="listItem"
                onClick={() => {
                  navigate("/");
                }}
              >
                <HomeIcon className="icon" />
                Home
              </button>
            )}

            {historyReciever ? (
              <button
                className="listItem"
                onClick={() => {
                  navigate("/history-reciever");
                }}
                style={{
                  padding: active.padding,
                  border: active.border,
                  textAlign: active.textAlign,
                  color: active.color,
                  borderRadius: active.borderRadius,
                  backgroundColor: active.backgroundColor,
                  cursor: active.cursor,
                }}
              >
                <HistoryIcon className="icon" />
                Requests
              </button>
            ) : (
              <button
                className="listItem"
                onClick={() => {
                  navigate("/history-reciever");
                }}
              >
                <HistoryIcon className="icon" />
                Requests
              </button>
            )}
            {/* <div id="google_translate_element"></div> */}
            {/* <button className="signout" onClick={signOut}>
              <ExitToAppIcon className="icon signoutIcon" />
              Sign Out
            </button> */}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
