import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Volume2, VolumeX, X, Sparkles } from "lucide-react";

interface RouteAvatarConfig {
    videoSrc: string;
    audioSrc?: string;
    text: string;
    preferSpeechSynthesis?: boolean;
}

type AvatarConfig = RouteAvatarConfig & {
    tourLink?: { label: string; action: () => void };
};

// 14+ Distinct Video Motion Files to break similarity across every tab and scroll state
const routeAvatarConfigs: Record<string, RouteAvatarConfig> = {
    "/": { videoSrc: "/avatar-welcome.mp4", audioSrc: "/audio/home.mp3", text: "Welcome to A.R. Grand. Explore our luxury wedding halls.", preferSpeechSynthesis: true },
    "/gallery": { videoSrc: "/avatar-gallery.mp4", audioSrc: "/audio/gallery.mp3", text: "Browse photos of our grand stage, halls, and decor." },
    "/facilities": { videoSrc: "/avatar-dance-jump.mp4", audioSrc: "/audio/facilities.mp3", text: "Discover our air-conditioned halls, guest suites, lifts, and parking." },
    "/events": { videoSrc: "/avatar-events.mp4", audioSrc: "/audio/events.mp3", text: "Check available dates and plan your celebration." },
    "/contact": { videoSrc: "/avatar-contact.mp4", audioSrc: "/audio/contact.mp3", text: "Get in touch with us to plan your special day." },
    "/enquiry": { videoSrc: "/avatar-approach.mp4", audioSrc: "/audio/enquiry.mp3", text: "Ready to book? Share your event details with us." },
    "/admin": { videoSrc: "/avatar-calm-nod.mp4", audioSrc: "/audio/admin.mp3", text: "Admin portal for managing bookings and venue operations." },
    "/locations/perambur": { videoSrc: "/avatar-welcome.mp4", audioSrc: "/audio/perambur.mp3", text: "A.R. Grand Perambur is in an accessible city-centre location." },
    "/locations/vyasarpadi": { videoSrc: "/avatar-walk-and-turn.mp4", audioSrc: "/audio/vyasarpadi.mp3", text: "A.R. Grand Vyasarpadi is convenient and elegant." },
    "/locations/madhavaram": { videoSrc: "/avatar-dance-groove.mp4", audioSrc: "/audio/madhavaram.mp3", text: "A.R. Grand Madhavaram offers excellent local connectivity." }
};

// Uses the closest available youthful male voice. Exact voices vary by browser/OS.
function assignYoungBoyVoice(utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[]) {
    utterance.pitch = 1.3;
    utterance.rate = 0.94;
    utterance.volume = 1.0;
    const boyVoice =
        voices.find(v => /child|junior|boy|young/i.test(v.name) && /male|boy|junior/i.test(v.name)) ||
        voices.find(v => /david|mark|george|daniel|alex|aaron|guy|ravi|male/i.test(v.name)) ||
        voices.find(v => v.lang === 'en-IN' && /male/i.test(v.name)) ||
        voices.find(v => v.lang.startsWith('en') && /male/i.test(v.name)) ||
        voices.find(v => v.lang.startsWith('en'));
    if (boyVoice) utterance.voice = boyVoice;
}

