import Image from "next/image";

export default function AuthBackgroundDoodles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible w-full h-full hidden lg:block">
      {/* Top Left Binary Text in Circle */}
      <div className="absolute top-[5%] left-[22%] transform rotate-3 scale-110">
        <div className="relative bg-purple-50/40 rounded-full border border-purple-300/60 p-4 px-5 font-hand text-purple-600 text-lg leading-tight shadow-sm backdrop-blur-sm flex items-center justify-center">
          <span className="text-center">10110<br />01001<br />11010</span>
        </div>
      </div>

      {/* Laptop */}
      <div className="absolute top-[6%] left-[4%] w-[280px] h-[280px] transform -rotate-6 mix-blend-multiply">
        <Image src="/new_laptop.png" alt="Laptop doodle" fill className="object-contain grayscale contrast-[1.5] brightness-[1.1]" />
      </div>

      {/* Sparkles Top Left Area */}
      <div className="absolute top-[45%] left-[26%] w-8 h-8 transform rotate-12 mix-blend-multiply opacity-80">
        <Image src="/Star.png" alt="Star" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
      </div>
      <div className="absolute top-[48%] left-[4%] w-6 h-6 transform -rotate-12 mix-blend-multiply opacity-80">
        <Image src="/Star.png" alt="Star" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
      </div>

      {/* Pythagoras Triangle */}
      <div className="absolute bottom-[30%] left-[8%] transform rotate-2 flex flex-col items-center scale-150">
        <div className="relative">
          <svg width="100" height="80" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-800">
            <path d="M10 70 L90 70 L10 10 Z" />
            <rect x="10" y="60" width="10" height="10" />
          </svg>
          <span className="absolute top-[40%] -left-4 font-hand text-xl">a</span>
          <span className="absolute bottom-[-20px] left-[40%] font-hand text-xl">b</span>
          <span className="absolute top-[27%] left-[65%] font-hand text-xl">c</span>
        </div>
        <div className="relative mt-6 font-hand text-2xl text-slate-800">
          a<sup className="text-sm">2</sup> + b<sup className="text-sm">2</sup> = c<sup className="text-sm">2</sup>
          <div className="absolute -bottom-3 left-0 w-[110%] h-6 -ml-[5%] pointer-events-none opacity-90 mix-blend-multiply">
            <Image src="/formula_underline.png" alt="Formula Underline" fill className="object-contain mix-blend-multiply" unoptimized />
          </div>
        </div>
      </div>

      {/* Plant */}
      <div className="absolute bottom-[2%] left-[18%] w-[120px] h-[160px] mix-blend-multiply scale-125">
        <Image src="/plant_doodle_2.png" alt="Plant doodle" fill className="object-contain contrast-[1.2]" />
        <div className="absolute bottom-4 -left-8 text-slate-800 transform rotate-12">
          <svg width="40" height="30" viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5,25 Q15,5 25,25 T35,10" />
          </svg>
        </div>
      </div>

      {/* RIGHT SIDE DOODLES */}

      {/* Quad Formula */}
      <div className="absolute top-[5%] right-[17%] font-hand text-2xl text-slate-800 transform rotate-2 flex items-center gap-2 scale-125">
        <span>X =</span>
        <div className="flex flex-col items-center">
          <span className="border-b border-slate-800 px-2">-b ± √<span className="border-t border-slate-800">b<sup className="text-sm">2</sup> - 4ac</span></span>
          <span>2a</span>
        </div>
      </div>

      <div className="absolute top-[5%] right-[8%] w-10 h-10 transform rotate-12 mix-blend-multiply opacity-80">
        <Image src="/Star.png" alt="Star" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
      </div>

      {/* Sine Graph */}
      <div className="absolute top-[12%] right-[2%] w-[130px] h-[90px] scale-120 mix-blend-multiply">
        <Image src="/sine_graph.png" alt="Sine Graph" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
      </div>

      {/* Beaker */}
      <div className="absolute top-[22%] right-[20%] w-[120px] h-[160px] transform rotate-12 mix-blend-multiply scale-110">
        <Image src="/flask.png" alt="Beaker doodle" fill className="object-contain contrast-[1.2]" />
      </div>

      {/* Chemical Reaction */}
      <div className="absolute top-[42%] right-[8%] font-hand text-2xl text-slate-800 transform -rotate-6 scale-125">
        <span className="bg-green-100/60 px-3 py-1 rounded-[60%_40%_50%_40%/40%_50%_60%_50%] border border-green-200">2H<sub className="text-sm">2</sub> + O<sub className="text-sm">2</sub> → 2H<sub className="text-sm">2</sub>O</span>
      </div>

      {/* Para-Cresol Structure (Moved to right) */}
      <div className="absolute top-[47%] right-[7%] w-[110px] h-[110px] mix-blend-multiply">
        <Image src="/Para-Cresol.png" alt="Para-Cresol" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
      </div>

      {/* Mass block diagram */}
      <div className="absolute bottom-[26%] right-[16%] flex flex-col items-center scale-125">
        <div className="relative">
          <svg width="150" height="60" viewBox="0 0 150 60" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-800">
            {/* Ground */}
            <path d="M10 50 L140 50" />
            <path d="M15 50 L10 55 M25 50 L20 55 M35 50 L30 55 M45 50 L40 55 M55 50 L50 55 M65 50 L60 55 M75 50 L70 55 M85 50 L80 55 M95 50 L90 55 M105 50 L100 55 M115 50 L110 55 M125 50 L120 55 M135 50 L130 55" strokeWidth="1" />
            {/* Block */}
            <rect x="50" y="20" width="40" height="30" />
            {/* Arrow */}
            <path d="M90 35 L130 35 L120 30 M130 35 L120 40" />
          </svg>
          <span className="absolute top-[24px] left-[65px] font-hand text-lg">m</span>
          <span className="absolute top-[20px] left-[135px] font-hand text-lg">F</span>
          <span className="absolute top-[52px] left-[65px] font-hand text-lg">μ</span>
        </div>
      </div>

      {/* F = ma */}
      <div className="absolute bottom-[13%] right-[18%] font-hand text-3xl text-slate-800 transform -rotate-2 scale-125">
        <span className="bg-pink-100/60 px-4 py-1 rounded-[40%_60%_50%_40%/50%_40%_60%_50%] border border-pink-200">F = ma</span>
      </div>

      {/* Lightning Bolt */}
      <div className="absolute bottom-[10%] right-[8%] w-12 h-16 transform rotate-12 mix-blend-multiply scale-125">
        <Image src="/zap.png" alt="Lightning Bolt" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
      </div>

    </div>
  );
}
