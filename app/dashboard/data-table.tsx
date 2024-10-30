"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { deleteUser } from "@/_actions/userAction";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/store";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [selectedColumnFilter, setSelectedColumnFilter] =
    useState<string>("all");

  const [filterValue, setFilterValue] = useState<string>("");

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const isAnyRowSelected =
    table.getFilteredSelectedRowModel().rows.length === 1;

  const openDialog = useStore((state) => state.openDialog);
  const changeSelectedUser = useStore((state) => state.changeSelectedUser);
  const changeFormMode = useStore((state) => state.changeFormMode);

  return (
    <>
      <div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center py-4 min-w-[180px]">
            <Input
              placeholder="Filtrar valor por Selección"
              value={filterValue}
              onChange={(event) => {
                setFilterValue(event.target.value);

                if (selectedColumnFilter === "all") {
                  return table.setGlobalFilter(event.target.value.split(" "));
                }

                table
                  .getColumn(selectedColumnFilter)
                  ?.setFilterValue(event.target.value);
              }}
              className="max-w-sm"
            />
          </div>
          <div>
            <Select
              onValueChange={(value) => {
                table.resetColumnFilters();
                table.resetGlobalFilter();
                setSelectedColumnFilter(value);

                if (value === "all") {
                  return table.setGlobalFilter(filterValue);
                }

                if (value === "amount") {
                  const amount = parseFloat(filterValue);

                  const formatted = new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  }).format(amount);

                  table.getColumn(value)?.setFilterValue(formatted);
                }

                table.getColumn(value)?.setFilterValue(filterValue);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="username">Usuario</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="default"
            onClick={() => {
              changeSelectedUser({
                username: "",
                email: "",
              });
              changeFormMode(1);
              openDialog();
            }}
          >
            Agregar
          </Button>
          {isAnyRowSelected && (
            <Button
              variant="destructive"
              onClick={async () => {
                const userSelected =
                  table.getSelectedRowModel().flatRows[0].original;
                await deleteUser(userSelected);
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              }}
            >
              Eliminar
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className=" mr-auto md:mr-0 md:ml-auto my-4"
              >
                Columnas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .filter((column) => column.id !== "actions")
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table onSelect={() => console.log("onSelect")}>
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} filas(s) seleccionadas.
          </div>
          <div className="space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>
        <Select
          onValueChange={(value) => table.setPageSize(+value)}
          defaultValue="10"
        >
          <SelectTrigger className="w-[180px] m-2">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">40</SelectItem>
            <SelectItem value="40">60</SelectItem>
            <SelectItem value="50">80</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
