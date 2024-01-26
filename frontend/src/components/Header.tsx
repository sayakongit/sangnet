"use client";

import React, { useEffect } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

import Link from "next/link";
import { useLocalStorage } from "react-storage-complete";
import userDetails, { User } from "./state/GlobalState";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { get_location, json_header } from "./constants/Const";
import { getUserData } from "./server/UserManager";

const Header = () => {
  const router = useRouter();

  const [user_id, setUserId] = useLocalStorage("user_id", null);
  const [, setAccess] = useLocalStorage("access", null);
  const [, setRefresh] = useLocalStorage("refresh", null);

  const { user, setUser, setLog } = userDetails() as User;

  // geoLocation

  /*
  const geolocationAPI = navigator.geolocation;
  const getUserCoordinates = () => {
    if (!geolocationAPI) {
      // toast.error("Geolocation API is not available in your browser!");
      return;
    } else {
      geolocationAPI.getCurrentPosition(
        (position) => {
          const { coords } = position;
          try {
            const data = axios.post(
              get_location,
              {
                email: user.email ? user.email : "",
                longitude: coords.longitude,
                latitude: coords.latitude,
              },
              {
                headers: json_header,
              }
            );
            // TODO:
            // dispatch({
            //   type: "LOCATION",
            //   payload: {
            //     last_updated: new Date().toISOString(),
            //     longitude: coords.longitude,
            //     latitude: coords.latitude,
            //   },
            // });
            // toast.success("Location updated successfully");
          } catch (error) {
            const e = error as AxiosError;
            if (e.response?.status === 400) {
              // toast.error(error.response.data.message);
            } else {
              // toast.error("Something went wrong!");
            }
          }
        },
        (error) => {
          // toast.error(error.message);
        }
      );
    }
  };

  */

  // const googleTranslateElementInit = () => {
  //   new window.google.translate.TranslateElement(
  //     {
  //       pageLanguage: "en",
  //       layout: google.translate.TranslateElement.InlineLayout.TOP_LEFT,
  //     },
  //     "google_translate_element"
  //   );
  // };

  // useEffect(() => {
  //   var addScript = document.createElement("script");
  //   addScript.setAttribute(
  //     "src",
  //     "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
  //   );
  //   document.body.appendChild(addScript);
  //   window.googleTranslateElementInit = googleTranslateElementInit;
  // }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user_id) {
        return;
      }
      const [_, data] = await getUserData(user_id);
      setUser(data);
    };

    fetchUser();
  }, []);

  const signOut = () => {
    // Wipe LocalStorage
    setUserId(null);
    setAccess(null);
    setRefresh(null);
    // Wipe GlobalSate
    setUser(null);
    setLog(false);
    // Redirect to /login
    router.push("/login");
  };

  const ProfileMenu = () => {
    return (
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="focus:outline-none">
            <button>
              <div className="h-12 w-12 rounded-full bg-primary text-white grid place-content-center">
                <span className="text-xl m-auto">
                  {user &&
                    user?.first_name.charAt(0) + user?.last_name.charAt(0)}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="md:w-48 2xl:w-52">
            <DropdownMenuLabel className="font-bold text-lg">
              {user && user?.first_name + " " + user?.last_name}
              <p className="text-xs font-light">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link href={"/"}>Home</Link>
                <DropdownMenuShortcut>⇧⌘H</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/profile"}>Edit Profile</Link>
                <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                {/* <button onClick={getUserCoordinates}>Update Location</button> */}
                <button>Update Location</button>
                <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="bg-red-500 text-white hover:bg-red-600">
              <AlertDialogTrigger asChild>
                <button>Log out</button>
              </AlertDialogTrigger>

              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will log you out from your current session in Sangnet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={signOut}
            >
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <section className="p-4 w-full">
      <div className="flex justify-between my-2 2xl:my-4 px-12">
        <div className="place-content-center grid">
          <h2 className="text-4xl my-auto font-medium">
            <span className="text-primary font-semibold">Hi, </span>
            {user?.first_name + " " + user?.last_name}
          </h2>
        </div>
        <div className="flex flex-row">
          {/* <div id="google_translate_element"></div> */}
          {/* <div className="h-12 w-12 rounded-full bg-red-600"></div> */}
          <ProfileMenu />
        </div>
      </div>
      <div className="px-4">
        <div className="w-full h-1 rounded-full bg-primary mt-4 2xl:mt-6"></div>
      </div>
    </section>
  );
};

export default Header;
