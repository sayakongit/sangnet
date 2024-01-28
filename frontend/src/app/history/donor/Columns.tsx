"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import axios, { AxiosError } from "axios";
import { ColumnDef } from "@tanstack/react-table";
import {
  fill_receiver_request,
  json_header,
} from "@/components/constants/Const";
import { ChevronsUpDown, CircleEllipsis } from "lucide-react";

export type DonorHistory = {
  request_id: string;
  donor_id: {
    id: number;
    user: {
      id: number;
      coordinates: {
        latitude: string;
        longitude: string;
        last_updated: string;
      };
      email: string;
      first_name: string;
      last_name: string;
      phone: string;
      address: string;
      date_of_birth: string;
      is_verified: boolean;
      is_donor: boolean;
      donor_id: number;
      adhaar_number: string;
      created_at: string;
      updated_at: string;
      donor_application_status: string;
    };
    donor_since: string;
    blood_group: string;
    last_donated_on: string;
    is_available: boolean;
    is_verified: boolean;
    updated_at: string;
    level: number;
    donation_count: number;
    donation_required_to_reach_next_level: number;
    active_donation_request: string | null;
  };
  requested_by: {
    id: number;
    coordinates: {
      latitude: string;
      longitude: string;
      last_updated: string;
    };
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
    date_of_birth: string;
    is_verified: boolean;
    is_donor: boolean;
    donor_id: number;
    adhaar_number: string;
    created_at: string;
    updated_at: string;
    donor_application_status: string;
  };
  phone_number: string;
  blood_group: string;
  required_on: string;
  place_of_donation: string;
  units_required: number;
  reason: string | null;
  type_of_donation: string;
  is_urgent: boolean;
  reciever_approved: boolean;
  donor_approved: boolean;
  current_status: string;
  coordinates: number;
};

export const DonorColumns: ColumnDef<DonorHistory>[] = [
    {
      accessorKey: "requested_by",
      header: ({ column }) => {
        return (
          <button
            className="font-bold text-black flex flex-row items-center hover:shadow-sm hover:shadow-black/40 p-3 rounded-lg"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Receiver
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => {
        const receiver: any = row.getValue("requested_by");
  
        return (
          <div className="text-left font-medium">
            {`${receiver.first_name} ${receiver.last_name}`}
          </div>
        );
      },
    },
    {
      accessorKey: "blood_group",
      header: ({ column }) => {
        return (
          <button
            className="font-bold text-black flex flex-row items-center hover:shadow-sm hover:shadow-black/40 p-3 rounded-lg"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Blood Group
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium uppercase">
            {row.getValue("blood_group")}
          </div>
        );
      },
    },
    {
      accessorKey: "units_required",
      header: ({ column }) => {
        return (
          <button
            className="font-bold text-black flex flex-row items-center hover:shadow-sm hover:shadow-black/40 p-3 rounded-lg"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Units
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("units_required")}</div>
      ),
    },
    {
        accessorKey: "required_on",
        header: ({ column }) => {
          return (
            <button
              className="font-bold text-black flex flex-row items-center hover:shadow-sm hover:shadow-black/40 p-3 rounded-lg"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Required Within
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            </button>
          );
        },
        cell: ({ row }) => {
          const required_on: string = row.getValue("required_on");
          const date = new Date(required_on);
          const humanReadableDateString = date.toDateString();
          return (
            <div className="text-left font-medium">{humanReadableDateString}</div>
          );
        },
      },
      {
        accessorKey: "donated_on",
        header: ({ column }) => {
          return (
            <button
              className="font-bold text-black flex flex-row items-center hover:shadow-sm hover:shadow-black/40 p-3 rounded-lg"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Donated on
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            </button>
          );
        },
        cell: ({ row }) => {
            // TODO: Get donation Date
          return (
            <div className="text-left font-medium">---</div>
          );
        },
      },
    {
      accessorKey: "current_status",
      header: ({ column }) => {
        return (
          <button
            className="font-bold text-black flex flex-row items-center hover:shadow-sm hover:shadow-black/40 p-3 rounded-lg"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize font-medium">
          {row.getValue("current_status")}
        </div>
      ),
    },
   
  ];
  