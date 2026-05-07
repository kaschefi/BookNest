"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Logo from "../../components/Logo";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [penPos, setPenPos] = useState({ x: 0, y: 0 });
  const [isWriting, setIsWriting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const penRef = useRef<HTMLDivElement>(null);
  const defaultPenContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only scroll to the card when in Signup mode (!isLogin)
    if (!isLogin && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [isLogin]);

  // Function to calculate exact caret coordinates
  const getCaretCoordinates = (inputElement: HTMLInputElement) => {
    const { selectionStart } = inputElement;

    // type="email" inputs don't support selectionStart in most browsers.
    // Fall back to the end of the value string for the position.
    const caretPos = selectionStart ?? inputElement.value.length;

    // Create a ghost div
    const ghost = document.createElement("div");
    const style = window.getComputedStyle(inputElement);

    // Copy all relevant styles
    Array.from(style).forEach((prop) => {
      ghost.style.setProperty(prop, style.getPropertyValue(prop), style.getPropertyPriority(prop));
    });

    ghost.style.position = "absolute";
    ghost.style.visibility = "hidden";
    ghost.style.whiteSpace = "pre"; // Use 'pre' for single-line inputs
    ghost.style.width = style.width;
    ghost.style.height = style.height;
    ghost.style.overflow = "hidden";

    // Set text up to caret
    // If empty, put a zero-width space so it has height
    const textUpToCaret = inputElement.value.substring(0, caretPos) || "\u200b";
    ghost.textContent = textUpToCaret;

    // Add a span to measure the position
    const span = document.createElement("span");
    span.textContent = "|";
    ghost.appendChild(span);

    document.body.appendChild(ghost);

    // Get coordinates relative to the input, factoring in input scrolling!
    const spanOffsetLeft = span.offsetLeft;
    const spanOffsetTop = span.offsetTop;

    document.body.removeChild(ghost);

    // Get input's global position
    const rect = inputElement.getBoundingClientRect();

    return {
      x: rect.left + spanOffsetLeft - (inputElement.scrollLeft || 0) + window.scrollX,
      y: rect.top + spanOffsetTop + window.scrollY
    };
  };

  const updatePenPosition = (inputElement: HTMLInputElement) => {
    const coords = getCaretCoordinates(inputElement);
    if (coords) {
      // Offset for the pen tip. 
      // The uploaded image is pointing bottom-left. 
      // Assuming tip is exactly at the bottom-left corner of the w-56 h-56 square.
      setPenPos({ x: coords.x - 25, y: coords.y - 215 });
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsWriting(true);
    updatePenPosition(e.target);
  };

  const handleInputBlur = () => {
    setIsWriting(false);
  };

  const handleInputInteraction = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (isWriting) {
      updatePenPosition(e.currentTarget);

      // Trigger typing animation
      setIsTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 150);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isLogin && password !== repeatPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const payload = isLogin ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (isLogin) {
        // Store token and redirect
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        // Switch to login on successful signup
        setSuccess("Account created successfully! Please sign in.");
        setIsLogin(true);
        setName("");
        setPassword("");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Keep track of the default position of the signature area 
  // so the pen can smoothly return there.
  const [defaultPos, setDefaultPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateDefaultPos = () => {
      if (defaultPenContainerRef.current) {
        const rect = defaultPenContainerRef.current.getBoundingClientRect();
        // Place the tip right in the middle of the 'Date' line
        setDefaultPos({
          x: rect.left + (rect.width / 2) + 10 + window.scrollX,
          y: rect.top - 230 + window.scrollY
        });
      }
    };

    updateDefaultPos();
    // Use timeout to ensure fonts load before measuring
    setTimeout(updateDefaultPos, 500);
    window.addEventListener("resize", updateDefaultPos);
    return () => window.removeEventListener("resize", updateDefaultPos);
  }, [isLogin]); // Also update when toggling login/signup as layout changes

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden pt-4 px-8 pb-12">
      {/* Left red margin lines for notebook paper */}
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
          <button className="bg-[#5b73b5] hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative flex-1 flex flex-col justify-center items-center mt-8 w-full max-w-[1400px]">

        {/* DOODLES CONTAINER */}
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
              <div className="absolute -bottom-3 left-0 w-[110%] h-6 -ml-[5%] pointer-events-none opacity-90">
                <Image src="/formula_underline.png" alt="Formula Underline" fill className="object-contain" unoptimized />
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

        {/* CENTRAL LOGIN CARD (STUDY AGREEMENT) */}
        <div ref={cardRef} className="relative z-10 w-full max-w-[500px] mb-12 mt-4">

          {/* Main Card with clipped corner */}
          <div className="relative bg-[#fdfaf6] border border-slate-600 p-6 md:p-8 pb-8 shadow-xl flex flex-col items-center"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 36px), calc(100% - 36px) 100%, 0 100%)' }}>

            <h2 className="text-3xl font-bold text-slate-800 tracking-tight pb-2 mb-2 inline-block rounded-sm transform -rotate-1">
              {isLogin ? "STUDY AGREEMENT" : "JOIN THE NEST"}
            </h2>

            <div className="text-center font-hand text-slate-700 text-lg leading-relaxed mb-4 max-w-[320px]">
              {isLogin ? "By signing in, you agree to embark on a journey of " : "Create an account to embark on a journey of "}
              <span className="bg-purple-200/50 px-1 rounded inline-block transform -rotate-1">learning, growth and knowledge.</span>
            </div>

            {/* Small star under subtitle */}
            <div className="text-slate-600 mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>

            <form className="w-full space-y-3" onSubmit={handleSubmit}>

              {!isLogin && (
                <div className="w-full">
                  <label className="block text-sm font-hand text-slate-700 mb-1 pl-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        handleInputInteraction(e);
                      }}
                      className="w-full pl-11 pr-4 py-2 bg-transparent border border-slate-400 rounded-lg text-slate-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
                <label className="block text-sm font-hand text-slate-700 mb-1 pl-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      handleInputInteraction(e);
                    }}
                    className="w-full pl-11 pr-4 py-2 bg-transparent border border-slate-400 rounded-lg text-slate-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onClick={handleInputInteraction}
                    onKeyUp={handleInputInteraction}
                    onKeyDown={handleInputInteraction}
                  />
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-hand text-slate-700 mb-1 pl-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      handleInputInteraction(e);
                    }}
                    className="w-full pl-11 pr-10 py-2 bg-transparent border border-slate-400 rounded-lg text-slate-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onClick={handleInputInteraction}
                    onKeyUp={handleInputInteraction}
                    onKeyDown={handleInputInteraction}
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
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
                {isLogin && (
                  <div className="w-full flex justify-end mt-1">
                    <a href="#" className="text-sm font-hand text-blue-500 hover:text-blue-700 hover:underline">Forgot password?</a>
                  </div>
                )}
              </div>

              {!isLogin && (
                <div className="w-full">
                  <label className="block text-sm font-hand text-slate-700 mb-1 pl-1">Repeat Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <input
                      type={showRepeatPassword ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={repeatPassword}
                      onChange={(e) => {
                        setRepeatPassword(e.target.value);
                        handleInputInteraction(e);
                      }}
                      className="w-full pl-11 pr-10 py-2 bg-transparent border border-slate-400 rounded-lg text-slate-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      onClick={handleInputInteraction}
                      onKeyUp={handleInputInteraction}
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5b73b5] hover:bg-blue-700 text-white py-2 rounded-full font-medium transition-all shadow-md mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
              </button>
            </form>

            <div className="w-full mt-4 flex items-center justify-center relative">
              <div className="absolute w-full border-t border-slate-300"></div>
              <span className="bg-[#fdfaf6] px-4 text-xs font-bold text-slate-800 z-10">or continue with</span>
            </div>

            <div className="flex gap-4 mt-4">
              <button className="flex items-center justify-center w-14 h-10 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </button>
              <button className="flex items-center justify-center w-14 h-10 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </button>
              <button className="flex items-center justify-center w-14 h-10 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-black">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.26.45 3.09.45.9 0 2.27-.64 3.73-.55 2.65.15 4.3 1.34 5.25 3.19-2.29 1.37-1.89 4.39.42 5.37-1.03 2.54-2.73 4.22-4.49 4.51zm-3.24-11.8c-.14-2.45 1.76-4.66 4.33-4.73.34 2.55-1.92 4.79-4.33 4.73z" />
                </svg>
              </button>
            </div>

            {/* Signature Area (Two lines) */}
            <div className="w-full mt-8 flex justify-between px-2">
              {/* Learner Signature */}
              <div className="flex flex-col items-center justify-end relative w-[45%]">
                <span className="absolute left-[-15px] bottom-6 text-slate-800 font-hand text-lg">x</span>
                <div className="absolute top-[-20px] left-4 transform text-blue-500 opacity-80 pointer-events-none scale-125">
                  <svg width="60" height="20" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2.5" className="font-hand" style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                    <path d="M5,35 Q10,10 15,30 T25,35 Q30,15 35,30 T45,35 Q50,20 55,30 T65,35" />
                  </svg>
                </div>
                <div className="w-full border-b border-slate-600"></div>
                <span className="text-sm font-hand text-slate-700 mt-1">Learner</span>
              </div>

              {/* Date Signature */}
              <div className="flex flex-col items-center justify-end relative w-[45%]">
                <span className="absolute bottom-6 font-hand text-slate-800 text-lg transform -rotate-2" suppressHydrationWarning>
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <div className="w-full border-b border-slate-600" ref={defaultPenContainerRef}></div>
                <span className="text-sm font-hand text-slate-700 mt-1">Date</span>
              </div>
            </div>
          </div>

          {/* Tape at the top */}
          <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 -rotate-1 w-32 h-10 bg-blue-200/90 shadow-sm z-20 border border-slate-400"
            style={{ clipPath: 'polygon(2% 0, 98% 2%, 100% 10%, 96% 20%, 100% 30%, 97% 40%, 100% 50%, 98% 60%, 100% 70%, 96% 80%, 100% 90%, 98% 100%, 2% 98%, 0 90%, 4% 80%, 0 70%, 2% 60%, 0 50%, 3% 40%, 0 30%, 4% 20%, 0 10%)' }}>
            <div className="w-full h-full opacity-20 bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:4px_100%]"></div>
          </div>

          {/* Folded Corner Dog-Ear */}
          <div className="absolute bottom-[0px] right-[0px] w-10 h-10 bg-[#fdfaf6] border-l border-t border-slate-500 shadow-[-2px_-2px_4px_rgba(0,0,0,0.15)] z-20"
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
              <p className="font-hand text-slate-800 text-center leading-tight">
                "The more you learn,<br />the more you earn."
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
