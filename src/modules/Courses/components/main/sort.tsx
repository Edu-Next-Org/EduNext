"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

function CoursesSort() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const limit: string | null = searchParams.get("limit") || null;
  const sort: string | null = searchParams.get("sort") || null;

  const sortOptions = [
    { id: "oldest", name: "oldest" },
    { id: "latest", name: "latest" },
    { id: "price_desc", name: "most expensive" },
    { id: "price_asc", name: "cheapest" },
  ];
  const sortName = sortOptions.find((v) => v.id === sort)?.name || null;
  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };
  return (
    <div className="flex items-center gap-3">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {sort ? `sorted by ${sortName} ` : "sort"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {sortOptions.map((items, i) => (
              <DropdownMenuItem
                onClick={() => {
                  updateParams("sort", items.id);
                }}
                key={i}
              >
                {items.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {limit ? `${limit} per page` : "per page"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["10", "12", "15", "18"].map((items, i) => (
              <DropdownMenuItem
                onClick={() => {
                  updateParams("limit", items);
                }}
                key={i}
              >
                {items}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default CoursesSort;
