"use client";

import Image from "next/image";

export default function HeroDoodles() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-visible w-full h-full hidden min-[1300px]:block">

            {/* Top Center Atom */}
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

            {/* FAR-LEFT COLUMN */}
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v3m0 14v3m10-10h-3M5 12H2m15.657-7.657l-2.121 2.121M8.464 17.536l-2.121 2.121m11.314 0l-2.121-2.121M8.464 6.464L6.343 4.343" />
                </svg>
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

            {/* FAR-RIGHT COLUMN */}
            <div className="absolute top-[12%] right-[2%] w-[130px] h-[90px] scale-120 mix-blend-multiply">
                <Image src="/sine_graph.png" alt="Sine Graph" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
            </div>

            <div className="absolute top-[0%] right-[5%] w-7 h-7 transform rotate-45 mix-blend-multiply">
                <Image src="/Star.png" alt="Star" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
            </div>

            <div className="absolute top-[0%] right-[18%] font-hand text-2xl text-slate-800 transform rotate-2 flex items-center gap-2">
                <span>X =</span>
                <div className="flex flex-col items-center">
                    <span className="border-b border-slate-800 px-2">-b ± √<span className="border-t border-slate-800">b<sup className="text-sm">2</sup> - 4ac</span></span>
                    <span>2a</span>
                </div>
            </div>

            <div className="absolute top-[10%] right-[20%] w-[120px] h-[160px] transform rotate-6 mix-blend-multiply">
                <Image src="/Flask.png" alt="Flask" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
            </div>

            <div className="absolute top-[40%] right-[24%] w-[120px] h-[100px] transform -rotate-12 mix-blend-multiply">
                <Image src="/Molecular_Model.png" alt="Molecular Model" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
            </div>

            <div className="absolute top-[35%] right-[5%] font-hand text-2xl text-slate-800 transform -rotate-10 scale-130">
                <span className="bg-green-100/60 px-3 py-1 rounded-lg">2H<sub className="text-sm">2</sub> + O<sub className="text-sm">2</sub> → 2H<sub className="text-sm">2</sub>O</span>
            </div>

            <div className="absolute top-[47%] right-[7%] w-[110px] h-[110px] mix-blend-multiply">
                <Image src="/Para-Cresol.png" alt="Para-Cresol" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
            </div>

            <div className="absolute top-[65%] right-[15%] w-[160px] h-[80px] scale-120 mix-blend-multiply">
                <Image src="/Force_Block.png" alt="Force Block" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
            </div>

            <div className="absolute top-[80%] right-[10%] font-hand text-3xl text-slate-800 transform rotate-3">
                <span className="bg-pink-100/60 px-3 py-1 rounded-lg">F = ma</span>
            </div>

            <div className="absolute top-[80%] right-[2%] w-10 h-14 transform rotate-12 mix-blend-multiply">
                <Image src="/zap.png" alt="Zap" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
            </div>

            {/* LOWER-LEFT CLUSTER */}
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

            <div className="absolute top-[78%] left-[5%] transform -rotate-3 font-hand text-3xl text-slate-800 scale-110">
                <div className="relative inline-block">
                    a<sup className="text-sm">2</sup> + b<sup className="text-sm">2</sup> = c<sup className="text-sm">2</sup>
                    <div className="absolute -bottom-3 left-0 w-[110%] h-6 -ml-[5%] pointer-events-none opacity-90 mix-blend-multiply">
                        <Image src="/formula_underline.png" alt="Formula Underline" fill className="object-contain mix-blend-multiply" unoptimized />
                    </div>
                </div>
            </div>

        </div>
    );
}