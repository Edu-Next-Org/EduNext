"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FormEvent, useState } from "react";

function SearchCourse() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState<string>(searchParams.get("search") || "");
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", query);
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch}>
      <div className=" w-full flex gap-2  justify-between h-10 items-stretch ">
        <Input
          type="text"
          placeholder="Search courses...."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-[95%] bg-[#ffff] h-full "
        />
        <div>
          <Button type="submit" className=" h-full ">
            Search
          </Button>
        </div>
      </div>
    </form>
  );
}

export default SearchCourse;
