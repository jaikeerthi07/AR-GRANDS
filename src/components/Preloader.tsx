import { useState, useEffect, useRef } from "react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import aboutExterior from "@/assets/about-exterior.jpg";

export default function Preloader() {
    const isQRRoute = typeof window !== "undefined" && window.location.pathname.startsWith("/qr");
    const [progress, setProgress] = useState(0);
    const [isHiding, setIsHiding] = useState(false);
    const [isHidden, setIsHidden] = useState(() => isQRRoute || (typeof window !== "undefined" && !!sessionStorage.getItem("ar_grand_site_loaded")));
    const [statusText, setStatusText] = useState("Preparing experience...");
    const targetProgressRef = useRef(0);
    const allReadyRef = useRef(false);

    useEffect(() => {
        // Bypass if accessing /qr-scan or /qr route
        if (window.location.pathname.startsWith("/qr")) {
            setIsHidden(true);
            document.body.classList.add("site-ready");
            window.dispatchEvent(new Event("preloaderFinished"));
            return;
        }

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
            const target = allReadyRef.current && elapsed >= minDuration
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
            <div className="relative flex flex-col items-center justify-center w-full max-w-md px-6 text-center select-none">

                {/* Staged Wedding Couple Vector Animation */}
                <div className="relative flex items-center justify-center w-full max-w-[280px] md:max-w-[340px] aspect-[4/5]">
                    {/* Subtle warm luxury ambient backdrop glow */}
                    <div className="absolute w-48 h-48 rounded-full bg-[hsl(var(--gold)/0.12)] blur-3xl pointer-events-none animate-pulse" />

                    {/* Animated Wedding Couple SVG */}
                    <img
                        src="/wedding-couple.svg"
                        alt="AR Grands Wedding Couple"
                        className="relative z-10 w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.06)]"
                    />
                </div>

                {/* Minimalist Elegant Loading Progress Line (No text or prompt clutter) */}
                <div className="w-32 md:w-44 h-[2px] bg-neutral-100 rounded-full overflow-hidden mt-4 opacity-80">
                    <div
                        className="h-full bg-gradient-to-r from-amber-200 via-gold to-amber-500 rounded-full transition-all duration-100 ease-out shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>

            </div>
        </div>
    );
}

