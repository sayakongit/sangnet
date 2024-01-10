import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import React from "react";

const Login = () => {
  return (
    <main className="flex flex-row">
      <Sidebar
        name={"Sangnet"}
        text={'"Connecting Lives, Saving Futures."'}
      ></Sidebar>

      <section className="ml-[35vw] w-[65vw] min-h-[100vh] grid place-content-center">
        <div className="mx-auto p-6 items-center justify-center">
          <div className="auth-heading">
            <h2 className="text-4xl font-extrabold my-8 mx-4">Log in to Sangnet</h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg md:max-w-2xl font-bold">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold leading-6"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required={true}
                    placeholder="Enter your Email ID"
                    className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold leading-6"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-primary hover:text-primary/90"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required={true}
                    placeholder="Enter your Password"
                    className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400  sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/90"
                >
                  Sign in
                </button>
              </div>
            </form>

            <div className="text-sm text-center my-6 font-semibold">
              Have not registered yet?{" "}
              <Link className="text-primary" href={"/signup"}>
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
