"use client";

import Header from "@/components/Header";
import { DashboardSideBar } from "@/components/sidebar/Sidebar";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { columns } from "../reciever/Columns";
import { DataTable } from "../reciever/DataTable";
import axios, { AxiosError } from "axios";
import { donor_history, json_header } from "@/components/constants/Const";

const ReceiverHistory = () => {
  const router = useRouter();
  const [data, setData] = useState<[]>([]);

  const fetchDonorHistory = async (user_id: any) => {
    try {
      let { data } = await axios.post(
        donor_history,
        {
          donor_id: user_id,
        },
        {
          headers: json_header,
        }
      );
      setData(data);
      // setNewData(data);
      console.log("Data", data);
      if (!data || data.length === 0) {
        // TODO: toast.warn("No history found at the moment!");
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
  
  return (
    <main className="overflow-x-hidden">
      <div className="min-h-[100vh] grid place-content-center">
        <DashboardSideBar
          home={false}
          history={true}
          donor={true}
          reciever={false}
        />

        <div className="min-h-[100vh] w-[80vw] ml-[20vw] overflow-hidden">
          <Header />

          <section className="px-16 pt-4 2xl:pt-8">
            <div id="table">
              <div className="flex flex-row justify-between my-2">
                <h2 className="text-xl font-bold text-primary">
                  Donation History
                </h2>
              </div>
              <DataTable columns={columns} data={data} />
            </div>
            {/* <div className="mt-12"> */}
            {/* </div> */}
          </section>
        </div>
      </div>
    </main>
  );
};

export default ReceiverHistory;
