"use client";
import { Rating } from "@smastrom/react-rating";

import "@smastrom/react-rating/style.css";

function StarsRate({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <Rating style={{ maxWidth: 120 }} value={value} readOnly={true} />
      <span className="text-sm text-gray-500">({value})</span>
    </div>
  );
}

export default StarsRate;
