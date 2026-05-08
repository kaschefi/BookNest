"use client";

import Navbar from "@/components/layout/Navbar";
import HeroDoodles from "@/components/home/HeroDoodles";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";

export default function Home() {
  return (
      <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden pt-4 px-8 pb-12">
        {/* Left red margin lines */}
        <div className="absolute left-10 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>
        <div className="absolute left-11 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>

        <Navbar />

        <main className="relative flex-1 flex flex-col items-center mt-4 w-full max-w-[1400px]">
          <div className="relative w-full flex flex-col items-center flex-1 min-h-[750px]">
            <HeroDoodles />
            <Hero />

            {/* Stack of books doodle */}
            <div className="relative mt-8 w-full max-w-[50rem] h-[280px] md:h-[360px] pointer-events-none mix-blend-multiply">
              <img
                  src="/combined_books.PNG"
                  alt="Combined books, plant, and pencil cup illustration"
                  className="w-full h-full object-contain contrast-[1.1] brightness-[1.1]"
              />
            </div>
          </div>

          <Stats />
        </main>
      </div>
  );
}