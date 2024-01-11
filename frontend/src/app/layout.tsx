import "../styles/globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({ subsets: ["latin"], weight: ["200"] });

export const metadata: Metadata = {
  title: "Sangnet",
  description:
    "Sangnet swiftly connects compatible blood donors with recipients, prioritizing privacy and security. We simplify the process, enabling donors to help during emergencies and medical procedures, ultimately saving lives in our communities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
