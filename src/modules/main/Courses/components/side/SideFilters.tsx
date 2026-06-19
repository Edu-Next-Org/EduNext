"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GetAllCategories,
  ICategoriesData,
  ICategoriesResponse,
} from "@/core/services/api/Get/GetAllCategories";
import {
  GetAllLevels,
  ILevelsResponse,
} from "@/core/services/api/Get/GetAllLevels";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function SideFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: categories, ispending: pendingCats } =
    useQuery<ICategoriesResponse>({
      queryKey: ["CATEGORIES"],
      queryFn: async () => await GetAllCategories(),
    });
  const catData = categories?.data ?? [];
  const { data: Levels, ispending: pendingLevels } = useQuery<ILevelsResponse>({
    queryKey: ["LEVELS"],
    queryFn: async () => await GetAllLevels(),
  });
  const levelsData = Levels?.data ?? [];

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",") || [],
  );
  const [selectedPrices, setSelectedPrices] = useState<string | null>(
    searchParams.get("price") || null,
  );
  const [selectedLevels, setSelectedLevels] = useState<string | null>(
    searchParams.get("courseLevel") || null,
  );
  const pushFiltersToUrl = (
    categories: string[],
    price: string | null,
    level: string | null,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categories.length > 0) params.set("categories", categories.join(","));
    if (price) params.set("price", price);
    if (level) params.set("courseLevel", level);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };
  const handlechangeCategory = (value: string) => {
    const newCat = selectedCategories.includes(value)
      ? selectedCategories.filter((v) => v !== value)
      : [...selectedCategories, value];
    setSelectedCategories(newCat);
    pushFiltersToUrl(newCat, selectedPrices, selectedLevels);
  };
  const handleChangePrice = (value: string) => {
    const newPrice = selectedPrices === value ? null : value;
    setSelectedPrices(newPrice);
    pushFiltersToUrl(selectedCategories, newPrice, selectedLevels);
  };
  const handleChangeLevel = (value: string) => {
    const newLevel = selectedLevels === value ? null : value;
    setSelectedLevels(newLevel);
    pushFiltersToUrl(selectedCategories, selectedPrices, newLevel);
  };
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPrices(null);
    setSelectedLevels(null);
    router.push(`?`);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[32px] font-bold ">Filters</h2>
      <div className="border-r border-gray-300 pr-4 ">
        <Accordion
          type="multiple"
          defaultValue={["categories", "price", "level"]}
        >
          <AccordionItem value="categories">
            <AccordionTrigger className="text-[21px] font-bold">
              Categories
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {pendingCats
                ? Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-sm" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))
                : catData.map((item) => (
                    <div key={item._id} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedCategories.includes(item._id)}
                        onCheckedChange={() => handlechangeCategory(item._id)}
                        id={item._id}
                      />
                      <label htmlFor={item.name} className="text-sm">
                        {item.name}
                      </label>
                    </div>
                  ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger className="text-[21px] font-bold">
              Price
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {["free", "Paid"].map((price) => (
                <div key={price} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedPrices === price}
                    onCheckedChange={() => handleChangePrice(price)}
                    id={price}
                  />
                  <label htmlFor={price} className="text-sm">
                    {price}
                  </label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="level">
            <AccordionTrigger className="text-[21px] font-bold">
              Level
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {pendingLevels
                ? Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-sm" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))
                : levelsData.map((level) => (
                    <div key={level._id} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedLevels === level._id}
                        onCheckedChange={() => handleChangeLevel(level._id)}
                        id={level._id}
                      />
                      <label htmlFor={level.name} className="text-sm">
                        {level.name}
                      </label>
                    </div>
                  ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button
          variant="ghost"
          className="mt-3 w-full text-md text-muted-foreground shadow bg-[#ffff] "
          onClick={() => clearFilters()}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}

export default SideFilters;
