"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "react-storage-complete";
import { useToast } from "@/components/ui/use-toast";
import { getAllBanks, getNearbyBanks } from "@/components/server/BankManager";
import userDetails, { User } from "@/components/state/GlobalState";
import {
  MAP_ACCESS_TOKEN,
  json_header,
  nearby_donor,
  verify_token,
} from "@/components/constants/Const";
import axios, { AxiosError } from "axios";
import { getUserData } from "@/components/server/UserManager";
import { DashboardSideBar } from "@/components/Sidebar";
import Header from "@/components/Header";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPinned } from "lucide-react";
import Map, { Marker, NavigationControl } from "react-map-gl";
import { BLOOD_BANK_LOGO, DONOR_LOGO } from "@/components/constants/Assets";

import "mapbox-gl/dist/mapbox-gl.css";

const Dashboard = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loggedIn } = userDetails() as User;
  const [access, setAccess] = useLocalStorage("access", null);
  const [userId, setUserId] = useLocalStorage("user_id", null);

  const [longitude, setLongitude] = useState<any>(null);
  const [latitude, setLatitude] = useState<any>(null);
  const [donorData, setDonorData] = useState([]);
  const [allBanks, setAllBanks] = useState<any[]>([]);
  const [nearbyDonors, setNearbyDonors] = useState<any[]>([]);
  const [nearbyBloodBanks, setNearbyBloodBanks] = useState<any[]>([]);
  const [mapState, setMapState] = useState({
    longitude: 88.3832,
    latitude: 22.518,
    zoom: 15,
  });
  const [buttonText, setButtonText] = useState(
    user ? user.donor_application_status : ""
  );
  const [donorLocations, setDonorLocations] = useState<any[][]>([]);

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
      setNearbyDonors(data);
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
      // setMapState({
      //   longitude: parseFloat(data.coordinates.longitude),
      //   latitude: parseFloat(data.coordinates.latitude),
      //   zoom: 15,
      // });
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
    fetchUserProfile(userId);
    fetchNearbyDonorData(userId);
    setAllBanks(getAllBanks());
    setNearbyBloodBanks(getNearbyBanks(5, mapState));
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

      <div className="min-h-[100vh] w-[80vw] ml-[20vw] overflow-hidden">
        <Header />

        <section className="px-16 pt-4 2xl:pt-8 flex flex-row justify-between">
          {/* ==== TABS ==== */}

          <Tabs
            defaultValue="donors"
            className="w-[400px] 2xl:w-[500px] mt-8 2xl:mt-16"
          >
            <TabsList className="grid w-full grid-cols-2 bg-primary/40">
              <TabsTrigger className="text-white" value="donors">
                Nearby Donors
              </TabsTrigger>
              <TabsTrigger className="text-white" value="banks">
                Nearby Blood Banks
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="donors"
              className="rounded-lg px-6 py-4 h-80 2xl:h-96 overflow-y-scroll"
            >
              {nearbyDonors && nearbyDonors.length !== 0 ? (
                nearbyDonors.map((data) => (
                  <div className="w-full mb-6" key={data.donor_id}>
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-col w-1/2">
                        <div className="text-primary font-bold text-lg 2xl:text-xl">
                          <h2>{data.name}</h2>
                        </div>
                        <div className="text-gray-800">
                          <h4>
                            Blood Group is{" "}
                            <span className="text-gray-900 font-bold">
                              {data.blood_group}
                            </span>
                          </h4>
                          <h4 className="text-sm 2xl:text-md">
                            {data.donation_count} donations made till now
                          </h4>
                        </div>
                      </div>
                      <div className="flex flex-row text-md text-right text-primary font-bold">
                        <MapPinned className="mr-2" />
                        <p>{data.distance} KM</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="px-6 text-justify">
                  Sorry! No nearby donors found. Please try again later!
                </p>
              )}
            </TabsContent>
            <TabsContent
              value="banks"
              className="rounded-lg px-6 py-4 h-80 2xl:h-96 overflow-y-scroll"
            >
              {nearbyBloodBanks && nearbyBloodBanks.length !== 0 ? (
                nearbyBloodBanks.map((data, index) => (
                  <div className="w-full mb-6" key={index}>
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-col w-1/2">
                        <div className="text-primary font-bold text-lg 2xl:text-xl">
                          <h2>{data.name}</h2>
                        </div>
                        <div className="text-gray-800">
                          <h4 className="text-sm 2xl:text-md">
                            Blood Types Available: <br />
                            {data["blood"]?.join(", ")}
                          </h4>
                        </div>
                      </div>
                      <div className="flex flex-row text-md text-right text-primary font-bold">
                        <MapPinned className="mr-2" />
                        <p>{data.distance.toFixed(1)} KM</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="px-6 text-justify">
                  Sorry! No nearby blood banks found. Please try again later!
                </p>
              )}
            </TabsContent>
          </Tabs>

          {/* ==== MAP Area ==== */}

          <div className="px-6 2xl:px-10 md:pr-24 lg:pr-16 2xl:pr-10">
            <h3 className="text-primary font-bold text-xl my-4 text-center">
              Nearby Donors & Bloodbanks
            </h3>

            <div className="w-[450px] 2xl:w-full h-[320px] 2xl:h-full">
              {user?.coordinates?.longitude && user?.coordinates?.latitude ? (
                <Map
                  mapboxAccessToken={MAP_ACCESS_TOKEN}
                  initialViewState={mapState}
                  style={{ width: 700, height: 420 }}
                  mapStyle="mapbox://styles/mapbox/streets-v9"
                >
                  {donorLocations.map((location, index) => (
                    <Marker
                      key={index}
                      longitude={location[1]}
                      latitude={location[0]}
                      anchor="bottom"
                    >
                      <img src={DONOR_LOGO} alt="pin" />
                    </Marker>
                  ))}

                  {allBanks.map((location, index) => (
                    <Marker
                      key={index}
                      longitude={location.longitude}
                      latitude={location.latitude}
                      anchor="bottom"
                    >
                      <img
                        src={BLOOD_BANK_LOGO}
                        alt="pin"
                        style={{ width: "30px", height: "30px" }}
                      />
                    </Marker>
                  ))}

                  <NavigationControl />
                </Map>
              ) : (
                "Loading"
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
