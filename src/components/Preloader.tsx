import { useState, useEffect, useRef } from "react";

export default function Preloader() {
    const [loadingState, setLoadingState] = useState<"brand" | "couple" | "hiding" | "hidden">("brand");
    const [isFirstVisit, setIsFirstVisit] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Prevent preloader from running on every single page load after the first
        const alreadyLoaded = sessionStorage.getItem("ar_grand_site_loaded");
        if (alreadyLoaded) {
            setLoadingState("hidden");
            return;
        }

        setIsFirstVisit(true);
        sessionStorage.setItem("ar_grand_site_loaded", "true");

        // Step 1: AR Grand Logo Animation
        const coupleTimer = setTimeout(() => {
            setLoadingState("couple");
            if (videoRef.current) {
                videoRef.current.play().catch(e => console.log("Video auto-play blocked", e));
            }
        }, 1800);

        // Step 2: The Hand Holding Video Animation plays for an extended time (5 seconds)
        const hidingTimer = setTimeout(() => {
            setLoadingState("hiding");
        }, 7000);

        // Step 3: Dissolve the white screen entirely
        const hiddenTimer = setTimeout(() => {
            setLoadingState("hidden");
            window.dispatchEvent(new Event("preloaderFinished"));
        }, 8000);

        return () => {
            clearTimeout(coupleTimer);
            clearTimeout(hidingTimer);
            clearTimeout(hiddenTimer);
        };
    }, []);

    if (loadingState === "hidden") return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-[1000ms] pointer-events-none overflow-hidden ${loadingState === 'hiding' ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className="relative flex flex-col items-center justify-center h-full w-full">

                {/* AR Grand Logo Scene */}
                <div
                    className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-[1200ms] ease-[cubic-bezier(0.25, 0.46, 0.45, 0.94)] transform ${loadingState === 'brand' ? 'opacity-100 scale-100 blur-none' :
                        'opacity-0 scale-125 blur-sm'
                        }`}
                >
                    <img
                        src="/ar grand.png"
                        alt="AR Grand Logo"
                        className="absolute inset-0 w-full h-full object-cover mix-blend-multiply scale-105 z-[-1]"
                    />
                    <p className="mt-4 font-heading text-xl md:text-2xl text-noir tracking-[0.2em] opacity-0 animate-[fade-in_2s_ease-out_1s_forwards] font-light">
                        WHERE FOREVER BEGINS
                    </p>
                </div>

                {/* Romantic Hand-Holding Video Animation Scene */}
                <div
                    className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-[2000ms] ease-out transform ${loadingState === 'couple' ? 'opacity-100 scale-100 blur-none' :
                        loadingState === 'brand' ? 'opacity-0 scale-90 blur-xl' :
                            'opacity-0 scale-110 blur-sm'
                        }`}
                >
                    {/* The mix-blend-multiply removes the solid white background of the video, creating the illusion of a pure animation rather than an MP4 player! */}
                    <div className="relative flex flex-col items-center justify-center w-full h-full">
                        <video
                            ref={videoRef}
                            src="/boy girl animation.mp4"
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply z-[-1]"
                        />
                        <p className="font-heading italic text-3xl md:text-4xl text-gold-deep blur-[0.5px] mt-4 opacity-0 animate-[fade-in_2s_ease-out_forwards] z-10">Together Forever</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
