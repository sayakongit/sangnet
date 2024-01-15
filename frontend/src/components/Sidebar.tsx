"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Home, History, UserRoundCog } from "lucide-react";

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

  const router = useRouter();

  return (
    <section className="h-[100vh] w-[20vw] text-center bg-primary text-white fixed">
      <div className="mt-6 mb-20">
        <h1 id="logo">Sangnet</h1>
      </div>
      <div className="mx-2 flex flex-col items-center justify-center">
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
    </section>
  );
};
