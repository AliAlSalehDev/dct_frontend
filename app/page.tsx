"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-muted/40 text-center px-4">
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <Store className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Mini eCommerce Dashboard
          </h1>
          <p className="text-muted-foreground max-w-md">
            Manage your products easily with a modern, responsive interface
            built using Next.js and Laravel API.
          </p>
        </div>

        <Link href="/products">
          <Button size="lg" className="gap-2">
            Go to Products
          </Button>
        </Link>
      </div>
    </main>
  );
}
