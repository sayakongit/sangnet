"use client";

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { RefreshCw } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import userDetails from "../state/GlobalState";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "react-storage-complete";
import { blood_groups, donor_apply, json_header } from "../constants/Const";

const StatusBtn = (props: { is_donor: boolean }) => {
  const router = useRouter();
  const [userId] = useLocalStorage("user_id", null);

  const { user, setUser } = userDetails();

  const [btnProperty, setBtnProperty] = useState<any>({
    text: props.is_donor ? "Donor" : "Receiver",
    color: "green-400",
    applied: false,
    verified: false,
  });

  const donorApplication = (
    user: { donor_application_status: string } | undefined
  ) => {
    if (user?.donor_application_status === "AP") {
      setBtnProperty({
        ...btnProperty,
        text: "Applied",
        color: "yellow-600",
        applied: true,
      });
    } else if (user?.donor_application_status == "NA") {
      setBtnProperty({
        ...btnProperty,
        color: "red-600",
      });
    } else if (user?.donor_application_status == "VR") {
      setBtnProperty({
        ...btnProperty,
        color: "green-400",
        applied: true,
        verified: true,
      });
    }
    console.log(btnProperty);
  };

  const [reqData, setReqData] = useState({
    blood_group: "",
    last_donated: "",
  });

  const handleDonorRequest = async () => {
    try {
      if (reqData.blood_group === "") {
        // TODO: toast.warn("Blood Group field cannot be empty ");
      } else {
        const { data } = await axios.post(
          donor_apply,
          { user_id: userId, blood_group: reqData.blood_group },
          {
            headers: json_header,
          }
        );
        setUser({
          ...user,
          donor_application_status: "AP",
        });
        // setDonorData(data);
        // handleClose();
        console.log(data);
        // TODO: toast.success("Request submitted successfully");
      }
    } catch (error) {
      const e = error as AxiosError;
      console.log(e.response?.data);
    }
  };

  const handleClick = () => {
    if (props.is_donor) {
      router.push("/");
      return;
    } else if (btnProperty.verified) {
      router.push("/donor");
      return;
    }
  };

  const VisitPage = () => {
    return (
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to Move {props.is_donor ? "Receiver" : "Donor"}'s page
            from {props.is_donor ? "Donor" : "Receiver"}'s Page
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    );
  };

  console.log(reqData);

  const ApplicationForm = () => {
    return (
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="px-8">
            Do You want to be a Donor ?
          </AlertDialogTitle>
          <div className="px-8">
            <div>
              <form onSubmit={handleDonorRequest} className="my-8">
                <div>
                  <label
                    htmlFor="blood_group"
                    className="block text-sm font-bold leading-6"
                  >
                    Your Blood Group
                  </label>
                  <div className="mt-3">
                    <select
                      name="blood_group"
                      id="blood_group"
                      className="w-full focus:outline-none bg-yellow-100/70 rounded-lg border-0 py-1.5 px-2 text-md font-normal"
                      required={true}
                      value={reqData.blood_group}
                      onChange={(e) => {
                        setReqData({
                          ...reqData,
                          blood_group: e.target.value,
                        });
                      }}
                    >
                      <option value={""}>Select Blood Group</option>
                      {blood_groups.map((option, index) => (
                        <option
                          key={index}
                          value={option}
                          className="focus:bg-white"
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="last_donated"
                    className="block text-sm font-bold leading-6"
                  >
                    Last Donated
                  </label>
                  <div className="mt-2">
                    <input
                      id="last_donated"
                      name="last_donated"
                      type="date"
                      value={reqData.last_donated}
                      autoComplete="last_donated"
                      required={true}
                      onChange={(e) => {
                        setReqData({
                          ...reqData,
                          last_donated: e.target.value,
                        });
                      }}
                      className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="w-full mt-8">
                  <button
                    type="submit"
                    className="mx-auto p-2 px-3 bg-primary text-white rounded-md"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    );
  };

  const ApplicationDiag = () => {
    return (
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approval Pending</AlertDialogTitle>
          <AlertDialogDescription>
            Your Request Has been submitted. Please wait for Donor Approval !
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Ok</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    );
  };

  var Component;

  if (btnProperty.verified) {
    Component = VisitPage;
  } else if (btnProperty.applied) {
    Component = ApplicationDiag;
  } else {
    Component = ApplicationForm;
  }

  useEffect(() => {
    donorApplication(user);
  }, [user]);

  return (
    <div className="mb-12 px-4">
      <div className="px-4">
        <h2
          className={`text-xl 2xl:text-2xl font-bold p-1 2xl:p-2 bg-white/20 rounded-3xl border ${
            btnProperty.applied
              ? `${
                  btnProperty.verified
                    ? "border-red-600 text-red-600"
                    : "border-yellow-500 text-yellow-500"
                }`
              : "border-green-500 text-green-500"
          }`}
        >
          {btnProperty.text}
        </h2>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="w-full items-center text-center">
            <button className="flex items-center gap-2 mx-auto text-xl mt-2 py-2 px-4 2xl:px-8 rounded-3xl hover:bg-white/20">
              <RefreshCw
                className={`${
                  !btnProperty.applied || btnProperty.verified ? "animate-spin" : "hover:animate-spin"
                }  bg-white/40 p-1 rounded-lg text-2xl`}
              />
              Change Mode
            </button>
          </div>
        </AlertDialogTrigger>
        <Component />
      </AlertDialog>
    </div>
  );
};

export default StatusBtn;
