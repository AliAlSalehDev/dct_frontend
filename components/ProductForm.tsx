"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/http";
import type { Category, Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2).max(255),
  price: z.coerce.number().min(0),
  stock_status: z.enum(["in_stock", "out_of_stock"]),
  category_id: z.coerce
    .number()
    .int()
    .positive({ message: "Select a category" }),
});

type FormValues = z.infer<typeof schema>;

export function ProductForm({
  onCreated,
}: {
  onCreated?: (p?: Product) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { stock_status: "in_stock" },
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const selectedCategoryId = watch("category_id");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/v1/categories", {
          params: { limit: 200 },
        });
        const list: Category[] = data?.data ?? data ?? [];
        setCategories(list);
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  async function onSubmit(values: FormValues) {
    try {
      const { data } = await api.post("/v1/products", values);
      toast.success("Product created");
      reset({
        name: "",
        price: 0,
        stock_status: "in_stock",
        category_id: undefined as any,
      });
      onCreated?.(data?.data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to create product");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          placeholder="Wireless Headphones"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          {...register("price")}
        />
        {errors.price && (
          <p className="text-sm text-red-500">{errors.price.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Stock Status</Label>
        <RadioGroup
          defaultValue="in_stock"
          onValueChange={(v) =>
            setValue("stock_status", v as any, { shouldValidate: true })
          }
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="in_stock" id="in_stock" />
            <Label htmlFor="in_stock">In stock</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="out_of_stock" id="out_of_stock" />
            <Label htmlFor="out_of_stock">Out of stock</Label>
          </div>
        </RadioGroup>
        {errors.stock_status && (
          <p className="text-sm text-red-500">{errors.stock_status.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={selectedCategoryId ? String(selectedCategoryId) : undefined}
          onValueChange={(v) =>
            setValue("category_id", Number(v), { shouldValidate: true })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category_id && (
          <p className="text-sm text-red-500">{errors.category_id.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving…" : "Create Product"}
      </Button>
    </form>
  );
}