export default function InteractiveAvatar() {
    const [stage, setStage] = useState<"hidden" | "entering" | "waiting" | "speaking" | "rejected">("hidden");
    const [isMuted, setIsMuted] = useState(false);
    const [audioBlocked, setAudioBlocked] = useState(false);
    const [currentText, setCurrentText] = useState("");
    const [currentVideoSrc, setCurrentVideoSrc] = useState("/avatar-welcome.mp4");
    const [customTourLink, setCustomTourLink] = useState<{ label: string, action: () => void } | null>(null);

    const location = useLocation();
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioStartedRef = useRef(false);
    const isMutedRef = useRef(false);
    const speechPendingRef = useRef(false);
    const speechRequestRef = useRef(0);
    const activeConfigRef = useRef<AvatarConfig>(routeAvatarConfigs["/"]);
    const spokenDialoguesRef = useRef(new Set<string>());
    const activeHomeSectionRef = useRef<string | null>(null);

    const startMotion = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = 0;
        video.play().catch(() => { });
    }, []);

    const stopMotion = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        video.pause();
        video.currentTime = 0;
    }, []);
    const stopSpeech = useCallback(() => {
        speechRequestRef.current += 1;
        speechPendingRef.current = false;
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        window.speechSynthesis?.cancel();
        stopMotion();
    }, [stopMotion]);

    const setActiveConfig = useCallback((config: AvatarConfig) => {
        activeConfigRef.current = config;
        setCurrentText(config.text);
        setCurrentVideoSrc(config.videoSrc);
        setCustomTourLink(config.tourLink ?? null);
    }, []);

    // Guaranteed Continuous 60FPS Pure Transparent Chroma-Key Canvas
    useEffect(() => {
        let animationFrameId: number;
        let lastFrameTime = 0;

        const processFrame = (time: number) => {
            if (time - lastFrameTime < 33) {
                animationFrameId = requestAnimationFrame(processFrame);
                return;
            }
            lastFrameTime = time;
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (canvas && video && video.readyState >= 2) {
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                if (ctx) {
                    const computeHeight = 280;
                    const aspect = (video.videoWidth || 640) / (video.videoHeight || 480);
                    const computeWidth = Math.round(computeHeight * aspect);

                    if (canvas.width !== computeWidth || canvas.height !== computeHeight) {
                        canvas.width = computeWidth;
                        canvas.height = computeHeight;
                    }

                    ctx.drawImage(video, 0, 0, computeWidth, computeHeight);
                    const frame = ctx.getImageData(0, 0, computeWidth, computeHeight);
                    const data = frame.data;
                    const len = data.length;

                    // Fast chroma-key background removal
                    for (let i = 0; i < len; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];

                        const max = r > g ? (r > b ? r : b) : (g > b ? g : b);
                        const min = r < g ? (r < b ? r : b) : (g < b ? g : b);
                        const diff = max - min;

                        // 1. Studio light-grey background
                        // 2. Studio floor shadow
                        // 3. Studio light-blue background
                        // 4. Light-blue floor shadow
                        if (
                            (diff < 18 && min > 165) ||
                            (diff < 14 && min > 110 && b > 105 && r < 175) ||
                            (b > 170 && g > 150 && r > 130 && diff < 55) ||
                            (b > 110 && g > 110 && diff < 20 && min > 90 && max < 160)
                        ) {
                            data[i + 3] = 0;
                        }
                    }
                    ctx.putImageData(frame, 0, 0);
                }
            }
            animationFrameId = requestAnimationFrame(processFrame);
        };

        animationFrameId = requestAnimationFrame(processFrame);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Speech execution function
    const playSpeech = useCallback((config: AvatarConfig) => {
        if (isMutedRef.current) {
            setStage("waiting");
            return;
        }

        stopSpeech();
        startMotion();
        const requestId = speechRequestRef.current;
        speechPendingRef.current = true;
        const finish = () => {
            if (speechRequestRef.current === requestId) {
                speechPendingRef.current = false;
                stopMotion();
                setStage("waiting");
            }
        };

        // Media autoplay is blocked by browsers; the homepage uses speech synthesis
        // so its greeting can start as soon as the preloader finishes.
        if (config.audioSrc && !config.preferSpeechSynthesis) {
            const audio = new Audio(config.audioSrc);
            audioRef.current = audio;
            audio.onended = finish;
            audio.onerror = () => {
                audioRef.current = null;
                finish();
            };
            audio.play().then(() => {
                if (speechRequestRef.current !== requestId) return;
                setStage("speaking");
                setAudioBlocked(false);
                audioStartedRef.current = true;
                speechPendingRef.current = false;
            }).catch(() => {
                audioRef.current = null;
                speechPendingRef.current = false;
                setAudioBlocked(true);
                setStage("waiting");
                stopMotion();
            });
            return;
        }
        if (!window.speechSynthesis) {
            speechPendingRef.current = false;
            setStage("waiting");
            setAudioBlocked(true);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(config.text);
        utterance.onend = finish;
        utterance.onerror = finish;

        const speakNow = (voices: SpeechSynthesisVoice[]) => {
            if (speechRequestRef.current !== requestId) return;
            assignYoungBoyVoice(utterance, voices);
            window.speechSynthesis.speak(utterance);
            setStage("speaking");
            setAudioBlocked(false);
            audioStartedRef.current = true;
            speechPendingRef.current = false;
        };

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            speakNow(voices);
        } else {
            // Voices load asynchronously; wait for them.
            window.speechSynthesis.onvoiceschanged = () => {
                window.speechSynthesis.onvoiceschanged = null;
                speakNow(window.speechSynthesis.getVoices());
            };
        }
    }, [startMotion, stopMotion, stopSpeech]);
    const playConfigAutomatically = useCallback((config: AvatarConfig) => {
        const dialogueKey = `${config.videoSrc}|${config.text}`;
        if (spokenDialoguesRef.current.has(dialogueKey)) return;
        spokenDialoguesRef.current.add(dialogueKey);
        playSpeech(config);
    }, [playSpeech]);
    // Smooth Video Playback & Source Synchronization
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (location.pathname === "/qr-scan" || location.pathname === "/qr" || location.pathname === "/terms") {
            return;
        }

        if (!video.src.endsWith(currentVideoSrc)) {
            video.src = currentVideoSrc;
        }
        video.play().catch(() => { });
    }, [currentVideoSrc, location.pathname]);

    // Route Awareness and Initiation
    useEffect(() => {
        // Completely hide avatar on /qr-scan, /qr, and /terms
        if (location.pathname === "/qr-scan" || location.pathname === "/qr" || location.pathname === "/terms") {
            stopSpeech();
            setStage("hidden");
            return;
        }

        const config = routeAvatarConfigs[location.pathname] || routeAvatarConfigs["/"];
        setActiveConfig(config);
        audioStartedRef.current = false;
        spokenDialoguesRef.current.clear();
        stopSpeech();

        const isFirstLoadOnHome = location.pathname === "/" && !sessionStorage.getItem('avatarVoiceInitialized');
        let enterTimer: ReturnType<typeof setTimeout>;

        const executeAvatarSpeech = () => {
            if (audioStartedRef.current || speechPendingRef.current) return;
            sessionStorage.setItem('avatarVoiceInitialized', 'true');
            playConfigAutomatically(activeConfigRef.current);
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
            // Auto-speak on ALL routes including home re-entry
            enterTimer = setTimeout(executeAvatarSpeech, 300);
        }

        return () => {
            if (isFirstLoadOnHome) {
                window.removeEventListener('preloaderFinished', handlePreloaderComplete);
            }
            clearTimeout(enterTimer);
            stopSpeech();
        };
    }, [location.pathname, playConfigAutomatically, playSpeech, setActiveConfig, stopSpeech]);

    // Global First-Interaction Audio Trigger
    useEffect(() => {
        if (location.pathname === "/qr-scan" || location.pathname === "/qr" || location.pathname === "/terms") return;

        const unlockAndPlay = () => {
            if (!audioStartedRef.current && !speechPendingRef.current && !isMuted && stage !== "hidden") {
                playSpeech(activeConfigRef.current);
            }
        };

        const events = ["click", "touchstart", "pointerdown", "scroll", "keydown"];
        const handleUserGesture = () => {
            unlockAndPlay();
            events.forEach(evt => window.removeEventListener(evt, handleUserGesture));
        };

        events.forEach(evt => window.addEventListener(evt, handleUserGesture, { passive: true }));
        return () => {
            events.forEach(evt => window.removeEventListener(evt, handleUserGesture));
        };
    }, [location.pathname, isMuted, stage, playSpeech]);

    // Section-Aware Scroll: IntersectionObserver watches each data-section element on home page
    useEffect(() => {
        if (location.pathname !== "/") return;

        type SectionConfig = AvatarConfig & {
            sectionId: string;
            tourLink: { label: string; action: () => void };
        };

        const homeSections: Record<string, SectionConfig> = {
            hero: { sectionId: "hero", text: "Welcome to A.R. Grand. Explore our luxury wedding and banquet halls.", videoSrc: "/avatar-welcome.mp4", audioSrc: "/audio/home.mp3", tourLink: { label: "Explore Gallery", action: () => navigate('/gallery') } },
            about: { sectionId: "about", text: "Located in Kodungaiyur, Chennai, with timeless elegance and modern amenities.", videoSrc: "/avatar-turn-front.mp4", audioSrc: "/audio/home-about.mp3", tourLink: { label: "View Gallery", action: () => navigate('/gallery') } },
            stats: { sectionId: "stats", text: "More than 10 years of trust, over 500 celebrations, and space for up to 250 guests.", videoSrc: "/avatar-side-walk.mp4", audioSrc: "/audio/home-stats.mp3", tourLink: { label: "View Facilities", action: () => navigate('/facilities') } },
            features: { sectionId: "features", text: "Air-conditioned halls, premium catering, DJ, decor, a bridal room, and parking in one place.", videoSrc: "/avatar-approach.mp4", audioSrc: "/audio/home-features.mp3", tourLink: { label: "Check Events", action: () => navigate('/events') } },
            tour: { sectionId: "tour", text: "Take a cinematic 360-degree virtual tour inside A.R. Grand.", videoSrc: "/avatar-approach.mp4", audioSrc: "/audio/home-tour.mp3", tourLink: { label: "Book Your Venue", action: () => navigate('/enquiry') } },
            testimonials: { sectionId: "testimonials", text: "Loved by couples across Chennai, with five-star reviews from real celebrations.", videoSrc: "/avatar-approach-and-greet.mp4", audioSrc: "/audio/home-testimonials.mp3", tourLink: { label: "Enquire Now", action: () => navigate('/enquiry') } },
            cta: { sectionId: "cta", text: "Ready to book your dream venue? Reserve your date today.", videoSrc: "/avatar-approach-and-greet.mp4", audioSrc: "/audio/home-cta.mp3", tourLink: { label: "Enquire Now", action: () => navigate('/enquiry') } }
        };

        const visibilityMap: Record<string, number> = {};
        let updateTimer: ReturnType<typeof setTimeout>;

        const updateActiveSection = () => {
            const nextSection = Object.entries(visibilityMap)
                .filter(([, ratio]) => ratio > 0)
                .sort(([, firstRatio], [, secondRatio]) => secondRatio - firstRatio)[0]?.[0];
            if (!nextSection || nextSection === activeHomeSectionRef.current) return;

            const config = homeSections[nextSection];
            if (!config) return;
            activeHomeSectionRef.current = nextSection;
            stopSpeech();
            setActiveConfig(config);
            if (stage !== "hidden") {
                updateTimer = setTimeout(() => playConfigAutomatically(config), 180);
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const key = (entry.target as HTMLElement).dataset.section;
                    if (key) visibilityMap[key] = entry.isIntersecting ? entry.intersectionRatio : 0;
                });
                clearTimeout(updateTimer);
                updateTimer = setTimeout(updateActiveSection, 100);
            },
            { threshold: [0, 0.15, 0.4, 0.7], rootMargin: "-20% 0px -30% 0px" }
        );

        document.querySelectorAll("[data-section]").forEach((element) => observer.observe(element));

        return () => {
            clearTimeout(updateTimer);
            observer.disconnect();
            activeHomeSectionRef.current = null;
        };
    }, [location.pathname, navigate, playConfigAutomatically, setActiveConfig, stage, stopSpeech]);

    const handleDismiss = () => {
        stopSpeech();
        setStage("rejected");
    };

    const toggleMute = () => {
        if (!isMuted) {
            isMutedRef.current = true;
            stopSpeech();
            setStage("waiting");
            setIsMuted(true);
        } else {
            isMutedRef.current = false;
            setIsMuted(false);
            playSpeech(activeConfigRef.current);
        }
    };

    const handleAvatarClick = () => {
        const video = videoRef.current;
        if (video) {
            video.currentTime = 0;
            video.play().catch(() => { });
        }
        playSpeech(activeConfigRef.current);
    };

    // Predefined tour links per tab
    const defaultTourLinks: Record<string, { label: string, action: () => void }> = {
        "/": { label: "Explore Gallery", action: () => navigate('/gallery') },
        "/gallery": { label: "View Facilities", action: () => navigate('/facilities') },
        "/facilities": { label: "Discover Events", action: () => navigate('/events') },
        "/contact": { label: "Book Your Venue", action: () => navigate('/enquiry') }
    };

    const activeTourLink = customTourLink || defaultTourLinks[location.pathname];

    // Suppress avatar on /qr-scan, /qr, /terms
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
                    onClick={handleAvatarClick}
                    title="Click the boy to speak"
                    style={{
                        transform: avatarTransform,
                        transition: `transform ${avatarFlipDuration} cubic-bezier(0.25, 0.46, 0.45, 0.94)`
                    }}
                >
                    <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        {isMuted ? <VolumeX className="text-white drop-shadow-md" size={24} /> : <Volume2 className="text-white drop-shadow-md" size={24} />}
                    </div>

                    {/* Canvas with 100% Pure Transparent Pixel Shader */}
                    <canvas
                        ref={canvasRef}
                        className="w-[180%] h-[180%] max-w-none object-cover object-[center_30%] relative z-10 bg-transparent border-0 outline-none shadow-none"
                    />

                    {/* Motion Video Element with continuous loop */}
                    <video
                        ref={videoRef}
                        src={currentVideoSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        onCanPlay={() => {
                            videoRef.current?.play().catch(() => { });
                        }}
                        className="opacity-0 w-0 h-0 absolute pointer-events-none"
                    />
                </div>

                {/* Compact, Sleek Speech Bubble */}
                <div
                    className={`absolute bottom-[85%] left-[20%] md:bottom-[60%] md:left-[75%] w-[15rem] md:w-[18rem] bg-card/95 backdrop-blur-md p-3 md:p-3.5 rounded-2xl rounded-bl-sm shadow-[var(--shadow-elegant)] border border-[hsl(var(--gold)/0.3)] transition-all duration-500 origin-bottom-left flex flex-col gap-2.5 ${(stage === "speaking" || stage === "waiting") ? "scale-100 opacity-100" : "scale-0 opacity-0"
                        }`}
                >
                    {/* Header with prompt text & clean control buttons */}
                    <div className="flex justify-between items-start gap-2">
                        <p className="text-foreground text-xs md:text-[13px] font-medium leading-snug transition-all duration-300">
                            {currentText}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                                className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"
                                title={isMuted ? "Unmute voice" : "Mute voice"}
                                aria-label={isMuted ? "Unmute voice" : "Mute voice"}
                            >
                                {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
                                className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"
                                title="Close"
                                aria-label="Dismiss concierge"
                            >
                                <X size={13} />
                            </button>
                        </div>
                    </div>

                    {/* Autoplay blocked indicator button - Tap to Listen */}
                    {audioBlocked && !isMuted && (
                        <button
                            onClick={handleAvatarClick}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-[hsl(var(--gold)/0.15)] text-[hsl(var(--gold))] border border-[hsl(var(--gold)/0.4)] text-[11px] font-medium hover:bg-[hsl(var(--gold)/0.25)] transition-all animate-pulse cursor-pointer"
                        >
                            <Volume2 size={13} />
                            <span>Tap to listen to guide</span>
                            <Sparkles size={11} />
                        </button>
                    )}

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
