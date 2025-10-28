import React, { useState, FormEvent, ChangeEvent } from "react";
import { Search } from "lucide-react";
import logo from "../../public/logo.png";
import { Link } from "react-router-dom";

interface HighwayDeliteNavbarProps {
  onSearch?: (query: string) => void;
}

export default function HighwayDeliteNavbar({ onSearch }: HighwayDeliteNavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm.trim().toLowerCase());
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="px-8 sm:px-12 lg:px-16 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center ml-4">
            <div className="w-28 flex items-center justify-center text-white font-bold text-sm">
              <img src={logo} alt="logo" />
            </div>
          </Link>

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
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center gap-3 flex-1 max-w-md mr-4"
            >
              <input
                type="text"
                placeholder="Search experiences"
                className="flex-1 px-5 py-3 bg-[#ededed] rounded-sm outline-none focus:bg-gray-200 transition-colors"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                value={searchTerm}
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-[#ffd643] cursor-pointer hover:bg-[#f3d155] rounded-sm transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden mt-4 flex flex-col sm:flex-row gap-2">
            <form
              onSubmit={handleSearch}
              className="md:hidden mt-4 flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                placeholder="Search experiences"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="flex-1 px-4 py-3 bg-[#ededed] rounded-lg outline-none focus:bg-gray-200 transition-colors"
                value={searchTerm}
              />
              <button
                className="px-6 py-3 bg-[#ffd643] cursor-pointer hover:bg-[#f3d155] rounded-lg font-semibold transition-colors"
                onClick={handleSearch}
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
