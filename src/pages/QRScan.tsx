import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Play, Volume2, VolumeX } from "lucide-react";
import SEO from "@/components/SEO";

export default function QRScan() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const bgVideoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [redirected, setRedirected] = useState(false);

    const googleMapsUrl =
        "https://www.google.com/maps/search/?api=1&query=AR+Grands,+No+5C%2F1,+Sidco+Main+Rd,+near+TNEB,+Kodungaiyur+(East),+Vivekananda+Nagar,+Chennai+-+600118";

    const handleRedirect = () => {
        if (redirected) return;
        setRedirected(true);
        window.location.href = googleMapsUrl;
    };

    const handleStartPlayback = () => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
            videoRef.current
                .play()
                .then(() => {
                    setIsPlaying(true);
                    if (bgVideoRef.current) {
                        bgVideoRef.current.currentTime = videoRef.current ? videoRef.current.currentTime : 0;
                        bgVideoRef.current.play().catch(() => { });
                    }
                })
                .catch((err) => {
                    console.error("Video play error:", err);
                    // Fallback to muted playback if user-gesture audio was blocked
                    if (videoRef.current) {
                        videoRef.current.muted = true;
                        setIsMuted(true);
                        videoRef.current.play().then(() => {
                            setIsPlaying(true);
                            if (bgVideoRef.current) bgVideoRef.current.play().catch(() => { });
                        });
                    }
                });
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onTimeUpdate = () => {
            if (video.duration && video.duration - video.currentTime < 0.25) {
                video.pause();
                handleRedirect();
            }
        };

        const onEnded = () => handleRedirect();

        video.addEventListener("timeupdate", onTimeUpdate);
        video.addEventListener("ended", onEnded);

        return () => {
            video.removeEventListener("timeupdate", onTimeUpdate);
            video.removeEventListener("ended", onEnded);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-noir flex flex-col items-center justify-center overflow-hidden select-none">
            <SEO
                title="QR Scan & Directions · A.R Grand"
                description="Experience the animated venue walkthrough and navigate directly to A.R Grand Kodungaiyur on Google Maps."
                path="/qr-scan"
            />

            {/* Ambient Blurred Cinema Backdrop for Desktop & Widescreen Monitors */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 blur-3xl scale-110 hidden md:block">
                <video
                    ref={bgVideoRef}
                    src="/qr-animation.mp4"
                    playsInline
                    muted
                    loop
                    preload="auto"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Subtle Vignette Gradient for Depth */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-black/80 pointer-events-none" />

            {/* Top Navigation Bar with Back & Direct Map Controls */}
            <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-white/90 hover:text-white bg-black/50 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/20 text-xs md:text-sm font-medium transition-all hover:bg-black/70 shadow-md"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                </Link>

                <div className="flex items-center gap-2.5">
                    {isPlaying && (
                        <button
                            onClick={toggleMute}
                            className="flex items-center gap-1.5 text-white/90 hover:text-white bg-black/50 backdrop-blur-md px-3 py-2 rounded-full border border-white/20 text-xs font-medium transition-all hover:bg-black/70"
                            title={isMuted ? "Unmute Sound" : "Mute Sound"}
                        >
                            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                        </button>
                    )}

                    <button
                        onClick={handleRedirect}
                        className="flex items-center gap-2 bg-[hsl(var(--gold))] text-noir font-bold px-4 py-2 rounded-full text-xs md:text-sm shadow-[var(--shadow-gold)] hover:brightness-110 active:scale-95 transition-all"
                    >
                        <MapPin size={15} />
                        <span>Open Map</span>
                    </button>
                </div>
            </header>

            {/* Responsive Cinema Stage (Desktop, Mobile & iOS Compatible) */}
            <div className="relative z-20 w-full h-full flex items-center justify-center p-2 md:p-6">
                <div
                    className="relative max-h-[88vh] md:max-h-[86vh] aspect-[9/16] w-auto max-w-[96vw] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(212,175,55,0.35)] border border-[hsl(var(--gold)/0.4)] bg-black flex items-center justify-center group"
                >
                    {/* Foreground Sharp Video */}
                    <video
                        ref={videoRef}
                        src="/qr-animation.mp4"
                        playsInline
                        preload="auto"
                        className="w-full h-full object-contain md:object-cover pointer-events-none"
                    />

                    {/* Interactive Tap-to-Start Luxury Overlay */}
                    {!isPlaying && (
                        <div
                            onClick={handleStartPlayback}
                            className="absolute inset-0 z-30 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-between p-6 text-center cursor-pointer transition-all hover:bg-black/30"
                        >
                            {/* Top Badge */}
                            <div className="pt-2">
                                <span className="text-[11px] uppercase tracking-widest text-[hsl(var(--gold))] font-semibold px-3 py-1 rounded-full bg-black/50 border border-[hsl(var(--gold)/0.3)] backdrop-blur-sm">
                                    Interactive Navigation
                                </span>
                            </div>

                            {/* Centered Glowing Play Button */}
                            <div className="relative flex flex-col items-center justify-center my-auto">
                                <div className="relative mb-4 flex items-center justify-center">
                                    <div className="absolute w-20 h-20 rounded-full bg-[hsl(var(--gold)/0.3)] animate-ping" />
                                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-[hsl(var(--gold))] text-noir flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.7)] group-hover:scale-105 transition-transform">
                                        <Play size={28} className="ml-1 fill-current" />
                                    </div>
                                </div>
                                <h2 className="font-heading text-xl md:text-2xl text-cream font-medium tracking-wide drop-shadow-md">
                                    A.R. GRAND <span className="gold-text italic">KODUNGAIYUR</span>
                                </h2>
                                <p className="text-cream/80 text-xs md:text-sm max-w-xs mt-1 font-light">
                                    Tap to start animation & navigate to venue
                                </p>
                            </div>

                            {/* Bottom CTA Action Button */}
                            <div className="w-full pb-2">
                                <button
                                    onClick={handleStartPlayback}
                                    className="w-full bg-[hsl(var(--gold))] text-noir font-bold text-xs md:text-sm py-3 px-4 rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.5)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <Play size={15} className="fill-current" />
                                    <span>Play Animation & Open Map</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
