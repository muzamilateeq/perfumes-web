"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { PERFUMES_DATA, PerfumeItem } from "@/lib/perfumes";

interface HeaderSearchProps {
  className?: string;
}

export default function HeaderSearch({ className = "" }: HeaderSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter perfumes based on query
  const filteredPerfumes: PerfumeItem[] = query.trim() === ""
    ? []
    : PERFUMES_DATA.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.notes.toLowerCase().includes(q) ||
          p.topNotes.toLowerCase().includes(q) ||
          p.heartNotes.toLowerCase().includes(q) ||
          p.baseNotes.toLowerCase().includes(q)
        );
      });

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/perfumes/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" && filteredPerfumes.length > 0) {
      handleSelect(filteredPerfumes[0].slug);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      
      {/* Open Search Bar Input */}
      <div className="relative flex items-center bg-white/95 border border-zinc-300 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950/20 rounded-full shadow-xs transition-all duration-200">
        <div className="pl-3.5 pr-2 flex items-center pointer-events-none text-zinc-400">
          <Search className="w-3.5 h-3.5" />
        </div>
        
        <input 
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search perfumes (Oud, Rose, Citrus)..."
          className="w-full sm:w-36 md:w-40 lg:w-44 xl:w-56 focus:w-full sm:focus:w-48 md:focus:w-52 lg:focus:w-60 py-2 pr-7 text-sm sm:text-xs bg-transparent text-zinc-900 placeholder:text-zinc-400 placeholder:font-light focus:outline-none transition-all duration-300"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 p-1 text-zinc-400 hover:text-zinc-700 transition-colors"
            title="Clear search"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Live Search Results Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 sm:left-auto sm:right-0 mt-1.5 sm:mt-2 w-full sm:w-[380px] md:w-[420px] bg-white border border-zinc-200 shadow-2xl rounded-sm overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          
          <div className="p-3 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">
            <span>
              {filteredPerfumes.length > 0 
                ? `${filteredPerfumes.length} Flacon${filteredPerfumes.length > 1 ? "s" : ""} Found` 
                : "No Flacons Found"}
            </span>
            <span className="text-[10px] text-zinc-400 lowercase font-normal">press enter to select</span>
          </div>

          <div className="max-h-[50vh] sm:max-h-[340px] overflow-y-auto divide-y divide-zinc-100 overscroll-contain">
            {filteredPerfumes.length > 0 ? (
              filteredPerfumes.map((perfume) => (
                <div
                  key={perfume.id}
                  onClick={() => handleSelect(perfume.slug)}
                  className="p-3 sm:p-3.5 hover:bg-[#FAF9F8] transition-colors cursor-pointer flex items-center gap-3.5 group"
                >
                  {/* Flacon Thumbnail */}
                  <div className="w-12 h-14 bg-zinc-100 border border-zinc-200 shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={perfume.image} 
                      alt={perfume.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C7355]">
                        {perfume.category}
                      </span>
                      {perfume.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-zinc-950 text-white font-bold uppercase tracking-wider">
                          {perfume.badge}
                        </span>
                      )}
                    </div>
                    
                    <h4 className="font-serif text-base font-normal text-zinc-950 truncate group-hover:text-[#8C7355] transition-colors">
                      {perfume.name}
                    </h4>

                    <p className="text-[11px] text-zinc-500 font-light truncate mt-0.5">
                      {perfume.notes}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="text-right shrink-0">
                    <span className="font-serif text-sm font-semibold text-zinc-950 block">
                      {perfume.price}
                    </span>
                    <span className="text-[10px] font-bold text-[#8C7355] tracking-widest uppercase inline-flex items-center gap-1 mt-1 group-hover:translate-x-1 transition-transform">
                      View <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center space-y-3">
                <p className="font-serif text-base text-zinc-800">
                  No matching flacons for "{query}"
                </p>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto font-light">
                  Try searching for popular notes like <strong>Oud</strong>, <strong>Rose</strong>, <strong>Bergamot</strong>, or <strong>Vanilla</strong>.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-2">
                  {["Oud", "Rose", "Citrus", "Vanilla", "Sandalwood"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setQuery(tag);
                        inputRef.current?.focus();
                      }}
                      className="px-2.5 py-1 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors rounded-xs"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {filteredPerfumes.length > 0 && (
            <div className="p-2.5 bg-zinc-50 border-t border-zinc-100 text-center">
              <Link
                href="#collection"
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-bold tracking-widest uppercase text-zinc-600 hover:text-zinc-950 transition-colors"
              >
                Browse Full Private Collection →
              </Link>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
