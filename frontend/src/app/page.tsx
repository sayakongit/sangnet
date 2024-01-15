"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "react-storage-complete";
import { useToast } from "@/components/ui/use-toast";
import { getNearbyBanks } from "@/components/server/BankManager";
import userDetails, { User } from "@/components/state/GlobalState";
import {
  json_header,
  nearby_donor,
  verify_token,
} from "@/components/constants/Const";
import axios, { AxiosError } from "axios";
import { getUserData } from "@/components/server/UserManager";
import { DashboardSideBar } from "@/components/Sidebar";
import Header from "@/components/Header";

const Dashboard = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loggedIn } = userDetails() as User;
  const [access, setAccess] = useLocalStorage("access", null);
  const [userId, setUserId] = useLocalStorage("user_id", null);

  const [longitude, setLongitude] = useState<any>(null);
  const [latitude, setLatitude] = useState<any>(null);
  const [donorData, setDonorData] = useState([]);
  const [nearByData, setNearByData] = useState([]);
  const [mapState, setMapState] = useState({
    longitude: 88.3832,
    latitude: 22.518,
    zoom: 15,
  });
  const [buttonText, setButtonText] = useState(
    user ? user.donor_application_status : ""
  );
  const [donorLocations, setDonorLocations] = useState<any[][]>([]);
  const [bloodBanksLocation, setBloodBanksLocation] = useState<any[]>([]);

  const donorApplication = (
    user: { donor_application_status: string } | undefined
  ) => {
    if (user?.donor_application_status === "AP") {
      setButtonText("Applied for Donor");
    } else if (user?.donor_application_status == "NA") {
      setButtonText("Be a donor");
    } else if (user?.donor_application_status == "VR") {
      setButtonText("Go to Donor Dashboard");
    }
    console.log("changed button text");
  };

  const fetchNearbyDonorData = async (user_id: any) => {
    try {
      const { data } = await axios.get(`${nearby_donor}${user_id}`, {
        headers: json_header,
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

  const fetchUserProfile = async (user_id: any) => {
    try {
      const [_, data] = await getUserData(user_id);

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

  const checkAccess = async () => {
    if (access !== null) {
      try {
        await axios.post(
          verify_token,
          {
            token: access,
          },
          {
            headers: json_header,
          }
        );
      } catch (error) {
        const e = error as AxiosError;
        console.error(e.response?.data);
        if (e.response?.status === 401) {
          toast({
            variant: "destructive",
            title: "Something Went Wrong",
            description: "Please login again!",
          });
          router.push("/login");
          return;
        } else {
          toast({
            variant: "destructive",
            title: "Not Logged in",
            description: "Please login First!",
          });

          router.push("/login");
          return;
        }
      }
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    if (!userId) {
      router.push("/login");
    }
    checkAccess();
    fetchNearbyDonorData(userId);
    setBloodBanksLocation(getNearbyBanks());
    fetchUserProfile(userId);
    // Get Current Location
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     setMapState({
    //       longitude: position.coords.longitude,
    //       latitude: position.coords.latitude,
    //       zoom: 15,
    //     });
    //   });
    // }
  }, []);

  useEffect(() => {
    donorApplication(user);
  }, [user]);

  return (
    <main className="min-h-[100vh] grid place-content-center">
  
        <DashboardSideBar
          home={true}
          history={false}
          donor={false}
          reciever={false}
        />
   
      <div className="min-h-[100vh] w-[80vw] ml-[20vw]">
        <Header />
      </div>
    </main>
  );
};

export default Dashboard;
