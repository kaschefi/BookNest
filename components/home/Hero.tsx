import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
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
                Explore subjects, notes and resources across Computer Science, Mathematics, Chemistry, Physics and more.
            </p>

            <div className="flex flex-row items-center justify-center gap-4 pt-8">
                <Link href="/subjects" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all shadow-md shadow-blue-600/20">
                    Explore Subjects
                </Link>
                <Link href="/notes" className="bg-white border-2 border-blue-600 hover:bg-blue-50 text-blue-600 px-8 py-3 rounded-full font-medium transition-all">
                    Browse Notes
                </Link>
            </div>
        </div>
    );
}