"use client";

import Image from "next/image";
import { useState, useRef, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Navbar from "./layout/Navbar";
import AuthBackgroundDoodles from "./AuthBackgroundDoodles";
import AuthSocialLogins from "./AuthSocialLogins";
import { useAnimatedPen } from "../hooks/useAnimatedPen";
import { useAuthForm } from "../hooks/useAuthForm";
import { useLanguage } from "../context/LanguageContext";

function AuthPageContentInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const oauthError = searchParams ? searchParams.get("error") : null;
  
  const isLoginPath = pathname === "/login";
  const [isLogin, setIsLogin] = useState(isLoginPath);
  const [prevPath, setPrevPath] = useState(pathname);
  const cardRef = useRef<HTMLDivElement>(null);

  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setIsLogin(pathname === "/login");
  }

  useEffect(() => {
    if (!isLogin && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [isLogin]);

  // --- Hooks ---
  const {
    penPos, isWriting, isTyping, defaultPos, defaultPenContainerRef,
    handleInputFocus, handleInputBlur, handleInputInteraction
  } = useAnimatedPen([isLogin]);

  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    repeatPassword, setRepeatPassword,
    error, success, loading,
    showPassword, setShowPassword,
    showRepeatPassword, setShowRepeatPassword,
    handleSubmit
  } = useAuthForm(isLogin);

  const { t, isRTL } = useLanguage();

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(
      e,
      () => { window.location.href = "/"; }, // On login
      () => {
        setIsLogin(true);
        window.history.pushState(null, "", "/login");
      } // On signup
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden pt-4 px-8 pb-12">
      {/* Left red margin lines for notebook paper */}
      <div className="absolute left-10 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>
      <div className="absolute left-11 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative flex-1 flex flex-col justify-center items-center mt-8 w-full max-w-[1400px]">

        <AuthBackgroundDoodles />

        {/* CENTRAL LOGIN CARD (STUDY AGREEMENT) */}
        <div ref={cardRef} className="relative z-10 w-full max-w-[500px] mb-12 mt-4">

          {/* Main Card with clipped corner */}
          <div className="relative bg-[#fdfaf6] border border-slate-600 p-6 md:p-8 pb-8 shadow-xl flex flex-col items-center"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 36px), calc(100% - 36px) 100%, 0 100%)' }}>

            <h2 className="text-3xl font-bold text-slate-800 tracking-tight pb-2 mb-2 inline-block rounded-sm transform -rotate-1 font-sans">
              {isLogin ? t("auth.studyAgreementTitle") : t("auth.joinTheNestTitle")}
            </h2>

            <div className="text-center font-hand text-slate-700 text-lg leading-relaxed mb-4 max-w-[320px]">
              {isLogin ? t("auth.loginSubtitleLine1") : t("auth.signupSubtitleLine1")}
              <span className="bg-purple-200/50 px-1 rounded inline-block transform -rotate-1">{t("auth.subtitleHighlight")}</span>
            </div>

            {/* Small star under subtitle */}
            <div className="text-slate-600 mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>

            <form className="w-full space-y-3" onSubmit={onSubmit}>

              {!isLogin && (
                <div className="w-full">
                  <label className="block text-sm font-hand text-slate-700 mb-1 pl-1 rtl:pl-0 rtl:pr-1">{t("auth.fullNameLabel")}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 rtl:left-auto rtl:right-0 rtl:pl-0 rtl:pr-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <input
                      type="text"
                      placeholder={t("auth.fullNamePlaceholder")}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        handleInputInteraction(e);
                      }}
                      className="w-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-2 bg-transparent border border-slate-400 rounded-lg text-slate-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      onClick={handleInputInteraction}
                      onKeyUp={handleInputInteraction}
                      onKeyDown={handleInputInteraction}
                    />
                  </div>
                </div>
              )}

              <div className="w-full">
                <label className="block text-sm font-hand text-slate-700 mb-1 pl-1 rtl:pl-0 rtl:pr-1">{t("auth.emailLabel")}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 rtl:left-auto rtl:right-0 rtl:pl-0 rtl:pr-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <input
                    type="email"
                    placeholder={t("auth.emailPlaceholder")}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      handleInputInteraction(e);
                    }}
                    className="w-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-2 bg-transparent border border-slate-400 rounded-lg text-slate-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onClick={handleInputInteraction}
                    onKeyUp={handleInputInteraction}
                    onKeyDown={handleInputInteraction}
                  />
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-hand text-slate-700 mb-1 pl-1 rtl:pl-0 rtl:pr-1">{t("auth.passwordLabel")}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 rtl:left-auto rtl:right-0 rtl:pl-0 rtl:pr-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.passwordPlaceholder")}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      handleInputInteraction(e);
                    }}
                    className="w-full pl-11 pr-10 rtl:pl-10 rtl:pr-11 py-2 bg-transparent border border-slate-400 rounded-lg text-slate-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onClick={handleInputInteraction}
                    onKeyUp={handleInputInteraction}
                    onKeyDown={handleInputInteraction}
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-4 rtl:right-auto rtl:left-0 rtl:pr-0 rtl:pl-4 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.573 4.573m0 0l14.854 14.854M15 12a3 3 0 11-3-3m3 3L9 9" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {!isLogin && (
                <div className="w-full">
                  <label className="block text-sm font-hand text-slate-700 mb-1 pl-1 rtl:pl-0 rtl:pr-1">{t("auth.repeatPasswordLabel")}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 rtl:left-auto rtl:right-0 rtl:pl-0 rtl:pr-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <input
                      type={showRepeatPassword ? "text" : "password"}
                      placeholder={t("auth.repeatPasswordPlaceholder")}
                      value={repeatPassword}
                      onChange={(e) => {
                        setRepeatPassword(e.target.value);
                        handleInputInteraction(e);
                      }}
                      className="w-full pl-11 pr-10 rtl:pl-10 rtl:pr-11 py-2 bg-transparent border border-slate-400 rounded-lg text-slate-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      onClick={handleInputInteraction}
                      onKeyUp={handleInputInteraction}
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-4 rtl:right-auto rtl:left-0 rtl:pr-0 rtl:pl-4 flex items-center cursor-pointer"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    >
                      {showRepeatPassword ? (
                        <svg className="h-5 w-5 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.573 4.573m0 0l14.854 14.854M15 12a3 3 0 11-3-3m3 3L9 9" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {error && <div className="text-red-500 text-sm font-sans text-center bg-red-50 p-2 rounded border border-red-200">{error}</div>}
              {success && <div className="text-green-600 text-sm font-sans text-center bg-green-50 p-2 rounded border border-green-200">{success}</div>}
              {oauthError && (
                <div className="text-red-600 text-sm font-semibold text-center bg-red-50 p-2.5 rounded border border-red-200 transform rotate-[-0.5deg]">
                  {oauthError === "EmailUsedLocally"
                    ? t("auth.emailUsedLocallyError")
                    : oauthError === "AccessDenied"
                    ? t("auth.accessDeniedError")
                    : t("auth.authFailedError").replace("{error}", oauthError)}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5b73b5] hover:bg-blue-700 text-white py-2 rounded-full font-medium transition-all shadow-md mt-4 disabled:opacity-70 disabled:cursor-not-allowed uppercase"
              >
                {loading ? t("auth.processingButton") : (isLogin ? t("auth.signInButton") : t("auth.signUpButton"))}
              </button>
            </form>

            <AuthSocialLogins />

            {/* Signature Area (Two lines) */}
            <div className="w-full mt-8 flex justify-between px-2">
              {/* Learner Signature */}
              <div className="flex flex-col items-center justify-end relative w-[45%]">
                <span className="absolute left-[-15px] rtl:left-auto rtl:right-[-15px] bottom-6 text-slate-800 font-hand text-lg">x</span>
                <div className="absolute top-[-20px] left-4 rtl:left-auto rtl:right-4 transform text-blue-500 opacity-80 pointer-events-none scale-125">
                  <svg width="60" height="20" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2.5" className="font-hand" style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                    <path d="M5,35 Q10,10 15,30 T25,35 Q30,15 35,30 T45,35 Q50,20 55,30 T65,35" />
                  </svg>
                </div>
                <div className="w-full border-b border-slate-600"></div>
                <span className="text-sm font-hand text-slate-700 mt-1">{t("auth.learnerSignature")}</span>
              </div>

              {/* Date Signature */}
              <div className="flex flex-col items-center justify-end relative w-[45%]">
                <span className="absolute bottom-6 font-hand text-slate-800 text-lg transform -rotate-2" suppressHydrationWarning>
                  {new Date().toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <div className="w-full border-b border-slate-600" ref={defaultPenContainerRef}></div>
                <span className="text-sm font-hand text-slate-700 mt-1">{t("auth.dateSignature")}</span>
              </div>
            </div>
          </div>

          {/* Tape at the top */}
          <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 -rotate-1 w-32 h-10 bg-blue-200/90 shadow-sm z-20 border border-slate-400"
            style={{ clipPath: 'polygon(2% 0, 98% 2%, 100% 10%, 96% 20%, 100% 30%, 97% 40%, 100% 50%, 98% 60%, 100% 70%, 96% 80%, 100% 90%, 98% 100%, 2% 98%, 0 90%, 4% 80%, 0 70%, 2% 60%, 0 50%, 3% 40%, 0 30%, 4% 20%, 0 10%)' }}>
            <div className="w-full h-full opacity-20 bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:4px_100%]"></div>
          </div>

          {/* Folded Corner Dog-Ear */}
          <div className="absolute bottom-[0px] right-[0px] rtl:right-auto rtl:left-[0px] w-10 h-10 bg-[#fdfaf6] border-l border-t border-slate-500 shadow-[-2px_-2px_4px_rgba(0,0,0,0.15)] z-20"
            style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)', borderBottomRightRadius: '6px' }}>
          </div>

          {/* Sticky Note with Paperclip */}
          <div className="absolute bottom-[-30px] left-1/3 transform -translate-x-1/2 rotate-3 z-30 flex flex-col items-center">
            {/* Paperclip */}
            <div className="z-40 text-slate-500 transform -rotate-12 translate-y-3 drop-shadow-md">
              <svg width="24" height="40" viewBox="0 0 24 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 28V8a4 4 0 00-8 0v22a6 6 0 0012 0V12a2 2 0 00-4 0v14" />
              </svg>
            </div>
            {/* Note */}
            <div className="w-[200px] bg-[#f9ebc7] p-3 shadow-md border border-[#e6d3a8] relative">
              <p className="font-hand text-slate-800 text-center leading-tight whitespace-pre-line">
                {t("auth.quoteText")}
              </p>
              <div className="absolute bottom-2 right-2 text-slate-600">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="absolute top-2 left-2 text-yellow-500 opacity-60">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.8-6.3 4.8 2.3-7.4-6-4.6h7.6z" /></svg>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* PEN DOODLE - Moved outside the clip-path container so it is not clipped! */}
      <div
        className={`absolute pointer-events-none w-56 h-56 z-[100] transition-all ease-out ${isWriting ? 'duration-150' : 'duration-500'}`}
        style={{
          left: isWriting ? `${penPos.x}px` : `${defaultPos.x}px`,
          top: isWriting ? `${penPos.y}px` : `${defaultPos.y}px`,
          opacity: defaultPos.x === 0 && !isWriting ? 0 : 1 // Hide initially until default pos is measured
        }}
      >
        <div className={`relative w-full h-full origin-bottom-left transition-transform ${isTyping ? 'animate-wiggle-pen' : 'transform rotate-0'}`}>
          <Image
            src="/pen_doodle_v5.png"
            alt="Pen"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default function AuthPageContent() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-x-hidden p-8 bg-[#fdfaf6]">
        <div className="w-full max-w-sm bg-[#fdfaf6] border border-slate-400 p-8 rounded-[16px] shadow-xl flex flex-col items-center text-center">
          <div className="animate-bounce mb-4 text-[#5b73b5]">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h3 className="font-sans text-xl font-bold text-slate-800 uppercase tracking-wider">{t("auth.loadingTitle")}</h3>
          <p className="font-hand text-[19px] text-slate-600 mt-2">{t("auth.loadingSubtitle")}</p>
        </div>
      </div>
    }>
      <AuthPageContentInner />
    </Suspense>
  );
}
