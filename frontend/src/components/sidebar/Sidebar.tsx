"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, History, UserRoundCog, RefreshCw } from "lucide-react";
import userDetails from "../state/GlobalState";
import StatusBtn from "./StatusBtn";

export const OuterSidebar = () => {
  return (
    <section className="h-[100vh] w-[35vw] grid place-content-center text-center bg-primary text-white fixed">
      <h1 id="logo">Sangnet</h1>
      <p className="">"Connecting Lives, Saving Futures."</p>
    </section>
  );
};

export const DashboardSideBar = (props: {
  home: boolean;
  history: boolean;
  donor: boolean;
  reciever: boolean;
}) => {
  const router = useRouter();
  const { user } = userDetails();

  const [btnProperty, setBtnProperty] = useState<any>({
    text: props.donor ? "Donor" : "Receiver",
    color: "white",
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

  const RecieverList = [
    { icon: Home, entry: props.home, text: "Home", url: "/" },
    {
      icon: History,
      entry: props.history,
      text: "Requests",
      url: "/history/reciever",
    },
  ];

  const DonorList = [
    { icon: Home, entry: props.home, text: "Home", url: "/donor" },
    {
      icon: History,
      entry: props.history,
      text: "Requests",
      url: "/history/donor",
    },
    {
      icon: UserRoundCog,
      entry: props.reciever,
      text: "Reciever",
      url: "/",
    },
  ];

  const CurrentList = props.donor ? DonorList : RecieverList;

  useEffect(() => {
    donorApplication(user);
  }, [user]);

  return (
    <section className="flex flex-col justify-between h-[100vh] w-[20vw] text-center bg-primary text-white fixed">
      <div className="mt-2">
        <h1 id="logo">Sangnet</h1>
      </div>
      <div className="mx-2 flex flex-col items-center justify-center mb-24">
        {CurrentList.map((btn, index) => {
          const Icon = btn.icon;
          return (
            <div key={index} className="my-2 2xl:my-3 w-full px-4">
              {btn.entry ? (
                <button className="sidebar-btn bg-white text-primary font-extrabold shadow-md shadow-black/40">
                  <Icon />
                  {btn.text}
                </button>
              ) : (
                <button
                  className="sidebar-btn bg-white/25 hover:bg-white/40 hover:shadow-md hover:shadow-black/40"
                  onClick={() => {
                    router.push(btn.url);
                  }}
                >
                  <Icon />
                  {btn.text}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <StatusBtn btnProperty={btnProperty} is_donor={props.donor} />
    </section>
  );
};
