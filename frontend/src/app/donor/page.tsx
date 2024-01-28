"use client";

import {
  donor_data,
  fill_donor_request,
  json_header,
  pending_requests,
  update_donation,
} from "@/components/constants/Const";
import { Loader2, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import userDetails from "@/components/state/GlobalState";
import { DashboardSideBar } from "@/components/sidebar/Sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Donor = () => {
  const [loader, setLoader] = useState(false);
  const [reqData, setReqData] = useState<any>(null);
  const [donorData, setDonorData] = useState({
    level: 0,
    donation_required_to_reach_next_level: 0,
  });

  const router = useRouter();

  const { user } = userDetails();

  const acceptRequest = async (request_id: any) => {
    try {
      setLoader(true);
      const { data } = await axios.put(
        `${update_donation}${request_id}/`,
        {
          current_status: "active",
          donor_id: user?.donor_id,
        },
        {
          headers: json_header,
        }
      );
      // TODO: toast.success(data.message);
      fetchPendingRequests(user?.donor_id);
    } catch (error) {
      const e = error as AxiosError;
      console.log(e.response?.data);
      if (e.response?.status === 400) {
        // TODO: toast.error(error.response.data.message);
      } else {
        // TODO: toast.error("Something went wrong!");
      }
    }
    setLoader(false);
  };

  const fulfillRequest = async (request_id: any) => {
    try {
      const { data } = await axios.post(
        `${fill_donor_request}${request_id}/`,
        {
          user_id: user?.id,
        },
        {
          headers: json_header,
        }
      );
      // TODO: toast.success(data.message);
      fetchPendingRequests(user?.donor_id);
    } catch (error) {
      const e = error as AxiosError;
      console.log(e.response?.data);
      if (e.response?.status === 400) {
        // TODO: toast.error(error.response.data.message);
      } else {
        // TODO: toast.error("Something went wrong!");
      }
    }
  };

  const fetchPendingRequests = async (donor_id: any) => {
    try {
      let { data } = await axios.post(
        pending_requests,
        {
          donor_id: donor_id,
        },
        {
          headers: json_header,
        }
      );

      setReqData(data);
      console.log("Pending", data);
    } catch (error) {
      const e = error as AxiosError;
      console.log(e.response?.data);
      if (e.response?.status === 400) {
        // TODO: toast.error(error.response.data.message);
      } else {
        // TODO: toast.error("Something went wrong!");
      }
    }
  };

  const fetchDonorData = async (donor_id: any) => {
    try {
      const { data } = await axios.get(`${donor_data}${donor_id}`);
      setDonorData(data);
    } catch (error) {
      const e = error as AxiosError;
      console.log(e.response?.data);
    }
  };

  useEffect(() => {
    if (user === null) {
      return;
    } else if (user?.donor_id === "null") {
      // TODO: toast.error("You haven't registered for donor yet!");
      router.replace("/");
      return;
    } else {
      fetchPendingRequests(user?.donor_id);
      fetchDonorData(user?.donor_id);
    }
  }, [user]);

  return (
    <main className="min-h-[100vh] grid place-content-center">
      <DashboardSideBar
        home={true}
        history={false}
        donor={true}
        reciever={false}
      />

      <div className="min-h-[100vh] w-[80vw] ml-[20vw] overflow-hidden">
        <Header />

        <section className="grid grid-cols-3 px-12">
          <div id="requests" className="py-8 col-span-2 px-4">
            <h3 className="text-gray-700 text-2xl font-bold mb-8 text-center">
              Donation Requests
            </h3>

            {loader ? (
              <div className="flex flex-row gap-4 text-2xl text-center items-center justify-center py-8">
                <Loader2 className="animate-spin mr-2" />
                Loading...
              </div>
            ) : (
              <div id="requests-box">
                {reqData && reqData.length !== 0 ? (
                  reqData.map(
                    (item: {
                      request_id: React.Key | null | undefined;
                      requested_by: { first_name: string; last_name: string };
                      phone_number: any;
                      blood_group: string;
                      units_required: number;
                      required_on: any;
                      place_of_donation: string;
                      is_urgent: boolean;
                      current_status: string;
                      donor_approved: boolean;
                    }) => (
                      <div
                        className="bg-yellow-100/60 rounded-lg grid grid-cols-4 p-4 font-semibold text-gray-800"
                        key={item.request_id}
                      >
                        <div className="col-span-3 flex items-center flex-wrap gap-x-6 gap-y-2">
                          <h5>
                            {item.requested_by.first_name +
                              " " +
                              item.requested_by.last_name}
                          </h5>
                          <h5>{item.phone_number}</h5>
                          <h5>{item.blood_group}</h5>
                          <h5>{item.units_required} Units</h5>
                          <h5>1.3km away</h5>
                          <h5 className="p-2 bg-yellow-200/50 rounded-sm">
                            {new Date(item.required_on).toDateString()}
                          </h5>
                          <h5>{item.place_of_donation}</h5>
                          {item.is_urgent ? (
                            <h5 className="text-red-600 font-bold">
                              EMERGENCY
                            </h5>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="grid place-content-center">
                          {item.current_status == "active" &&
                          item.donor_approved == true ? (
                            <button className="px-3 p-2 rounded-md border-dashed border-2 text-orange-400 border-orange-400 hover:bg-yellow-500/20">
                              {"Waiting for Reciever's Approval"}
                            </button>
                          ) : item.current_status === "active" ? (
                            <button
                              onClick={() => {
                                fulfillRequest(item.request_id);
                              }}
                              className="px-3 p-2 rounded-md border-dashed border-2 text-green-500 border-green-500 hover:bg-green-500/30"
                            >
                              Mark it as completed
                            </button>
                          ) : item.current_status === "pending" ? (
                            <button
                              onClick={() => {
                                acceptRequest(item.request_id);
                              }}
                              className="px-5 p-3 rounded-md text-white text-xl bg-green-500 hover:bg-green-600"
                            >
                              Accept
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="py-8">
                    <Alert>
                    <AlertCircle />
                    <div>

                      <AlertTitle>No Requests Found</AlertTitle>
                      <AlertDescription>
                        No pending donations at the moment!
                      </AlertDescription>
                    </div>
                    </Alert>
                  </div>
                )}
              </div>
            )}
          </div>
          <div id="level" className="py-8 px-14">
            <h3 className="text-gray-700 text-2xl font-bold mb-8 text-center">
              Profile Level
            </h3>
            <div className="bg-primary text-center text-white pt-4 rounded-3xl">
              <h4 className="text-lg">Level</h4>
              <h1 className="text-[8rem] h-fit mt-[-1.4rem]">
                {donorData.level.toFixed(1)}
              </h1>
              {/* <Progress className="" value={33} /> */}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Donor;
