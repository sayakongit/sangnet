"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "react-storage-complete";
import { useToast } from "@/components/ui/use-toast";
import userDetails, { User } from "@/components/state/GlobalState";
import { backend } from "@/components/constants/Const";
import axios, { AxiosError } from "axios";

const Dashboard = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loggedIn } = userDetails() as User;
  const [access, setAccess] = useLocalStorage("access", null);

  const checkAccess = async () => {
    if (access !== null) {
      try {
        await axios.post(
          `${backend}/accounts/token/verify/`,
          {
            token: access,
          },
          {
            headers: {
              "Content-type": "application/json",
            },
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
    checkAccess();
  }, []);

  return (
    <main className="min-h-[100vh] grid place-content-center">
      <h2 className="text-red-600 text-2xl">
        Hey ! {user?.first_name} {user?.last_name}
      </h2>
      <h1 className="text-blue-500 text-6xl my-12 mx-12">{"UI"}</h1>
    </main>
  );
};

export default Dashboard;
