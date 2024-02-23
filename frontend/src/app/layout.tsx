import "../styles/globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Poppins, Caprasimo } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["300"] });
const caprasimo = Caprasimo({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-caprasimo",
});

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
      <body className={`${poppins.className} ${caprasimo.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
