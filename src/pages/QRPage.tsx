import { useState, useRef, useEffect } from "react";

export default function QRPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stage, setStage] = useState<"entering" | "waiting" | "leaving">("entering");

    useEffect(() => {
        // Autoplay on mount
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
        }
        setTimeout(() => setStage("waiting"), 800);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-noir flex flex-col items-center justify-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ background: "var(--gradient-gold)" }} />

            {/* The slider animation holding the content */}
            <div
                className={`relative z-[100] w-full max-w-6xl px-4 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center justify-center gap-6 ${stage === "entering" || stage === "waiting" ? "translate-y-0 opacity-100 scale-100" : "-translate-y-10 opacity-0 scale-95"
                    }`}
            >
                <div className="bg-card w-full max-w-3xl p-6 md:p-8 rounded-3xl shadow-[var(--shadow-elegant)] border-2 border-[hsl(var(--gold))] flex flex-col gap-4 text-center transition-transform duration-700 delay-300 relative z-20">
                    <h2 className="text-2xl md:text-3xl font-heading text-foreground">
                        Welcome to <span className="gold-text italic">A.R Grand</span>
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        Explore our location below. We're excited to have you!
                    </p>
                </div>

                <div className="w-[90vw] md:w-[800px] h-[50vh] md:h-[60vh] bg-background rounded-[2rem] border-4 border-[hsl(var(--gold))] p-1 shadow-[var(--shadow-gold)] relative group shrink-0">
                    <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative">
                        {/* Google Map */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.0!2d80.2464!3d13.1167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5264000000000%3A0x0!2sKodungaiyur%2C+Chennai!5e0!3m2!1sen!2sin!4v1"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="A.R Grand Location"
                        />
                        {/* Overlay Video (Character Only via mix-blend-mode) */}
                        <div className="absolute bottom-0 right-4 w-[200px] md:w-[280px] pointer-events-none" style={{ mixBlendMode: 'screen' }}>
                            <video
                                ref={videoRef}
                                src="/baby animate1.mp4"
                                autoPlay
                                muted
                                playsInline
                                loop
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
