"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, AlertCircle, Home, BookOpen, RotateCcw, CupSoda, Bot, User, Code, Eye, Zap } from "lucide-react";

type GameState = "idle" | "playing" | "won" | "lost";
type Dev1Status = "working" | "alert" | "looking";

export default function NotFound() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [coffeeLevel, setCoffeeLevel] = useState(100);
  const [dev1Status, setDev1Status] = useState<Dev1Status>("working");
  const [isDrinking, setIsDrinking] = useState(false);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lookTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const drinkingRef = useRef<NodeJS.Timeout | null>(null);
  
  const statusRef = useRef<Dev1Status>("working");
  
  // Sync state to ref for intervals
  useEffect(() => {
    statusRef.current = dev1Status;
  }, [dev1Status]);

  const clearGameTimeouts = () => {
    if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    if (lookTimeoutRef.current) clearTimeout(lookTimeoutRef.current);
  };

  useEffect(() => {
    if (gameState !== "playing") {
      clearGameTimeouts();
      return;
    }

    const startDev1Cycle = () => {
      // Erratic work time between 0.8s and 3s
      const workTime = Math.random() * 2200 + 800;
      
      gameLoopRef.current = setTimeout(() => {
        setDev1Status("alert");
        
        // Shorter, random alert time: 300ms to 450ms (tests reaction speed)
        const alertTime = Math.random() * 150 + 300;
        
        alertTimeoutRef.current = setTimeout(() => {
          // Fake out! 20% chance Dev 1 just goes back to working without looking
          if (Math.random() < 0.20) {
            setDev1Status("working");
            startDev1Cycle();
            return;
          }

          setDev1Status("looking");
          
          // Look time between 0.6s and 1.5s
          const lookTime = Math.random() * 900 + 600;
          lookTimeoutRef.current = setTimeout(() => {
            setDev1Status("working");

            // Double take! 15% chance to suddenly look back again after a tiny delay
            if (Math.random() < 0.15) {
              gameLoopRef.current = setTimeout(() => {
                setDev1Status("alert");
                alertTimeoutRef.current = setTimeout(() => {
                  setDev1Status("looking");
                  lookTimeoutRef.current = setTimeout(() => {
                    setDev1Status("working");
                    startDev1Cycle();
                  }, 800);
                }, 250); // Very fast alert on the double-take
              }, 300);
            } else {
              startDev1Cycle();
            }
          }, lookTime);
          
        }, alertTime);
        
      }, workTime);
    };

    startDev1Cycle();

    return () => clearGameTimeouts();
  }, [gameState]);

  // Drinking loop
  useEffect(() => {
    if (isDrinking && gameState === "playing") {
      if (statusRef.current === "looking") {
        setGameState("lost");
        setIsDrinking(false);
        return;
      }

      drinkingRef.current = setInterval(() => {
        setCoffeeLevel((prev) => {
          // 1.2% per 50ms = 24% per second = ~4.1 seconds to drink entirely (up from 3.3s)
          const next = Math.max(0, prev - 1.2); 
          if (next <= 0) {
            setGameState("won");
            setIsDrinking(false);
          }
          return next;
        });

        if (statusRef.current === "looking") {
          setGameState("lost");
          setIsDrinking(false);
        }
      }, 50);
    }

    return () => {
      if (drinkingRef.current) clearInterval(drinkingRef.current);
    };
  }, [isDrinking, gameState]);

  const startGame = () => {
    clearGameTimeouts();
    if (drinkingRef.current) clearInterval(drinkingRef.current);
    
    setGameState("playing");
    setCoffeeLevel(100);
    setDev1Status("working");
    setIsDrinking(false);
  };

  const handlePointerDown = () => {
    if (gameState === "playing") setIsDrinking(true);
  };

  const handlePointerUp = () => {
    setIsDrinking(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 selection:bg-[var(--accent)] selection:text-black pt-20 relative">

      {/* 404 Header Area */}
      <div className="text-center mb-10 relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block"
        >
          <h1 className="text-8xl md:text-[10rem] font-medium leading-none tracking-tighter brand-text mb-4">
            404
          </h1>
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl font-medium text-[var(--fg-subtle)] mb-10"
        >
          Page Not Found
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/" className="card hover:bg-[var(--bg-card-hover)] transition-colors px-6 py-3 rounded-full flex items-center gap-2 group border-[var(--border)] hover:border-[var(--border-strong)]">
            <Home size={18} className="text-[var(--fg-subtle)] group-hover:text-[var(--accent)] transition-colors" />
            <span className="font-medium text-[var(--fg)] group-hover:text-white transition-colors">Go Home</span>
          </Link>
          <Link href="/blog" className="card hover:bg-[var(--bg-card-hover)] transition-colors px-6 py-3 rounded-full flex items-center gap-2 group border-[var(--border)] hover:border-[var(--border-strong)]">
            <BookOpen size={18} className="text-[var(--fg-subtle)] group-hover:text-[var(--accent)] transition-colors" />
            <span className="font-medium text-[var(--fg)] group-hover:text-white transition-colors">Read Blog</span>
          </Link>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="w-full max-w-md hairline my-8 relative z-10" />

      {/* Game Area */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="w-full max-w-2xl card p-6 md:p-8 relative z-10 overflow-hidden"
      >
        {gameState === "idle" && (
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-[var(--accent-glow)] text-[var(--accent-dim)] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_var(--accent-glow)] border border-[var(--border-accent)] transform rotate-3">
              <Coffee size={48} />
            </div>
            <h3 className="text-3xl font-medium mb-3 text-[var(--fg)]">Coffee Stealer</h3>
            <p className="text-[var(--fg-subtle)] mb-8 max-w-md mx-auto leading-relaxed">
              Dev 1 is busy coding. Steal their coffee by holding down the button! 
              But watch out—if they look back while you're drinking, you're busted.
            </p>
            <button 
              onClick={startGame}
              className="px-8 py-3.5 bg-[var(--fg)] hover:bg-white text-[#0a0a0a] rounded-full font-semibold text-lg hover:scale-105 transition-all shadow-lg"
            >
              Play Minigame
            </button>
          </div>
        )}

        {gameState !== "idle" && (
          <div className="relative">
            {/* Game Stats */}
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="text-xs text-[var(--fg-subtle)] font-mono font-medium tracking-widest uppercase">Coffee Left</div>
                <div className="w-32 md:w-48 h-4 bg-[var(--bg)] rounded-full overflow-hidden border border-[var(--border-strong)] p-0.5 shadow-inner">
                  <motion.div 
                    className="h-full bg-[var(--accent-dim)] rounded-full relative"
                    initial={{ width: "100%" }}
                    animate={{ width: `${coffeeLevel}%` }}
                    transition={{ ease: "linear", duration: 0.1 }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-1/2 rounded-t-full" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Game Scene */}
            <div className="flex items-end justify-between relative h-48 mb-8 border-b border-[var(--border-strong)] pb-4">
              
              {/* Dev 1 (Left) */}
              <div className="relative flex flex-col items-center">
                <AnimatePresence>
                  {dev1Status === "alert" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.5 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute -top-14 text-red-400 bg-red-950/40 px-3 py-1.5 rounded-full border border-red-500/30 font-bold flex items-center gap-1 shadow-[0_0_15px_rgba(239,68,68,0.2)] backdrop-blur-md z-20"
                    >
                      <AlertCircle size={18} />
                      <span className="text-lg">!</span>
                    </motion.div>
                  )}
                  {dev1Status === "working" && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute -top-12 text-[var(--fg-subtle)] text-xs bg-[var(--bg-elev)] backdrop-blur-sm px-4 py-2 rounded-2xl rounded-bl-sm border border-[var(--border-strong)] whitespace-nowrap shadow-lg z-20"
                    >
                      who bought coffee...
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Animated Avatar Dev 1 */}
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center relative z-10 transition-all duration-300 ${
                  dev1Status === "looking" 
                    ? "bg-red-950/30 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]" 
                    : "bg-[var(--bg-elev)] border-[var(--border-strong)]"
                } border`}>
                  <motion.div
                    animate={dev1Status === "working" ? { y: [0, -3, 0] } : { scale: 1.15, rotate: -5 }}
                    transition={dev1Status === "working" ? { repeat: Infinity, duration: 0.6 } : { type: "spring" }}
                  >
                    {dev1Status === "looking" ? (
                      <Bot size={44} className="text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
                    ) : (
                      <Bot size={44} className="text-[var(--fg-subtle)]" />
                    )}
                  </motion.div>
                  
                  {dev1Status === "working" && (
                    <motion.div 
                      className="absolute -right-2 -bottom-2 bg-[var(--bg-elev)] rounded-full p-1.5 border border-[var(--border-strong)]"
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    >
                      <Code size={16} className="text-[var(--accent)]" />
                    </motion.div>
                  )}
                  {dev1Status === "looking" && (
                    <motion.div 
                      className="absolute -right-2 -bottom-2 bg-red-950 rounded-full p-1.5 border border-red-500/50"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.4 }}
                    >
                      <Eye size={16} className="text-red-400" />
                    </motion.div>
                  )}
                </div>

                {/* Laptop */}
                <div className="w-28 md:w-32 h-5 bg-[var(--bg)] rounded-t-lg mt-2 relative overflow-hidden border border-[var(--border-strong)] border-b-0 shadow-lg z-20">
                  <div className="absolute inset-x-2 bottom-0 top-1 bg-[#050607] rounded-t-sm overflow-hidden">
                    <div className="absolute inset-0 bg-[var(--accent-glow)] animate-pulse-soft"></div>
                    <div className="w-3/4 h-0.5 bg-[var(--accent-dim)]/30 m-1 rounded-full" />
                    <div className="w-1/2 h-0.5 bg-[var(--accent-dim)]/30 m-1 rounded-full" />
                    <div className="w-5/6 h-0.5 bg-[var(--accent-dim)]/30 m-1 rounded-full" />
                  </div>
                </div>
                <div className="mt-3 text-[10px] font-bold text-[var(--fg-faint)] tracking-widest uppercase">Dev 1</div>
              </div>

              {/* Coffee Cup (Middle) */}
              <div className="relative bottom-5">
                <div className="w-14 h-20 md:w-16 md:h-24 bg-[var(--bg-card)] rounded-b-2xl border-x border-b border-[var(--border-strong)] relative overflow-hidden flex items-end justify-center shadow-lg backdrop-blur-md">
                  <div className="absolute inset-y-0 left-1 w-2 bg-white/5 rounded-full z-20" />
                  
                  <motion.div 
                    className="w-full bg-gradient-to-t from-[var(--accent-deep)] to-[var(--accent-dim)] absolute bottom-0 z-10"
                    animate={{ height: `${coffeeLevel}%` }}
                  />
                  
                  {coffeeLevel > 50 && (
                    <motion.div 
                      animate={{ y: [-5, -15, -5], opacity: [0.1, 0.3, 0.1] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="absolute top-2 w-4 h-8 bg-white/20 blur-md rounded-full z-20"
                    />
                  )}
                  
                  {coffeeLevel === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <span className="text-[10px] font-bold text-[var(--fg-faint)] rotate-[-45deg]">EMPTY</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dev 2 (Right - User) */}
              <div className="relative flex flex-col items-center">
                <AnimatePresence>
                  {isDrinking && gameState === "playing" && (
                    <motion.div 
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0 }}
                      className="absolute -left-[4.5rem] md:-left-[5.5rem] top-6 w-20 md:w-24 h-2 bg-gradient-to-l from-[var(--accent)] to-transparent rounded-l-full origin-right backdrop-blur-sm z-20 shadow-[0_0_10px_var(--accent-glow)]"
                    />
                  )}
                </AnimatePresence>
                
                {/* Animated Avatar Dev 2 */}
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center relative border transition-all duration-200 z-10 ${
                  isDrinking 
                    ? "bg-[var(--accent-glow)] border-[var(--accent)] shadow-[0_0_30px_var(--accent-glow)] rotate-[-5deg]" 
                    : "bg-[var(--bg-elev)] border-[var(--border-strong)]"
                }`}>
                  <motion.div
                    animate={isDrinking ? { scale: 1.15, x: -8, y: 4, rotate: -10 } : { y: [0, 3, 0] }}
                    transition={isDrinking ? { type: "spring" } : { repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  >
                    <User size={44} className={isDrinking ? "text-[var(--accent)] drop-shadow-[0_0_10px_var(--accent-glow)]" : "text-[var(--fg-subtle)]"} />
                  </motion.div>

                  {isDrinking && (
                    <motion.div 
                      className="absolute -left-2 -bottom-2 bg-[var(--bg-elev)] rounded-full p-1.5 border border-[var(--border-accent)]"
                      animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    >
                      <Zap size={16} className="text-[var(--accent-bright)]" />
                    </motion.div>
                  )}
                </div>
                
                <div className="mt-8 text-[10px] font-bold text-[var(--accent)] tracking-widest uppercase">Dev 2 (You)</div>
              </div>

            </div>

            {/* Controls / Game Over Overlays */}
            <div className="h-28 flex items-center justify-center relative mt-4">
              {gameState === "playing" && (
                <button
                  onPointerDown={handlePointerDown}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`w-full max-w-sm py-4 md:py-5 rounded-full font-medium text-lg uppercase tracking-wider select-none transition-all duration-150 relative overflow-hidden ${
                    isDrinking 
                      ? "bg-[var(--accent)] text-[#0a0a0a] scale-95 shadow-inner" 
                      : "bg-transparent border border-[var(--border-strong)] text-[var(--fg)] hover:bg-[var(--bg-card-hover)] shadow-lg"
                  }`}
                >
                  {isDrinking && (
                    <motion.div 
                      className="absolute inset-0 bg-white/20"
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isDrinking ? "Drinking..." : "Hold to Drink"}
                  </span>
                </button>
              )}

              {gameState === "lost" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-elev)] rounded-2xl backdrop-blur-md border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.1)] z-30"
                >
                  <h3 className="text-2xl md:text-3xl font-medium text-red-400 mb-2">Caught you!</h3>
                  <p className="text-[var(--fg-subtle)] mb-5 text-sm">Dev 1 caught you stealing coffee.</p>
                  <button onClick={startGame} className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-full transition-all hover:scale-105 text-sm font-medium">
                    <RotateCcw size={16} />
                    <span>Try Again</span>
                  </button>
                </motion.div>
              )}

              {gameState === "won" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-elev)] rounded-2xl backdrop-blur-md border border-[var(--border-accent)] shadow-[0_0_30px_var(--accent-glow)] z-30"
                >
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 mb-2"
                  >
                    <CupSoda className="text-[var(--accent)]" size={32} />
                    <h3 className="text-2xl md:text-3xl font-medium brand-text">You won!</h3>
                  </motion.div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-[var(--fg-subtle)] mb-5 text-sm"
                  >
                    You drank all the coffee without getting caught.
                  </motion.p>
                  <motion.button 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onClick={startGame} 
                    className="flex items-center gap-2 px-6 py-2.5 bg-[var(--accent-glow)] hover:bg-[var(--accent)]/30 text-[var(--accent-bright)] border border-[var(--border-accent)] rounded-full transition-all hover:scale-105 text-sm font-medium"
                  >
                    <RotateCcw size={16} />
                    <span>Play Again</span>
                  </motion.button>
                </motion.div>
              )}
            </div>

          </div>
        )}
      </motion.div>

    </div>
  );
}
