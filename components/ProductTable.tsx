"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/http";
import type { ApiPage, Product, StockStatus, Category } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, RefreshCw, Search, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductTable() {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [q, setQ] = useState("");
  const [stockStatus, setStockStatus] = useState<StockStatus | "">("");
  const [categoryId, setCategoryId] = useState<string>("");

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / perPage)),
    [total, perPage]
  );

  async function loadCategories() {
    try {
      const { data } = await api.get("/v1/categories", {
        params: { limit: 200 },
      });
      setCategories(data?.data ?? data ?? []);
    } catch {
      setCategories([]);
    }
  }

  async function loadProducts() {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, per_page: perPage };
      if (q) params.q = q;
      if (stockStatus) params.stock_status = stockStatus;
      if (categoryId) params.category_id = Number(categoryId);

      const { data } = await api.get<ApiPage<Product>>("/v1/products", {
        params,
      });
      const list = Array.isArray(data?.data) ? data.data : [];
      const meta = data?.meta ?? {};
      setItems(list);
      setTotal(meta.total ?? list.length);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, stockStatus, categoryId]);

  function resetFilters() {
    setQ("");
    setStockStatus("");
    setCategoryId("");
    setPage(1);
    loadProducts();
  }

  async function deleteProduct(id: number) {
    await api.delete(`/v1/products/${id}`);
    await loadProducts();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                loadProducts();
              }
            }}
            placeholder="Search by name…"
            className="pl-8 w-64"
            aria-label="Search products"
          />
        </div>

        <Select
          value={stockStatus}
          onValueChange={(v) => {
            setStockStatus(v as any);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Stock status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in_stock">In stock</SelectItem>
            <SelectItem value="out_of_stock">Out of stock</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={categoryId}
          onValueChange={(v) => {
            setCategoryId(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(perPage)}
          onValueChange={(v) => {
            setPerPage(Number(v));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Per page" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={loadProducts} variant="secondary" className="gap-2">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />{" "}
          Refresh
        </Button>
        <Button onClick={resetFilters} variant="ghost" className="gap-2">
          <X className="h-4 w-4" /> Reset
        </Button>
      </div>

      <ScrollArea className="rounded-md border bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              items.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-right">
                    {p.price.toFixed(2)}
                  </TableCell>
                  <TableCell>{p.category?.name ?? "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.stockStatus === "in_stock"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        p.stockStatus === "in_stock"
                          ? "bg-green-100 text-green-700"
                          : ""
                      }
                    >
                      {p.stockStatus === "in_stock"
                        ? "In Stock"
                        : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete "{p.name}"?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <p className="text-sm text-muted-foreground">
                          This action cannot be undone.
                        </p>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteProduct(p.id)}
                            className="bg-destructive text-white hover:bg-destructive/90"
                          >
                            Confirm Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages} • {total} total
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
