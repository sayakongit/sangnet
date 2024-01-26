"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronsUpDown,
  CircleEllipsis,
  MoreHorizontal,
} from "lucide-react";

export type Request = {
  request_id: string;
  donor_id: number | null;
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
    donor_id: number | null;
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
  reason: string;
  type_of_donation: string;
  is_urgent: boolean;
  reciever_approved: boolean;
  donor_approved: boolean;
  current_status: "pending" | "active" | "fullfilled" | "cancelled";
  coordinates: number;
};

export const columns: ColumnDef<Request>[] = [
  {
    accessorKey: "donor_id",
    header: ({ column }) => {
      return (
        <button
          className="font-bold text-black flex flex-row items-center hover:shadow-sm hover:shadow-black/40 p-3 rounded-lg"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Donor
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => {
      const donor_id = parseInt(row.getValue("donor_id"));

      return (
        <div className="text-left font-medium">
          {donor_id ? donor_id : "No Donor Available"}
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
      const isoDateString = required_on;
      const date = new Date(isoDateString);
      const humanReadableDateString = date.toDateString();
      return (
        <div className="text-left font-medium">{humanReadableDateString}</div>
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
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {

      const required_on: string = row.getValue("required_on");
      const isoDateString = required_on;
      const date = new Date(isoDateString);
      const hmrDate = date.toDateString();

      // TODO: Enable "Mark Complete" and "Mark Cancelled" only for requested user

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <CircleEllipsis className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white shadow-md shadow-black/40 rounded-md p-4">
            <DropdownMenuItem className="p-2 hover:bg-gray-300 rounded-sm"
              onClick={() => navigator.clipboard.writeText(`${row.getValue("blood_group")} on ${hmrDate}`)}
            >
              Copy Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-2 hover:bg-gray-300 rounded-sm">Mark Complete</DropdownMenuItem>
            <DropdownMenuItem className="p-2 hover:bg-gray-300 rounded-sm">Mark Cancelled</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
