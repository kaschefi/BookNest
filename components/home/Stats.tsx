export default function Stats() {
    return (
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
    );
}