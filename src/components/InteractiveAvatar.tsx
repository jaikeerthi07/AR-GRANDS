import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function InteractiveAvatar() {
    const [stage, setStage] = useState<"hidden" | "entering" | "waiting" | "replied" | "rejected">("hidden");
    const [tourStep, setTourStep] = useState(0);
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let animationFrameId: number;
        const processFrame = () => {
            if (canvasRef.current && videoRef.current) {
                const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
                const video = videoRef.current;

                if (ctx && video.readyState >= 2) {
                    // PERFORMANCE OPTIMIZATION: Max 480px height provides a sweet-spot for perfect visual clarity 
                    // without causing the massive JS CPU lag of 600px+ configurations.
                    // This strikes the perfect balance between buttery smooth fps and non-blurry visuals!
                    const computeHeight = Math.min(video.videoHeight, 480);
                    const computeWidth = computeHeight * (video.videoWidth / video.videoHeight);

                    if (canvasRef.current.width !== computeWidth) {
                        canvasRef.current.width = computeWidth;
                        canvasRef.current.height = computeHeight;
                    }

                    // Hardware accelerated downscale of video directly onto the low-res canvas
                    ctx.drawImage(video, 0, 0, computeWidth, computeHeight);
                    const frame = ctx.getImageData(0, 0, computeWidth, computeHeight);
                    const data = frame.data;
                    const length = data.length;

                    // Extremely fast inline variables for maximum JIT engine speed
                    let r, g, b, max, min;

                    for (let i = 0; i < length; i += 4) {
                        r = data[i];
                        g = data[i + 1];
                        b = data[i + 2];

                        max = r > g ? (r > b ? r : b) : (g > b ? g : b);
                        min = r < g ? (r < b ? r : b) : (g < b ? g : b);

                        if (max - min < 18) {
                            if (r > 240) {
                                // Pure white background
                                data[i + 3] = 0;
                            } else if (r > 40) {
                                // Fast integer math alpha conversion for grey anti-aliasing edges
                                data[i] = 0;
                                data[i + 1] = 0;
                                data[i + 2] = 0;
                                data[i + 3] = Math.max(0, 255 - ((r - 40) * 1.275)) | 0;
                            }
                        }
                    }
                    ctx.putImageData(frame, 0, 0);
                }
            }
            animationFrameId = requestAnimationFrame(processFrame);
        };
        processFrame();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    useEffect(() => {
        // Start animation shortly after component mounts
        const timer = setTimeout(() => {
            setStage("entering");
            if (videoRef.current) videoRef.current.playbackRate = 1.0;
            setTimeout(() => setStage("waiting"), 4000); // 4-second walk-in
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const tourSteps = [
        {
            title: "Experience our stunning venue layout! 🖼️",
            button: "Visit Gallery",
            action: () => navigate('/gallery')
        },
        {
            title: "Discover our premium amenities! 🏨",
            button: "Visit Facilities",
            action: () => navigate('/facilities')
        },
        {
            title: "Host your dream events with us! 🎉",
            button: "Visit Events",
            action: () => navigate('/events')
        },
        {
            title: "Need directions to A.R Grand? 📍",
            button: "Open Google Maps",
            action: () => {
                setStage("replied");
                setTimeout(() => {
                    window.location.href = "https://www.google.com/maps/search/?api=1&query=AR+GRANDS,+Chennai";
                }, 3000);
            }
        }
    ];

    const handleNext = () => {
        if (tourStep < tourSteps.length - 1) {
            setTourStep(prev => prev + 1);
        } else {
            handleReject();
        }
    };

    const handleReject = () => {
        setStage("rejected");
        if (videoRef.current) {
            // Keep the 3D video playing dynamically (smooth 60fps) to prevent it from looking like a flat 2D frozen image!
            videoRef.current.playbackRate = 0.85;
        }
    };

    if (stage === "hidden") return null;

    // Outer container controls sliding position
    let transformString = "translateX(-150vw)";
    let duration = "0ms";

    // Inner avatar controls 3D body rotation and posture
    let avatarTransform = "perspective(1200px) rotateY(0deg) translateY(0px) scaleX(1)";
    let avatarFlipDuration = "0ms";
    let avatarFilter = "brightness(1.3) contrast(1.15)";

    if (stage === "entering" || stage === "waiting") {
        transformString = "translateX(clamp(1rem, 15vw, 20vw))";
        duration = "4000ms";
        avatarFlipDuration = "1000ms";
    } else if (stage === "replied") {
        transformString = "translateX(100vw)";
        duration = "3000ms";
        avatarFlipDuration = "1000ms";
    } else if (stage === "rejected") {
        // Keeps going entirely off the left side of the screen
        transformString = "translateX(-150vw)";
        duration = "7000ms";

        // Rapid 3D turn physically flipping his body to face left, plus deep slouch
        avatarTransform = "perspective(1200px) rotateY(-180deg) translateY(12px) skewX(-2deg)";
        avatarFlipDuration = "800ms"; // Fast 3D spin turnaround
        avatarFilter = "brightness(0.3) sepia(0.6) hue-rotate(190deg) saturate(1.2)"; // Deep melancholic blue/grey
    }

    return (
        <div
            className="fixed bottom-0 left-0 flex items-end gap-4 ease-in-out"
            style={{
                zIndex: 100,
                transform: transformString,
                transition: `transform ${duration} ease-in-out`
            }}
        >
            <div className="relative">
                {/* The character avatar - NATIVE CANVAS ANIMATION (Flawless anti-aliased edge removal) */}
                <div
                    className="w-40 h-56 md:w-56 md:h-72 flex flex-col items-center justify-center hover:scale-105 pointer-events-none overflow-visible relative"
                    style={{
                        transform: avatarTransform,
                        filter: avatarFilter,
                        transition: `transform ${avatarFlipDuration} cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 2000ms ease-in-out`
                    }}
                >
                    {stage === 'rejected' && (
                        <div className="absolute -top-12 left-1/2 -translate-x-[40%] md:-translate-x-[30%] flex flex-col items-center z-10 transition-opacity">
                            <span className="text-6xl drop-shadow-md mb-2">🌧️</span>
                            <span className="text-3xl absolute top-12 left-10 animate-[bounce_1.5s_infinite]">💧</span>
                        </div>
                    )}
                    <canvas
                        ref={canvasRef}
                        className="w-[180%] h-[180%] max-w-none object-cover object-[center_30%]"
                    />
                    <video
                        ref={videoRef}
                        src="/boy animation2.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="opacity-0 w-0 h-0 absolute pointer-events-none"
                    />
                </div>

                {/* Speech Bubble */}
                <div
                    className={`absolute bottom-[85%] left-[-10%] md:bottom-[60%] md:left-[75%] w-[16rem] md:w-[22rem] bg-card p-4 md:p-5 rounded-2xl rounded-bl-sm shadow-[var(--shadow-elegant)] border border-border transition-all duration-700 origin-bottom-left flex flex-col gap-3 md:gap-4 ${(stage === "waiting" || stage === "replied") ? "scale-100 opacity-100" : "scale-0 opacity-0"
                        }`}
                >
                    {stage !== "replied" ? (
                        <>
                            <p className="text-foreground text-sm font-medium leading-relaxed min-h-[3rem]">
                                Welcome to <span className="gold-text italic">A.R Grand</span>! 🎊 {tourSteps[tourStep].title}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={tourSteps[tourStep].action}
                                    className="flex-1 bg-[hsl(var(--gold))] text-noir text-xs font-bold py-2 px-1 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-[var(--shadow-gold)] animate-[pulse_2s_ease-in-out_infinite]"
                                >
                                    {tourSteps[tourStep].button}
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="flex-[0.7] bg-transparent border border-border text-foreground hover:bg-muted text-[11px] md:text-xs font-semibold py-2 px-1 rounded-lg active:scale-95 transition-all"
                                >
                                    {tourStep < tourSteps.length - 1 ? "Next ➡️" : "No, thanks"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-2 text-center">
                            <span className="text-2xl mb-2">📍</span>
                            <p className="text-foreground text-sm font-medium">
                                Opening Google Maps for you...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
