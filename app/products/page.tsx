"use client";

import { useState } from "react";
import { ProductTable } from "@/components/ProductTable";
import { ProductForm } from "@/components/ProductForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Products
            </h1>
            <p className="text-muted-foreground">
              Manage your store’s products and stock status
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Add a new product
                </DialogTitle>
              </DialogHeader>
              <ProductForm
                onCreated={() => {
                  setOpen(false);
                  setRefreshKey((k) => k + 1);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Product Table */}
        <Card className="shadow-sm border-border/50 bg-card/95 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-lg font-medium text-foreground/90">
              Product Listing
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ProductTable key={refreshKey} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
