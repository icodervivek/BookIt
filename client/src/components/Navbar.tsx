import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function HighwayDeliteNavbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="px-8 sm:px-12 lg:px-16 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 ml-4" // ← adds left spacing
          >
            <div className="w-20 flex items-center justify-center text-white font-bold text-sm">
              <img src="./logo.png" alt="logo" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-semibold">highway</span>
              <span className="text-lg font-semibold">delite</span>
            </div>
          </a>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle search"
          >
            <Search className="w-6 h-6" />
          </button>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mr-4"> 
            {/* ← adds right spacing */}
            <input
              type="text"
              placeholder="Search experiences"
              className="flex-1 px-5 py-3 bg-[#ededed] rounded-sm outline-none focus:bg-gray-200 transition-colors"
            />
            <button className="px-6 py-3 bg-[#ffd643] cursor-pointer hover:bg-[#f3d155] rounded-sm transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Search experiences"
              className="flex-1 px-4 py-3 bg-[#ededed] rounded-lg outline-none focus:bg-gray-200 transition-colors"
            />
            <button className="px-6 py-3 bg-[#ffd643] cursor-pointer hover:bg-[#f3d155] rounded-lg font-semibold transition-colors">
              Search
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
