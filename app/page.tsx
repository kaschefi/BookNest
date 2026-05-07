"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "../components/Logo";
import { useState, useEffect } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };
  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden pt-4 px-8 pb-12">
      {/* Left red margin line for notebook paper */}
      <div className="absolute left-10 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>
      <div className="absolute left-11 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>

      {/* Navigation */}
      <nav className="relative z-20 w-full max-w-7xl flex justify-between items-center py-4">
        <Logo />

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <Link href="#" className="border-b-2 border-blue-600 text-slate-900 pb-1">Home</Link>
          <Link href="#" className="hover:text-blue-600 transition-colors">Books</Link>
          <Link href="#" className="hover:text-blue-600 transition-colors">Notes</Link>
          <Link href="#" className="hover:text-blue-600 transition-colors">Subjects</Link>
          <Link href="#" className="hover:text-blue-600 transition-colors">About</Link>
          <Link href="#" className="hover:text-blue-600 transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-slate-600 hover:text-slate-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
          {isLoggedIn ? (
            <button 
              onClick={handleSignOut}
              className="bg-white border-2 border-blue-600 hover:bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-sm font-medium transition-all"
            >
              Sign Out
            </button>
          ) : (
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors">
              Join / Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative flex-1 flex flex-col items-center mt-4 w-full max-w-[1400px]">

        {/* HERO SECTION WRAPPER */}
        <div className="relative w-full flex flex-col items-center flex-1 min-h-[750px]">

          {/* DOODLES CONTAINER */}
          <div className="absolute inset-0 pointer-events-none overflow-visible w-full h-full hidden min-[1300px]:block">

            {/* Top Center Atom (Kept from original image) */}
            <div className="absolute top-[0%] left-1/2 transform -translate-x-1/2 text-slate-800">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(30 50 50)" />
                <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(90 50 50)" />
                <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(150 50 50)" />
                <circle cx="50" cy="50" r="5" fill="currentColor" />
                <circle cx="85" cy="70" r="4" fill="#3b82f6" stroke="none" />
                <circle cx="15" cy="30" r="4" fill="#3b82f6" stroke="none" />
                <circle cx="70" cy="15" r="4" fill="#3b82f6" stroke="none" />
              </svg>
            </div>

            {/* --- FAR-LEFT COLUMN --- */}

            <div className="absolute top-[6%] left-[4%] w-[280px] h-[280px] transform -rotate-6 mix-blend-multiply">
              <Image src="/new_laptop.png" alt="Laptop doodle" fill className="object-contain grayscale contrast-[1.2] brightness-[1.1]" />
            </div>

            <div className="absolute top-[40%] left-[20%] w-12 h-12 transform rotate-12 mix-blend-multiply z-30 scale-120">
              <Image src="/curser.png" alt="Curser" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
            </div>

            {/* Binary Text in Cloud */}
            <div className="absolute top-[-5%] left-[20%] transform rotate-3">
              <div className="relative bg-purple-50/50 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-2 border-purple-200/50 p-4 px-6 font-hand text-purple-700 text-lg leading-snug shadow-sm backdrop-blur-sm">
                10110<br />01001<br />11010
              </div>
            </div>

            <div className="absolute top-[2%] left-[2%] w-6 h-6 transform -rotate-12 mix-blend-multiply">
              <Image src="/Star.png" alt="Star" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
            </div>
            <div className="absolute top-[18%] left-[24%] w-5 h-5 transform rotate-12 mix-blend-multiply">
              <Image src="/Star.png" alt="Star" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
            </div>
            <div className="absolute top-[35%] left-[2%] text-slate-400 transform -rotate-12">
              <svg viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-8">
                <path d="M0 10 Q 5 0, 10 10 T 20 10 T 30 10 T 40 10" />
              </svg>
            </div>

            {/* Sun & E=mc^2 */}
            <div className="absolute top-[42%] left-[10%] text-yellow-500 transform rotate-12">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8"><circle cx="12" cy="12" r="4" /><path d="M12 2v3m0 14v3m10-10h-3M5 12H2m15.657-7.657l-2.121 2.121M8.464 17.536l-2.121 2.121m11.314 0l-2.121-2.121M8.464 6.464L6.343 4.343" /></svg>
            </div>
            <div className="absolute top-[50%] left-[6%] transform -rotate-6 font-hand text-4xl text-slate-800">
              E = mc<sup className="text-xl">2</sup>
            </div>

            {/* Lower Squiggle */}
            <div className="absolute top-[85%] left-[2%] text-slate-400 transform rotate-12">
              <svg viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-6">
                <path d="M0 10 C 10 0, 10 20, 20 10 C 30 0, 30 20, 40 10" />
              </svg>
            </div>


            {/* --- FAR-RIGHT COLUMN --- */}

            {/* Sine Graph */}
            <div className="absolute top-[12%] right-[2%] w-[130px] h-[90px] scale-120 mix-blend-multiply">
              <Image src="/sine_graph.png" alt="Sine Graph" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
            </div>

            {/* Sparkle 3 */}
            <div className="absolute top-[0%] right-[5%] w-7 h-7 transform rotate-45 mix-blend-multiply">
              <Image src="/Star.png" alt="Star" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
            </div>

            {/* Quad Formula */}
            <div className="absolute top-[0%] right-[18%] font-hand text-2xl text-slate-800 transform rotate-2 flex items-center gap-2">
              <span>X =</span>
              <div className="flex flex-col items-center">
                <span className="border-b border-slate-800 px-2">-b ± √<span className="border-t border-slate-800">b<sup className="text-sm">2</sup> - 4ac</span></span>
                <span>2a</span>
              </div>
            </div>

            {/* Flask */}
            <div className="absolute top-[10%] right-[20%] w-[120px] h-[160px] transform rotate-6 mix-blend-multiply">
              <Image src="/Flask.png" alt="Flask" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
            </div>

            {/* Molecular Model (Chain) */}
            <div className="absolute top-[40%] right-[24%] w-[120px] h-[100px] transform -rotate-12 mix-blend-multiply">
              <Image src="/Molecular_Model.png" alt="Molecular Model" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
            </div>

            {/* Chemical Reaction */}
            <div className="absolute top-[35%] right-[5%] font-hand text-2xl text-slate-800 transform -rotate-10 scale-130">
              <span className="bg-green-100/60 px-3 py-1 rounded-lg">2H<sub className="text-sm">2</sub> + O<sub className="text-sm">2</sub> → 2H<sub className="text-sm">2</sub>O</span>
            </div>

            {/* Para-Cresol Structure */}
            <div className="absolute top-[47%] right-[7%] w-[110px] h-[110px] mix-blend-multiply">
              <Image src="/Para-Cresol.png" alt="Para-Cresol" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
            </div>

            {/* Force Block Diagram */}
            <div className="absolute top-[65%] right-[15%] w-[160px] h-[80px] scale-120 mix-blend-multiply">
              <Image src="/Force_Block.png" alt="Force Block" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
            </div>

            {/* F = ma */}
            <div className="absolute top-[80%] right-[10%] font-hand text-3xl text-slate-800 transform rotate-3">
              <span className="bg-pink-100/60 px-3 py-1 rounded-lg">F = ma</span>
            </div>

            {/* Lightning Bolt */}
            <div className="absolute top-[80%] right-[2%] w-10 h-14 transform rotate-12 mix-blend-multiply">
              <Image src="/zap.png" alt="Zap" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
            </div>


            {/* --- LOWER-LEFT CLUSTER --- */}

            {/* Triangle */}
            <div className="absolute top-[57%] left-[20%] transform rotate-2 flex flex-col items-center">
              <div className="relative">
                <svg width="100" height="80" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-800">
                  <path d="M10 70 L90 70 L10 10 Z" />
                  <rect x="10" y="60" width="10" height="10" />
                </svg>
                <span className="absolute top-[40%] -left-3 font-hand text-xl">a</span>
                <span className="absolute bottom-[-20px] left-[40%] font-hand text-xl">b</span>
                <span className="absolute top-[27%] left-[65%] font-hand text-xl">c</span>
              </div>
            </div>

            {/* Pythagoras */}
            <div className="absolute top-[78%] left-[5%] transform -rotate-3 font-hand text-3xl text-slate-800 scale-110">
              <div className="relative inline-block">
                a<sup className="text-sm">2</sup> + b<sup className="text-sm">2</sup> = c<sup className="text-sm">2</sup>
                <div className="absolute -bottom-3 left-0 w-[110%] h-6 -ml-[5%] pointer-events-none opacity-90">
                  <Image src="/formula_underline.png" alt="Formula Underline" fill className="object-contain" unoptimized />
                </div>
              </div>
            </div>

            {/* --- LOWER-RIGHT CLUSTER --- */}

          </div>

          {/* Hero Text */}
          <div className="relative z-20 mt-16 flex flex-col items-center w-full">
            <div className="text-left">
              <h2 className="text-5xl md:text-[64px] font-bold text-slate-800 tracking-tight pb-2 bg-gradient-to-r from-blue-900 to-purple-900 text-transparent bg-clip-text">
                Books open minds.
              </h2>
              <div className="relative inline-block">
                <h2 className="text-5xl md:text-[64px] font-hand text-blue-600 pb-4 relative z-10">
                  Knowledge shapes futures.
                </h2>
                <div className="absolute -bottom-4 left-4 w-[105%] h-12 -ml-[2.5%] pointer-events-none opacity-90 scale-80">
                  <Image src="/title_underline.png" alt="Title Underline" fill className="object-contain" unoptimized />
                </div>
              </div>
            </div>

            <p className="text-lg md:text-xl text-slate-600 font-hand text-center max-w-xl mx-auto leading-relaxed pt-2">
              Explore books, notes and resources across Computer Science, Mathematics, Chemistry, Physics and more.
            </p>

            <div className="flex flex-row items-center justify-center gap-4 pt-8">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all shadow-md shadow-blue-600/20">
                Explore Books
              </button>
              <button className="bg-white border-2 border-blue-600 hover:bg-blue-50 text-blue-600 px-8 py-3 rounded-full font-medium transition-all">
                Browse Notes
              </button>
            </div>
          </div>

          {/* Stack of books doodle (Lower-Center) */}
          <div className="relative mt-8 w-full max-w-[50rem] h-[280px] md:h-[360px] pointer-events-none mix-blend-multiply">
            <Image src="/combined_books.PNG" alt="Combined books, plant, and pencil cup illustration" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
          </div>

        </div>

        {/* Footer Stats Component */}
        <div className="relative z-20 w-full max-w-5xl bg-white/80 backdrop-blur-md border border-slate-100 shadow-xl rounded-3xl p-6 mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">

          <div className="flex items-center justify-center gap-4 border-r border-slate-100 last:border-0 md:border-r">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 whitespace-nowrap">1000+ Books</h4>
              <p className="text-xs text-slate-500 font-hand whitespace-nowrap">Curated collection</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 border-r border-slate-100 last:border-0 md:border-r">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 whitespace-nowrap">5000+ Notes</h4>
              <p className="text-xs text-slate-500 font-hand whitespace-nowrap">Study made easy</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 border-r border-slate-100 last:border-0 md:border-r">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 whitespace-nowrap">5+ Subjects</h4>
              <p className="text-xs text-slate-500 font-hand whitespace-nowrap">Explore & learn</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 whitespace-nowrap">10K+ Readers</h4>
              <p className="text-xs text-slate-500 font-hand whitespace-nowrap">Growing community</p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
