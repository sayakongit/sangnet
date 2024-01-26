"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useLocalStorage } from "react-storage-complete";
import { donation_request, json_header } from "@/components/constants/Const";

type req = {
  requested_by: string | null | undefined;
  phone_number: string;
  blood_group: string;
  required_on: string;
  place_of_donation: string;
  units_required: string;
  type_of_donation: string;
  reason: string;
  is_urgent: boolean;
};

const blood_groups = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];

const Request = () => {
  const router = useRouter();

  const [userId, setUserId] = useLocalStorage("user_id", null);
  const [request, setRequest] = useState<req>({
    requested_by: userId,
    phone_number: "",
    blood_group: "",
    required_on: "",
    place_of_donation: "",
    units_required: "",
    type_of_donation: "Blood",
    reason: "",
    is_urgent: false,
  });

  const [loading, setLoading] = useState(false);

  const [inputErrorDate, setinputErrorDate] = useState(false);
  const [inputErrorPhone, setinputErrorPhone] = useState(false);
  const [inputErrorUnits, setinputErrorUnits] = useState(false);

  const createRequest = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(donation_request, request, {
        headers: json_header,
      });
      // TODO: toast.success("Request created successfully");
      router.push("/history/reciever");
      console.log(data);
    } catch (error) {
      const e = error as AxiosError;
      console.log(e.response);
      // TODO: toast: couldn't because ....
    }
    setLoading(false);

    console.log(request);
  };

  return (
    <main className="min-h-screen bg-gradient-to-tl from-white via-primary/80 to-primary sm:px-72 px-80 2xl:px-[30%] py-16">
      <section className="min-h-[80%] bg-white px-16 rounded-3xl shadow-lg shadow-black/50 pb-6">
        <div className="mx-auto p-6 items-center justify-center">
          <div className="auth-heading">
            <h2 className="text-4xl font-extrabold my-16 mx-4 text-center">
              Submit a Donation Request
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg md:max-w-2xl font-bold">
            <form className="space-y-6" onSubmit={createRequest}>
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-bold leading-6"
                >
                  Type of Donation
                </label>
                <div className="mt-3">
                  <select
                    name="type"
                    id="type"
                    className="w-full focus:outline-none bg-yellow-100/70 rounded-lg border-0 py-1.5 px-2 text-md font-normal"
                    required={true}
                    value={request.type_of_donation}
                    onChange={(e) => {
                      setRequest({
                        ...request,
                        type_of_donation: e.target.value,
                      });
                    }}
                  >
                    <option value="Blood">Blood</option>
                    <option value="Plasma">Plasma</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="blood_group"
                  className="block text-sm font-bold leading-6"
                >
                  Blood Group
                </label>
                <div className="mt-3">
                  <select
                    name="blood_group"
                    id="blood_group"
                    className="w-full focus:outline-none bg-yellow-100/70 rounded-lg border-0 py-1.5 px-2 text-md font-normal"
                    required={true}
                    value={request.blood_group}
                    onChange={(e) => {
                      setRequest({
                        ...request,
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
                  htmlFor="required_on"
                  className="block text-sm font-bold leading-6"
                >
                  Required On
                </label>
                <div className="mt-2">
                  <input
                    id="required_on"
                    name="required_on"
                    type="date"
                    autoComplete="required_on"
                    required={true}
                    onChange={(e) => {
                      setRequest({
                        ...request,
                        required_on: new Date(e.target.value).toISOString(),
                      });
                    }}
                    className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="unit"
                  className="block text-sm font-bold leading-6"
                >
                  Number of Units
                </label>
                <div className="mt-2">
                  <input
                    id="unit"
                    name="unit"
                    type="number"
                    autoComplete="unit"
                    required={true}
                    onChange={(e) => {
                      setRequest({
                        ...request,
                        units_required: e.target.value,
                      });
                    }}
                    placeholder="0"
                    maxLength={4}
                    className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-bold leading-6"
                >
                  Phone Number
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="phone"
                    required={true}
                    onChange={(e) => {
                      setRequest({
                        ...request,
                        phone_number: e.target.value,
                      });
                    }}
                    placeholder="+91 00000-00000"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-bold leading-6"
                >
                  Reason (Optional)
                </label>
                <div className="mt-2">
                  <textarea
                    id="address"
                    rows={3}
                    name="address"
                    autoComplete="address"
                    placeholder="Enter Your Reason"
                    required={false}
                    onChange={(e) => {
                      setRequest({
                        ...request,
                        reason: e.target.value,
                      });
                    }}
                    className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="flex items-center w-full">
                <input
                  type="checkbox"
                  checked={request.is_urgent}
                  onChange={() => {
                    setRequest({
                      ...request,
                      is_urgent: !request.is_urgent,
                    });
                  }}
                  id="urgent"
                  className="bg-primary rounded-lg"
                />
                <label htmlFor="urgent" className="text-sm ml-2">
                  {" "}
                  Emergency Requirement
                </label>
              </div>

              <div className="my-16">
                <button
                  type="submit"
                  className={loading ? "loading-btn mt-6" : "active-btn mt-6"}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Request;
