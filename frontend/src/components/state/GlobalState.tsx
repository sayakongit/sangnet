import { create } from "zustand";

export interface User {
  user: any;
  loggedIn: boolean;
  setUser: (userData: any) => void;
  setLog: (status: boolean) => void;
}

const userDetails = create<User>((set) => ({
  user: null, // The user object with all details will be inserted here
  loggedIn: false,
  setUser: (userData: any) =>
    set({
      user: userData,
    }),

  setLog: (status: boolean) =>
    set({
      loggedIn: status,
    }),
}));

export default userDetails;