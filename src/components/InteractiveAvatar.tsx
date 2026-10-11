import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Volume2, VolumeX, X } from "lucide-react";

interface RouteAvatarConfig {
    videoSrc: string;
    audioSrc: string;
    text: string;
}

const routeAvatarConfigs: Record<string, RouteAvatarConfig> = {
    "/": {
        videoSrc: "/avatar-home.mp4", // Front-facing talking and welcoming gesture
        audioSrc: "/audio/home.mp3",
        text: "Welcome to A.R. Grand! ✨ Explore our luxury wedding halls."
    },
    "/gallery": {
        videoSrc: "/avatar-gallery.mp4", // Walking stroll motion (left to right)
        audioSrc: "/audio/gallery.mp3",
        text: "Browse photos of our grand stage, halls & decor 📸"
    },
    "/facilities": {
        videoSrc: "/avatar-dance.mp4", // Energetic celebration dance & crouch jump
        audioSrc: "/audio/facilities.mp3",
        text: "Discover our AC halls, guest suites, lifts & parking 🏨"
    },
    "/events": {
        videoSrc: "/avatar-events.mp4", // Forward turn & cheerful entrance greeting
        audioSrc: "/audio/events.mp3",
        text: "Check available dates & schedule your celebration 📅"
    },
    "/contact": {
        videoSrc: "/avatar-contact.mp4", // Walking stroll in reverse direction (right to left)
        audioSrc: "/audio/contact.mp3",
        text: "Get in touch with us to plan your special day 📞"
    },
    "/enquiry": {
        videoSrc: "/avatar-home.mp4",
        audioSrc: "/audio/enquiry.mp3",
        text: "Ready to book? Share your event details with us 💌"
    },
    "/admin": {
        videoSrc: "/avatar-home.mp4",
        audioSrc: "/audio/admin.mp3",
        text: "Admin portal — manage bookings & venue operations 🔐"
    },
    "/locations/perambur": {
        videoSrc: "/avatar-home.mp4",
        audioSrc: "/audio/perambur.mp3",
        text: "A.R. Grand Perambur — accessible city center 📍"
    },
    "/locations/vyasarpadi": {
        videoSrc: "/avatar-home.mp4",
        audioSrc: "/audio/vyasarpadi.mp3",
        text: "A.R. Grand Vyasarpadi — convenient & elegant 📍"
    },
    "/locations/madhavaram": {
        videoSrc: "/avatar-home.mp4",
        audioSrc: "/audio/madhavaram.mp3",
        text: "A.R. Grand Madhavaram — central connectivity 📍"
    }
};

