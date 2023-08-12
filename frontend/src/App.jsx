import { useState } from "react";
import "./App.css";
import Signin from "./Components/auth/Signin";
import Login from "./Components/auth/Login";
import Otp from "./Components/auth/Otp";

// import Error from "./Components/errorpages/Error";
import Home from "./Components/dashboard/reciever/Home";
import HistoryDonor from "./Components/dashboard/donor/HistoryDonor";
import HistoryReciever from "./Components/dashboard/reciever/HistoryReciever";
import Rewards from "./Components/dashboard/donor/Rewards";
import EditProfile from "./Components/dashboard/EditProfile";
import Header from "./Components/dashboard/Header";
import DonorDashboard from "./Components/dashboard/donor/DonorDashboard";
import Request from "./Components/dashboard/reciever/Request";
import Error from "./Components/errorpages/Error";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from "./context/AuthContext";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="app">
        <AuthContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/signup" element={<Signin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/otp" element={<Otp />} />
              {/* <Route path="/error" element={<Error />} /> */}
              <Route path="/" element={<Home />} />
              <Route path="/header" element={<Header />} />
              <Route path="/history-donor" element={<HistoryDonor />} />
              <Route path="/history-reciever" element={<HistoryReciever />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/donor-dashboard" element={<DonorDashboard />} />
              <Route path="/request" element={<Request />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </BrowserRouter>
        </AuthContextProvider>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
