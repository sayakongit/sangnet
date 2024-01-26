"use client";

import Header from "@/components/Header";
import { DashboardSideBar } from "@/components/Sidebar";
import React, { useEffect, useState } from "react";

import { columns, Request } from "./Columns";
import { DataTable } from "./DataTable";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { json_header, receiver_history } from "@/components/constants/Const";


const Reciever = () => {
  const router = useRouter();
  const [data, setData] = useState<Request[]>([]);

  const fetchRecieverHistory = async (user_id: string | null) => {
    try {
      let { data } = await axios.post(
        receiver_history,
        {
          requested_by: user_id,
        },
        {
          headers: json_header,
        }
      );
      setData(data);
    //   setNewData(data);
      // console.log("Data", data);
      if (!data || data.length === 0) {
        // toast.warn("No history found at the moment!");
      }
    } catch (error) {
        const e = error as AxiosError;
      if (e.response?.status === 400) {
        // toast.error(error.response.data.message);
      } else {
        // toast.error("Something went wrong!");
      }
    }
  };

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    fetchRecieverHistory(user_id);
  }, []);

  return (
    <main className="min-h-[100vh] grid place-content-center">
      <DashboardSideBar
        home={false}
        history={true}
        donor={false}
        reciever={false}
      />

      <div className="min-h-[100vh] w-[80vw] ml-[20vw] overflow-hidden">
        <Header />

        <section className="px-16 pt-4 2xl:pt-8">
          <div id="table">
            <div className="flex flex-row justify-between my-2">
              <h2 className="text-xl font-bold text-primary">
                Donation Requests
              </h2>
            </div>
            <DataTable columns={columns} data={data} />
          </div>
          <div className="mt-12">

          <button
            onClick={() => router.push("/request")}
            className="bg-primary/90 text-white rounded-3xl p-3 px-4 hover:bg-primary shadow-md shadow-black/50"
          >
            Add New Request
          </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Reciever;