export default function InteractiveAvatar() {
    const [stage, setStage] = useState<"hidden" | "entering" | "waiting" | "speaking" | "rejected">("hidden");
    const [isMuted, setIsMuted] = useState(false);
    const [currentText, setCurrentText] = useState("");
    const [customTourLink, setCustomTourLink] = useState<{ label: string, action: () => void } | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Current page configuration
    const activeConfig = routeAvatarConfigs[location.pathname] || routeAvatarConfigs["/"];

    // Canvas Chroma Key Logic - 100% Pure Transparency & Zero Borders
    useEffect(() => {
        let animationFrameId: number;
        const processFrame = () => {
            if (canvasRef.current && videoRef.current) {
                const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
                const video = videoRef.current;

                if (ctx && video.readyState >= 2) {
                    const computeHeight = Math.min(video.videoHeight || 480, 480);
                    const computeWidth = computeHeight * ((video.videoWidth || 640) / (video.videoHeight || 480));

                    if (canvasRef.current.width !== computeWidth) {
                        canvasRef.current.width = computeWidth;
                        canvasRef.current.height = computeHeight;
                    }

                    ctx.drawImage(video, 0, 0, computeWidth, computeHeight);
                    const frame = ctx.getImageData(0, 0, computeWidth, computeHeight);
                    const data = frame.data;
                    const length = data.length;

                    let r, g, b, max, min, diff;

                    for (let i = 0; i < length; i += 4) {
                        r = data[i];
                        g = data[i + 1];
                        b = data[i + 2];

                        max = r > g ? (r > b ? r : b) : (g > b ? g : b);
                        min = r < g ? (r < b ? r : b) : (g < b ? g : b);
                        diff = max - min;

                        // 1. Studio light-grey background
                        const isStudioGrey = diff < 18 && min > 165;
                        // 2. Studio floor shadow
                        const isFloorShadow = diff < 14 && min > 110 && b > 105 && r < 175;
                        // 3. Studio light-blue background (avatar-dance.mp4)
                        const isStudioBlue = b > 170 && g > 150 && r > 130 && diff < 55;
                        // 4. Light-blue floor shadow
                        const isBlueFloorShadow = b > 110 && g > 110 && diff < 20 && min > 90 && max < 160;

                        if (isStudioGrey || isFloorShadow || isStudioBlue || isBlueFloorShadow) {
                            data[i + 3] = 0; // Pure 100% transparency
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

    // Video Source Synchronization per Page (Each page has its own standalone .mp4)
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Skip if on suppressed pages
        if (location.pathname === "/qr-scan" || location.pathname === "/qr" || location.pathname === "/terms") {
            return;
        }

        const config = routeAvatarConfigs[location.pathname] || routeAvatarConfigs["/"];

        // Switch to the dedicated standalone video for the current route
        if (!video.src.endsWith(config.videoSrc)) {
            video.src = config.videoSrc;
            video.load();
            video.play().catch(() => { });
        }
    }, [location.pathname]);

    // Route Awareness and Kid Voice Audio Playback
    useEffect(() => {
        // Completely hide and silence avatar on /qr-scan and /terms (explicitly requested by user)
        if (location.pathname === "/qr-scan" || location.pathname === "/qr" || location.pathname === "/terms") {
            if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
            setStage("hidden");
            return;
        }

        const config = routeAvatarConfigs[location.pathname] || routeAvatarConfigs["/"];
        setCurrentText(config.text);
        setCustomTourLink(null);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        // ONLY wait for preloaderFinished if currently on the Home page ("/") and it hasn't finished yet
        const isFirstLoadOnHome = location.pathname === "/" && !sessionStorage.getItem('avatarVoiceInitialized');
        let enterTimer: ReturnType<typeof setTimeout>;

        const executeAvatarSpeech = () => {
            sessionStorage.setItem('avatarVoiceInitialized', 'true');

            if (!isMuted) {
                const audio = new Audio(config.audioSrc);
                audioRef.current = audio;

                audio.onended = () => setStage("waiting");
                audio.onerror = () => setStage("waiting");

                audio.play().then(() => {
                    setStage("speaking");
                }).catch(() => {
                    // Browser policy blocked unmuted autoplay
                    setStage("waiting");
                });
            } else {
                setStage("waiting");
            }
        };

        const handlePreloaderComplete = () => {
            setStage("entering");
            enterTimer = setTimeout(executeAvatarSpeech, 800);
        };

        if (isFirstLoadOnHome) {
            setStage("hidden");
            window.addEventListener('preloaderFinished', handlePreloaderComplete);
        } else {
            setStage("entering");
            enterTimer = setTimeout(executeAvatarSpeech, 300);
        }

        return () => {
            if (isFirstLoadOnHome) {
                window.removeEventListener('preloaderFinished', handlePreloaderComplete);
            }
            clearTimeout(enterTimer);
            if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
        };
    }, [location.pathname]);

    // Scroll-based prompt updates for homepage
    useEffect(() => {
        if (location.pathname !== "/") return;

        const homeScrollSections = [
            {
                maxScroll: 450,
                text: "Welcome to A.R. Grand! ✨ Explore our luxury wedding halls.",
                tourLink: { label: "Explore Gallery 🖼️", action: () => navigate('/gallery') }
            },
            {
                maxScroll: 1100,
                text: "10+ years of timeless elegance & 500+ memorable celebrations 🏛️",
                tourLink: { label: "View Facilities 🏨", action: () => navigate('/facilities') }
            },
            {
                maxScroll: 1850,
                text: "AC halls, premium catering & seating up to 250 guests ✨",
                tourLink: { label: "Check Events 📅", action: () => navigate('/events') }
            },
            {
                maxScroll: 2550,
                text: "Take a cinematic 360° virtual tour inside A.R Grand 🎥",
                tourLink: { label: "Book Your Venue 💍", action: () => navigate('/enquiry') }
            },
            {
                maxScroll: Infinity,
                text: "Loved by couples across Chennai. Ready to plan your big day? 💖",
                tourLink: { label: "Enquire Now 💌", action: () => navigate('/enquiry') }
            }
        ];

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const matched = homeScrollSections.find(s => scrollY < s.maxScroll) || homeScrollSections[0];
            setCurrentText(matched.text);
            setCustomTourLink(matched.tourLink);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname, navigate]);

    const handleDismiss = () => {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
        setStage("rejected");
    };

    const toggleMute = () => {
        if (!isMuted) {
            if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
            setStage("waiting");
        } else {
            const config = routeAvatarConfigs[location.pathname] || routeAvatarConfigs["/"];
            const audio = new Audio(config.audioSrc);
            audioRef.current = audio;
            audio.onended = () => setStage("waiting");
            audio.onerror = () => setStage("waiting");
            audio.play().then(() => setStage("speaking")).catch(() => setStage("waiting"));
        }
        setIsMuted(!isMuted);
    };

    // Notice: /events deliberately has NO Google Maps button (removed per user request)
    const defaultTourLinks: Record<string, { label: string, action: () => void }> = {
        "/": { label: "Explore Gallery 🖼️", action: () => navigate('/gallery') },
        "/gallery": { label: "View Facilities 🏨", action: () => navigate('/facilities') },
        "/facilities": { label: "Discover Events 🎉", action: () => navigate('/events') },
        "/contact": { label: "Book Your Venue 💍", action: () => navigate('/enquiry') }
    };

    const activeTourLink = customTourLink || defaultTourLinks[location.pathname];

    // Completely suppress avatar on hidden routes or /terms
    if (stage === "hidden" || location.pathname === "/qr-scan" || location.pathname === "/qr" || location.pathname === "/terms") return null;

    let transformString = "translateX(-150vw)";
    let duration = "0ms";
    let avatarTransform = "perspective(1200px) rotateY(0deg) translateY(0px) scaleX(1)";
    let avatarFlipDuration = "0ms";

    if (stage === "entering" || stage === "speaking" || stage === "waiting") {
        transformString = "translateX(clamp(1rem, 15vw, 20vw))";
        duration = "2000ms";
        avatarFlipDuration = "1000ms";
    } else if (stage === "rejected") {
        transformString = "translateX(-150vw)";
        duration = "5000ms";
        avatarTransform = "perspective(1200px) rotateY(-180deg) translateY(12px) skewX(-2deg)";
        avatarFlipDuration = "800ms";
    }

    return (
        <div
            className="fixed bottom-0 left-0 flex items-end gap-4 ease-in-out pointer-events-none"
            style={{
                zIndex: 100,
                transform: transformString,
                transition: `transform ${duration} cubic-bezier(0.25, 0.46, 0.45, 0.94)`
            }}
        >
            <div className="relative pointer-events-auto">
                {/* Character Container: Zero Glow, Zero Border, Pure Natural Display */}
                <div
                    className="w-40 h-56 md:w-56 md:h-72 flex flex-col items-center justify-center cursor-pointer group pointer-events-auto overflow-visible relative"
                    onClick={toggleMute}
                    style={{
                        transform: avatarTransform,
                        transition: `transform ${avatarFlipDuration} cubic-bezier(0.25, 0.46, 0.45, 0.94)`
                    }}
                >
                    <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        {isMuted ? <VolumeX className="text-white drop-shadow-md" size={24} /> : <Volume2 className="text-white drop-shadow-md" size={24} />}
                    </div>

                    {stage === 'rejected' && (
                        <div className="absolute -top-12 left-1/2 -translate-x-[40%] md:-translate-x-[30%] flex flex-col items-center z-10 transition-opacity">
                            <span className="text-6xl drop-shadow-md mb-2">🌧️</span>
                            <span className="text-3xl absolute top-12 left-10 animate-[bounce_1.5s_infinite]">💧</span>
                        </div>
                    )}

                    {/* Canvas with 100% Pure Transparent Pixel Shader - NO BOX, NO BORDER, NO GLOW */}
                    <canvas
                        ref={canvasRef}
                        className="w-[180%] h-[180%] max-w-none object-cover object-[center_30%] relative z-10 bg-transparent border-0 outline-none shadow-none"
                    />

                    {/* Video Element for Motion Playback */}
                    <video
                        ref={videoRef}
                        src={activeConfig.videoSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="opacity-0 w-0 h-0 absolute pointer-events-none"
                    />
                </div>

                {/* Compact, Sleek Speech Bubble */}
                <div
                    className={`absolute bottom-[85%] left-[20%] md:bottom-[60%] md:left-[75%] w-[14.5rem] md:w-[17.5rem] bg-card/95 backdrop-blur-md p-3 md:p-3.5 rounded-2xl rounded-bl-sm shadow-[var(--shadow-elegant)] border border-[hsl(var(--gold)/0.3)] transition-all duration-500 origin-bottom-left flex flex-col gap-2.5 ${(stage === "speaking" || stage === "waiting") ? "scale-100 opacity-100" : "scale-0 opacity-0"
                        }`}
                >
                    {/* Header with prompt text & clean control buttons */}
                    <div className="flex justify-between items-start gap-2">
                        <p className="text-foreground text-xs md:text-[13px] font-medium leading-snug transition-all duration-300">
                            {currentText}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                onClick={toggleMute}
                                className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"
                                title={isMuted ? "Unmute voice" : "Mute voice"}
                                aria-label={isMuted ? "Unmute voice" : "Mute voice"}
                            >
                                {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"
                                title="Close"
                                aria-label="Dismiss concierge"
                            >
                                <X size={13} />
                            </button>
                        </div>
                    </div>

                    {/* Action Link Button (Only if defined for current page/scroll) */}
                    {activeTourLink && (
                        <button
                            onClick={activeTourLink.action}
                            className="w-full bg-[hsl(var(--gold))] text-noir text-[11px] font-bold py-2 px-3 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-[var(--shadow-gold)] animate-[pulse_2.5s_ease-in-out_infinite]"
                        >
                            {activeTourLink.label}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
