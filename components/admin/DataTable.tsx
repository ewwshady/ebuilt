"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface DataTableColumn<T> {
  key: keyof T | string
  label: string
  render?: (value: any, row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  actions?: (row: T) => React.ReactNode
  emptyMessage?: string
  isLoading?: boolean
  pagination?: {
    total: number
    page: number
    pageSize: number
    onPageChange: (page: number) => void
  }
}

export function DataTable<T extends { id?: string; _id?: string }>({
  columns,
  data,
  actions,
  emptyMessage = "No data available",
  isLoading = false,
  pagination,
}: DataTableProps<T>) {
  const getRowId = (row: T) => (row.id || row._id || Math.random().toString()) as string

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              {/* Added index to key for absolute uniqueness */}
              {columns.map((column, index) => (
                <TableHead
                  key={`${String(column.key)}-${index}`}
                  className={`text-gray-900 font-semibold ${column.className || ""}`}
                >
                  {column.label}
                </TableHead>
              ))}
              {actions && <TableHead className="text-gray-900 font-semibold">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center py-12"
                >
                  <p className="text-gray-500">{emptyMessage}</p>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={getRowId(row)} className="hover:bg-gray-50">
                  {/* Added index to key here as well */}
                  {columns.map((column, index) => {
                    const value = (row as any)[column.key as string]
                    const rendered = column.render ? column.render(value, row) : value
                    return (
                      <TableCell key={`${String(column.key)}-${index}`} className={column.className}>
                        {rendered}
                      </TableCell>
                    )
                  })}
                  {actions && <TableCell>{actions(row)}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => pagination.onPageChange(Math.max(1, pagination.page - 1))}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center px-4 text-sm text-gray-600">
              Page {pagination.page}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                pagination.onPageChange(
                  Math.min(Math.ceil(pagination.total / pagination.pageSize), pagination.page + 1)
                )
              }
              disabled={pagination.page * pagination.pageSize >= pagination.total}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
