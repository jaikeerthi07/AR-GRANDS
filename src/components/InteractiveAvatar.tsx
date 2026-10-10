import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Volume2, VolumeX, X } from "lucide-react";

export default function InteractiveAvatar() {
    const [stage, setStage] = useState<"hidden" | "entering" | "waiting" | "speaking" | "rejected">("hidden");
    const [isMuted, setIsMuted] = useState(false);
    const [currentText, setCurrentText] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Canvas Chroma Key Logic
    useEffect(() => {
        let animationFrameId: number;
        const processFrame = () => {
            if (canvasRef.current && videoRef.current) {
                const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
                const video = videoRef.current;

                if (ctx && video.readyState >= 2) {
                    const computeHeight = Math.min(video.videoHeight, 480);
                    const computeWidth = computeHeight * (video.videoWidth / video.videoHeight);

                    if (canvasRef.current.width !== computeWidth) {
                        canvasRef.current.width = computeWidth;
                        canvasRef.current.height = computeHeight;
                    }

                    ctx.drawImage(video, 0, 0, computeWidth, computeHeight);
                    const frame = ctx.getImageData(0, 0, computeWidth, computeHeight);
                    const data = frame.data;
                    const length = data.length;

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
                                // Grey anti-aliasing edges
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

    // Route Awareness and Speech Synthesis
    useEffect(() => {
        const routeNarratives: Record<string, string> = {
            "/": "Welcome to A.R. Grand. This is our magnificent front lobby and the very heart of our venue. Here, you will find incredibly elegant spaces perfectly suited for your grandest celebrations, blending the absolute best of modern luxury with timeless charm. Take a moment to look around at our stunning architectural details and experience the warm, welcoming atmosphere we have cultivated just for you.",
            "/gallery": "Step into our gallery. Here you can see beautiful photos of our marriage hall exterior, elegant wedding stage decorations, the grand entrance, various views of our fully seated hall, and our lift and staircase access.",
            "/facilities": "Let me show you our premium facilities. We have modern passenger lifts, spacious car parking, power backup generator sets, a fully air-conditioned hall, elegantly furnished private rooms, and a separate commercial cooking area for your caterers.",
            "/events": "This is our Events page! Here you can check available dates and scheduled bookings for various events like weddings, receptions, and corporate gatherings. You can also easily add a new booking to reserve your preferred date.",
            "/contact": "Need to get in touch with us? You are in the exact right place. Just fill out our highly responsive contact form or reach out directly to our friendly support team via phone or email. We are always here and fully ready to help you plan and execute your dream event with us.",
            "/enquiry": "Ready to officially book your dream venue with us? Send us a detailed enquiry right here and our highly professional event management team will get back to you promptly with all the extensive details, pricing, and availability you need to make your grand celebration a striking reality.",
            "/terms": "Here are our complete terms and conditions which cover seven main sections. First, Booking and Reservation, requiring a fifty percent advance. Second, Cancellation and Refund policies. Third, Venue Usage rules and overtime policies. Fourth, Capacity and Safety guidelines, including our strict no indoor fireworks policy. Fifth, Noise and Conduct rules ensuring music stops by 10 PM. Sixth, Parking and Liability details regarding our complimentary parking. And finally, General terms of agreement. Please read through carefully to ensure a smooth experience.",
            "/admin": "Welcome to the secure admin portal. Please securely log in with your verified credentials to closely manage real-time bookings, comprehensively view user inquiries, and smoothly handle all internal venue operations and logistics.",
            "/locations/perambur": "Discover our highly accessible premier locations. A.R. Grand in Perambur is strategically situated right at the prime spot of the city center to ensure absolute ease of access and hassle-free commuting for all of your esteemed guests.",
            "/locations/vyasarpadi": "Discover our beautifully situated Vyasarpadi location. It offers an incredible blend of local charm and absolute urban ease of access, ensuring all your guests arrive perfectly on time with minimal effort.",
            "/locations/madhavaram": "Discover our fantastic Madhavaram branch. Located incredibly centrally with brilliant local connections in Madhavaram to make travel highly convenient, breezy, and pleasant for absolutely everyone attending."
        };

        const textToSpeak = routeNarratives[location.pathname] || "Welcome to A.R. Grand! Explore our venue and discover the perfect space for your next grand celebration.";
        setCurrentText(textToSpeak);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if (videoRef.current) videoRef.current.playbackRate = 1.0;

        const isFirstLoad = !sessionStorage.getItem('avatarVoiceInitialized');
        let enterTimer: ReturnType<typeof setTimeout>;

        const executeAvatarSpeech = () => {
            sessionStorage.setItem('avatarVoiceInitialized', 'true');
            // Do not arbitrarily set "speaking" here; wait for audio promise below.

            if (!isMuted) {
                const routeAudioMap: Record<string, string> = {
                    "/": "/audio/home.mp3",
                    "/gallery": "/audio/gallery.mp3",
                    "/facilities": "/audio/facilities.mp3",
                    "/events": "/audio/events.mp3",
                    "/contact": "/audio/contact.mp3",
                    "/enquiry": "/audio/enquiry.mp3",
                    "/terms": "/audio/terms.mp3",
                    "/admin": "/audio/admin.mp3",
                    "/locations/perambur": "/audio/perambur.mp3",
                    "/locations/vyasarpadi": "/audio/vyasarpadi.mp3",
                    "/locations/madhavaram": "/audio/madhavaram.mp3"
                };
                const audioFileToPlay = routeAudioMap[location.pathname] || "/audio/home.mp3";

                const audio = new Audio(audioFileToPlay);
                audioRef.current = audio;

                audio.onended = () => setStage("waiting");
                audio.onerror = () => setStage("waiting");

                audio.play().then(() => {
                    setStage("speaking");
                }).catch(e => {
                    console.error("Audio play blocked", e);
                    setCurrentText("👋 Autoplay was blocked by your browser! Please tap the Unmute button below to hear my genuine boy voice.");
                    setIsMuted(true);
                    setStage("waiting");
                });
            } else {
                setTimeout(() => setStage("waiting"), 3000);
            }
        };

        const handlePreloaderComplete = () => {
            setStage("entering");
            enterTimer = setTimeout(executeAvatarSpeech, 1200);
        };

        if (isFirstLoad) {
            setStage("hidden");
            window.addEventListener('preloaderFinished', handlePreloaderComplete);
        } else {
            setStage("entering");
            enterTimer = setTimeout(executeAvatarSpeech, 1200);
        }

        return () => {
            if (isFirstLoad) {
                window.removeEventListener('preloaderFinished', handlePreloaderComplete);
            }
            clearTimeout(enterTimer);
            if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
        };
    }, [location.pathname, isMuted]);

    const handleDismiss = () => {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
        setStage("rejected");
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.85;
        }
    };

    const toggleMute = () => {
        if (!isMuted) {
            if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
            setStage("waiting");
        } else {
            const routeAudioMap: Record<string, string> = {
                "/": "/audio/home.mp3",
                "/gallery": "/audio/gallery.mp3",
                "/facilities": "/audio/facilities.mp3",
                "/events": "/audio/events.mp3",
                "/contact": "/audio/contact.mp3",
                "/enquiry": "/audio/enquiry.mp3",
                "/terms": "/audio/terms.mp3",
                "/admin": "/audio/admin.mp3",
                "/locations/perambur": "/audio/perambur.mp3",
                "/locations/vyasarpadi": "/audio/vyasarpadi.mp3",
                "/locations/madhavaram": "/audio/madhavaram.mp3"
            };
            const audioFileToPlay = routeAudioMap[location.pathname] || "/audio/home.mp3";

            const audio = new Audio(audioFileToPlay);
            audioRef.current = audio;
            audio.onended = () => setStage("waiting");
            audio.onerror = () => setStage("waiting");
            audio.play().then(() => setStage("speaking")).catch(e => setStage("waiting"));
        }
        setIsMuted(!isMuted);
    };

    const tourLinks: Record<string, { label: string, action: () => void }> = {
        "/": { label: "Explore Gallery 🖼️", action: () => navigate('/gallery') },
        "/gallery": { label: "View Facilities 🏨", action: () => navigate('/facilities') },
        "/facilities": { label: "Discover Events 🎉", action: () => navigate('/events') },
        "/events": {
            label: "Open Google Maps 📍", action: () => {
                if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
                window.open("https://www.google.com/maps/search/?api=1&query=AR+GRANDS,+Chennai", "_blank");
            }
        }
    };
    const currentTourLink = tourLinks[location.pathname];

    if (stage === "hidden") return null;

    let transformString = "translateX(-150vw)";
    let duration = "0ms";
    let avatarTransform = "perspective(1200px) rotateY(0deg) translateY(0px) scaleX(1)";
    let avatarFlipDuration = "0ms";
    let avatarFilter = "brightness(1.05) contrast(1.1) drop-shadow(0 15px 25px hsl(var(--gold) / 0.25))";

    if (stage === "entering" || stage === "speaking" || stage === "waiting") {
        transformString = "translateX(clamp(1rem, 15vw, 20vw))";
        duration = "2000ms";
        avatarFlipDuration = "1000ms";
    } else if (stage === "rejected") {
        transformString = "translateX(-150vw)";
        duration = "5000ms";
        avatarTransform = "perspective(1200px) rotateY(-180deg) translateY(12px) skewX(-2deg)";
        avatarFlipDuration = "800ms";
        avatarFilter = "brightness(0.3) sepia(0.6) hue-rotate(190deg) saturate(1.2)";
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
                <div
                    className="w-40 h-56 md:w-56 md:h-72 flex flex-col items-center justify-center cursor-pointer group pointer-events-auto overflow-visible relative"
                    onClick={toggleMute}
                    style={{
                        transform: avatarTransform,
                        filter: avatarFilter,
                        transition: `transform ${avatarFlipDuration} cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 2000ms ease-in-out`
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

                    {/* Magical glow puddle to anchor the avatar firmly onto the website ground */}
                    <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-20 h-2 bg-black/40 blur-[5px] rounded-[100%] shadow-[0_0_20px_hsl(var(--gold)/0.6)] animate-[pulse_3s_infinite] pointer-events-none z-[0]" />

                    <canvas
                        ref={canvasRef}
                        className="w-[180%] h-[180%] max-w-none object-cover object-[center_30%] relative z-10"
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
                    className={`absolute bottom-[85%] left-[20%] md:bottom-[60%] md:left-[75%] w-[18rem] md:w-[24rem] bg-card/95 backdrop-blur-md p-4 md:p-5 rounded-3xl rounded-bl-sm shadow-[var(--shadow-elegant)] border border-[hsl(var(--gold)/0.3)] transition-all duration-700 origin-bottom-left flex flex-col gap-3 md:gap-4 ${(stage === "speaking" || stage === "waiting") ? "scale-100 opacity-100" : "scale-0 opacity-0"
                        }`}
                >
                    <div className="flex justify-between items-start gap-2">
                        <p className="text-foreground text-[13px] md:text-sm font-medium leading-relaxed">
                            {currentText}
                        </p>
                        <button
                            onClick={handleDismiss}
                            className="bg-muted hover:bg-accent hover:text-accent-foreground text-muted-foreground p-1.5 rounded-full shrink-0 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {currentTourLink && (
                        <div className="mt-2 text-center">
                            <button
                                onClick={currentTourLink.action}
                                className="w-full bg-[hsl(var(--gold))] text-noir text-xs font-bold py-2.5 px-3 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-[var(--shadow-gold)] animate-[pulse_2.5s_ease-in-out_infinite]"
                            >
                                {currentTourLink.label}
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                        <span className={`text-[9px] md:text-[10px] uppercase font-bold tracking-wider ${stage === 'speaking' ? 'text-accent animate-pulse' : 'text-muted-foreground'}`}>
                            {stage === 'speaking' ? '🎙️ Speaking...' : '✅ Story finished'}
                        </span>

                        <button
                            onClick={toggleMute}
                            className="text-[10px] md:text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                        >
                            {isMuted ? <><VolumeX size={12} /> Unmute</> : <><Volume2 size={12} /> Mute</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
