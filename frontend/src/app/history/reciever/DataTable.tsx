"use client";

import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

import { Separator } from "@/components/ui/separator";
import { blood_groups } from "@/components/constants/Const";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const statuses = ["pending", "active", "fullfilled", "cancelled"];

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  // TODO Highlight expired, fulfilled and urgent requests with different colors

  return (
    <div>
      <div className="flex justify-between items-center py-4 px-4">
        <input
          placeholder="Filter By Donor..."
          value={
            (table.getColumn("donor_id")?.getFilterValue() as string) ?? ""
          }
          onChange={(event: { target: { value: any } }) =>
            table.getColumn("donor_id")?.setFilterValue(event.target.value)
          }
          className="max-w-md focus:outline-none p-2 rounded-lg focus:border border-black"
        />

        <select
          className="p-3 rounded-lg focus:outline-none focus:border border-black"
          name="blood_group"
          value={
            (table.getColumn("blood_group")?.getFilterValue() as string) ?? ""
          }
          onChange={(event: { target: { value: any } }) =>
            table.getColumn("blood_group")?.setFilterValue(event.target.value)
          }
        >
          <option value={""}>Blood Group</option>
          {blood_groups.map((option, index) => (
            <option key={index} value={option} className="focus:bg-white">
              {option}
            </option>
          ))}
        </select>

        <select
          className="p-3 rounded-lg focus:outline-none focus:border border-black"
          name="current_status"
          value={
            (table.getColumn("current_status")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event: { target: { value: any } }) =>
            table
              .getColumn("current_status")
              ?.setFilterValue(event.target.value)
          }
        >
          <option value={""}>Status</option>
          {statuses.map((option, index) => (
            <option key={index} value={option} className="focus:bg-white">
              {option}
            </option>
          ))}
        </select>
      </div>
      <Separator className="bg-gray-600" />

      <div className="rounded-md border my-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Requests.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
