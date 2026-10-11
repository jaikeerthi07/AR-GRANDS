import { useState, useEffect, useRef } from "react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import aboutExterior from "@/assets/about-exterior.jpg";

export default function Preloader() {
    const [progress, setProgress] = useState(0);
    const [isHiding, setIsHiding] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [statusText, setStatusText] = useState("Preparing experience...");
    const targetProgressRef = useRef(0);
    const allReadyRef = useRef(false);

    useEffect(() => {
        // Prevent preloader from running repeatedly in the same session
        const alreadyLoaded = sessionStorage.getItem("ar_grand_site_loaded");
        if (alreadyLoaded) {
            setIsHidden(true);
            document.body.classList.add("site-ready");
            window.dispatchEvent(new Event("preloaderFinished"));
            return;
        }

        sessionStorage.setItem("ar_grand_site_loaded", "true");

        // --- ASSET PRELOAD TRACKER ---
        const criticalImages = [hero1, hero2, aboutExterior];
        let loadedCount = 0;
        const totalItems = criticalImages.length + 2; // +1 for fonts, +1 for DOM/window load

        const checkItemLoaded = (itemLabel: string) => {
            loadedCount += 1;
            const calculatedPercent = Math.min(Math.round((loadedCount / totalItems) * 95), 95);
            targetProgressRef.current = Math.max(targetProgressRef.current, calculatedPercent);

            if (itemLabel === "fonts") setStatusText("Loading typography...");
            else if (itemLabel === "dom") setStatusText("Loading page structure...");
            else setStatusText("Preparing venue imagery...");

            if (loadedCount >= totalItems) {
                allReadyRef.current = true;
                targetProgressRef.current = 100;
                setStatusText("Welcome to A.R. Grand");
            }
        };

        // 1. Font Readiness
        if (document.fonts) {
            document.fonts.ready.then(() => checkItemLoaded("fonts")).catch(() => checkItemLoaded("fonts"));
        } else {
            checkItemLoaded("fonts");
        }

        // 2. DOM / Document Readiness
        if (document.readyState === "complete") {
            checkItemLoaded("dom");
        } else {
            const onWindowLoad = () => checkItemLoaded("dom");
            window.addEventListener("load", onWindowLoad, { once: true });
        }

        // 3. Preload & Decode Critical Images
        criticalImages.forEach((src, idx) => {
            const img = new Image();
            img.onload = () => checkItemLoaded(`img-${idx}`);
            img.onerror = () => checkItemLoaded(`img-${idx}`);
            img.src = src;
        });

        // --- SMOOTH PROGRESS INTERPOLATOR ---
        // Minimum aesthetic ramp ensures smooth 0-100% animation without jumping jarringly
        let currentDisplayProgress = 0;
        let animFrameId: number;
        const startTime = performance.now();
        const minDuration = 2200; // ms minimum duration to appreciate animation

        const renderLoop = (time: number) => {
            const elapsed = time - startTime;
            const timePacing = Math.min((elapsed / minDuration) * 95, 95);

            // Allowed progress is constrained by actual assets loaded
            // It can only reach 100% if all assets have truly completed
            let target = allReadyRef.current && elapsed >= minDuration
                ? 100
                : Math.min(targetProgressRef.current, timePacing);

            if (currentDisplayProgress < target) {
                // Smooth step
                currentDisplayProgress += Math.max(1, Math.ceil((target - currentDisplayProgress) * 0.15));
                if (currentDisplayProgress > target) currentDisplayProgress = target;
                setProgress(currentDisplayProgress);
            }

            if (allReadyRef.current && currentDisplayProgress >= 100) {
                setProgress(100);
                setTimeout(() => {
                    setIsHiding(true);
                    document.body.classList.add("site-ready");
                    setTimeout(() => {
                        setIsHidden(true);
                        window.dispatchEvent(new Event("preloaderFinished"));
                    }, 650);
                }, 250);
            } else {
                animFrameId = requestAnimationFrame(renderLoop);
            }
        };

        animFrameId = requestAnimationFrame(renderLoop);

        return () => {
            if (animFrameId) cancelAnimationFrame(animFrameId);
        };
    }, []);

    if (isHidden) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-all duration-[650ms] ease-out pointer-events-none overflow-hidden ${isHiding ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
                }`}
            style={{ backdropFilter: isHiding ? "none" : "blur(8px)" }}
        >
            <div className="relative flex flex-col items-center justify-center max-w-sm w-full px-6 text-center select-none">

                {/* Small Transparent Couple Animation */}
                <div className="relative mb-5 flex items-center justify-center">
                    {/* Subtle warm luxury glow behind transparent couple */}
                    <div className="absolute w-32 h-32 rounded-full bg-[hsl(var(--gold)/0.12)] blur-2xl pointer-events-none animate-pulse" />

                    <img
                        src="/couple-loader.webp"
                        alt="A.R. Grand Animation"
                        className="relative z-10 w-28 md:w-36 h-auto object-contain pointer-events-none select-none"
                    />
                </div>

                {/* Brand Title */}
                <h1 className="font-heading text-lg md:text-xl font-bold tracking-[0.25em] text-neutral-800 uppercase mb-1">
                    A.R. GRAND
                </h1>
                <p className="font-heading italic text-xs md:text-sm text-gold-deep mb-5 tracking-wide">
                    Where Forever Begins
                </p>

                {/* 0 to 100% Counter & Progress Bar */}
                <div className="w-full flex flex-col items-center gap-2.5">
                    {/* Numerical Percentage */}
                    <div className="flex items-baseline justify-center font-heading font-bold text-2xl md:text-3xl text-neutral-800 tracking-wider">
                        <span>{progress}</span>
                        <span className="text-sm md:text-base text-gold ml-1 font-semibold">%</span>
                    </div>

                    {/* Sleek Golden Progress Track */}
                    <div className="w-44 md:w-56 h-1.5 bg-neutral-100 border border-neutral-200/60 rounded-full overflow-hidden shadow-inner relative">
                        <div
                            className="h-full bg-gradient-to-r from-amber-200 via-gold to-amber-500 rounded-full transition-all duration-75 ease-out shadow-[0_0_10px_rgba(212,175,55,0.7)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Dynamic Status / Readiness Indicator */}
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium mt-1 transition-all duration-300">
                        {statusText}
                    </p>
                </div>

            </div>
        </div>
    );
}
