"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FormEvent, useState } from "react";

const CoursesPagination = ({ totalPages }: { totalPages: number }) => {
  const totalPagesNubmer = Number(totalPages);
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage: number = Number(searchParams.get("page")) || 1;
  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`);
  };
  return (
    <div className="pt-4 mx-auto ">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                currentPage > 1 && changePage(currentPage - 1);
              }}
            />
          </PaginationItem>
          {Array.from({ length: totalPagesNubmer }, (_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                isActive={currentPage === i + 1}
                onClick={() => changePage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                currentPage < totalPagesNubmer && changePage(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CoursesPagination;
