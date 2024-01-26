"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios, { AxiosError } from "axios";
import { toast } from "../ui/use-toast";
import { useLocalStorage } from "react-storage-complete";
import { donor_apply, json_header } from "../constants/Const";
import userDetails from "../state/GlobalState";

const StatusBtn = (props: { btnProperty: any; is_donor: boolean }) => {
  const router = useRouter();
  const [userId, setUserId] = useLocalStorage("user_id", null);

  const { user, setUser } = userDetails();

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
    } else if (props.btnProperty.verified) {
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

  const ApplicationForm = () => {
    return (
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="">Do You want to be a Donor ?</AlertDialogTitle>
          <AlertDialogDescription className="px-8">
            <div>
              <form onSubmit={handleDonorRequest} className="my-8">
                <div>
                  <label
                    htmlFor="blood_group"
                    className="block text-sm font-bold leading-6"
                  >
                    Blood Group
                  </label>
                  <div className="mt-2">
                    <input
                      id="blood_group"
                      name="blood_group"
                      type="text"
                      autoComplete="blood_group"
                      required={true}
                      onChange={(e) => {
                        setReqData({
                          ...reqData,
                          blood_group: e.target.value,
                        });
                      }}
                      placeholder="Enter"
                      className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
                    />
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
                          last_donated: new Date(e.target.value).toISOString(),
                        });
                      }}
                      className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <button type="submit" className="mx-auto p-3 bg-primary text-white rounded-md mt-6">Submit Request</button>
              </form>
            </div>
          </AlertDialogDescription>
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

  if (props.btnProperty.verified) {
    Component = VisitPage;
  } else if (props.btnProperty.applied) {
    Component = ApplicationDiag;
  } else {
    Component = ApplicationForm;
  }

  return (
    <div className="mb-12 px-8">
      <h2
        className={`text-xl 2xl:text-2xl font-bold p-1 2xl:p-2 bg-white/20 rounded-3xl border border-${props.btnProperty.color} text-${props.btnProperty.color}`}
      >
        {props.btnProperty.text}
      </h2>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="flex items-center gap-2 mx-auto text-xl mt-2 py-2 px-4 2xl:px-16 rounded-3xl hover:bg-white/20">
            <RefreshCw
              className={`${
                props.btnProperty.applied
                  ? "hover:animate-spin"
                  : "animate-spin"
              }  bg-white/40 p-1 rounded-lg text-2xl`}
            />
            Change Mode
          </button>
        </AlertDialogTrigger>
        <Component />
      </AlertDialog>
    </div>
  );
};

export default StatusBtn;
