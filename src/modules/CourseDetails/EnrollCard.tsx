'use client';

import Image from "next/image";
import React from 'react';
import {
  BookOpenText 
} from 'lucide-react';

interface EnrollCardProps {
  price: number;
  teacherName?: string;
  teacherImage?: string; 
}

export const EnrollCard: React.FC<EnrollCardProps> = ({ 
  price, 
  teacherName = "",
  teacherImage = "", 
}) => {
  


  return (
    <div className="bg-gradient-to-b
              from-[#644DB3]
              to-[#5B48AC] text-white p-6 rounded-3xl shadow-xl font-sans dark:bg-none dark:bg-[#333] max-w-sm">
      
  
      <div className="flex flex-col items-center mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 mb-3 relative">
        <Image
          src={teacherImage}
          alt={teacherName}
          fill
          className="object-cover"
/>
        </div>
        <p className="text-sm text-gray-300">Teacher Name:</p>
        <h4 className="text-lg font-semibold">{teacherName}</h4>
      </div>

    
      <hr className="border-t border-white/10 my-4" />

   
      <div className="flex flex-col items-center mb-6 pt-4">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 text-2xl">
          <BookOpenText/>
        </div>
        <h3 className="text-xl font-bold">Enroll Now</h3>
        <p className="text-gray-400 text-sm mt-1">Start your journey today</p>
      </div>

      <div className="bg-white text-gray-900 p-5 rounded-2xl dark:bg-[#444]">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-3xl font-bold dark:text-[white]">${price}</span>
            <div className="h-1.5 w-10 bg-[#644DB3] rounded-full mt-2"></div>
          </div>
          
          <button 
        
            className="text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors dark:text-[#898989] cursor-pointer"
          >
            Add to Wishlist
          </button>
        </div>

        <button 
      
          className="w-full bg-gradient-to-b
              from-[#644DB3]
              to-[#5B48AC] dark:bg-none dark:bg-[#644DB3] cursor-pointer text-white py-3 rounded-xl font-medium hover:bg-opacity-90 transition-all active:scale-95"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};