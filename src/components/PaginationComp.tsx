"use client";

import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationCompProps {
  currentPage: number;
  totalPages: number;
}

export function PaginationComp({
  currentPage,
  totalPages,
}: PaginationCompProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  const renderPageLinks = () => {
    const links = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        links.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={createPageURL(i)}
              isActive={currentPage === i}
              className={
                currentPage === i
                  ? "h-9 w-9 rounded-xl border-none bg-violet-600 text-[12px] text-white hover:bg-violet-700 hover:text-white dark:bg-violet-600 dark:hover:bg-violet-700 sm:h-10 sm:w-10 sm:text-sm"
                  : "h-9 w-9 rounded-xl border-none text-[12px] hover:bg-violet-50 hover:text-violet-700 dark:text-[#ccc] dark:hover:bg-[#454545] dark:hover:text-white sm:h-10 sm:w-10 sm:text-sm"
              }
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        links.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <PaginationEllipsis className="h-9 w-9 text-slate-500 dark:text-[#898989] sm:h-10 sm:w-10" />
          </PaginationItem>,
        );
      }
    }

    return links.filter((item, index, self) => {
      if (
        item.key?.toString().startsWith("ellipsis") &&
        self[index - 1]?.key?.toString().startsWith("ellipsis")
      ) {
        return false;
      }
      return true;
    });
  };

  return (
    <div className="mt-2 mb-4 flex w-full items-center justify-center px-2 sm:justify-end">
      <Pagination className="mx-0 w-auto">
        <PaginationContent className="gap-1 sm:gap-2">
          <PaginationItem>
            <PaginationPrevious
              href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
              className={`rounded-xl px-2.5 py-2 text-[12px] font-medium transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-[#ccc] dark:hover:bg-[#454545] dark:hover:text-white sm:h-10 sm:px-4 sm:text-sm ${
                currentPage <= 1 ? "pointer-events-none opacity-50" : ""
              }`}
            />
          </PaginationItem>

          {renderPageLinks()}

          <PaginationItem>
            <PaginationNext
              href={
                currentPage < totalPages ? createPageURL(currentPage + 1) : "#"
              }
              className={`rounded-xl px-2.5 py-2 text-[12px] font-medium transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-[#ccc] dark:hover:bg-[#454545] dark:hover:text-white sm:h-10 sm:px-4 sm:text-sm ${
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
