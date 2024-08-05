"use client"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  // getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import React from "react"
import { Filter } from "./Filter"

type Data = Record<string, any>
export type SortableTableProps = {
  columns: ColumnDef<Data, any>[]
  data: Data[]
  paginate?: boolean
}
export const SortableTable: React.FC<SortableTableProps> = ({ columns, data, paginate }) => {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  // const [columnVisibility, setColumnVisibility] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    state: {
      columnFilters,
    },
    pageCount: 1,
    rowCount: paginate ? 10 : Math.pow(10, 12),
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    manualPagination: false, // Disable manual pagination
    // autoResetPage: false, // Prevent resetting the page index
  })

  return (
    <div
      className="m-2 max-h-[100vh] overflow-auto border-2 
    border-gray-500
    p-0 text-sm
    shadow-xl
    lg:max-h-[50vh]"
    >
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b-2 border-b-theme-navy-300/25">
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="border-r-2 border-theme-navy-300 bg-gray-100 px-2
                    
                    "
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => {
            return (
              <tr key={row.id} className="border-b-2 border-b-theme-navy-300/5">
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className={`border-r-2 border-r-theme-navy-300 px-2
                      ${i % 2 === 0 ? "" : "bg-gray-100"}
                      `}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {!!paginate && (
        <>
          <div className="h-2" />
          <div className="flex items-center gap-2">
            <button
              className="rounded border p-1"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              className="rounded border p-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button className="rounded border p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              {">"}
            </button>
            <button
              className="rounded border p-1"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
                }}
                className="w-16 rounded border p-1"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
        </>
      )}
    </div>
  )
}
