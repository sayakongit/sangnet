import React from "react";
import { Caprasimo } from "next/font/google";

const caprasimo = Caprasimo({subsets: ["latin"], weight: ["400"]});

const Sidebar = (props: {
  name:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | React.PromiseLikeOfReactNode
    | null
    | undefined;
  text: string;
}) => {
  return (
    <section className="h-[100vh] w-[35vw] grid place-content-center text-center bg-primary text-white fixed">
      <h1 className={`${caprasimo.className} text-[3.25rem]`}>{props.name}</h1>
      <p className="">{props.text}</p>
    </section>
  );
};

export default Sidebar;
