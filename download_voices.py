import os
import subprocess

routes = {
    "home": "Welcome to A.R. Grand. This is our magnificent front lobby and the very heart of our venue. Here, you will find incredibly elegant spaces perfectly suited for your grandest celebrations, blending the absolute best of modern luxury with timeless charm. Take a moment to look around at our stunning architectural details and experience the warm, welcoming atmosphere we have cultivated just for you.",
    "gallery": "Step into our gallery. Here you can see beautiful photos of our marriage hall exterior, elegant wedding stage decorations, the grand entrance, various views of our fully seated hall, and our lift and staircase access.",
    "facilities": "Let me show you our premium facilities. We have modern passenger lifts, spacious car parking, power backup generator sets, a fully air-conditioned hall, elegantly furnished private rooms, and a separate commercial cooking area for your caterers.",
    "events": "This is our Events page! Here you can check available dates and scheduled bookings for various events like weddings, receptions, and corporate gatherings. You can also easily add a new booking to reserve your preferred date.",
    "contact": "Need to get in touch with us? You are in the exact right place. Just fill out our highly responsive contact form or reach out directly to our friendly support team via phone or email. We are always here and fully ready to help you plan and execute your dream event with us.",
    "enquiry": "Ready to officially book your dream venue with us? Send us a detailed enquiry right here and our highly professional event management team will get back to you promptly with all the extensive details, pricing, and availability you need to make your grand celebration a striking reality.",
    "terms": "Here are our complete terms and conditions which cover seven main sections. First, Booking and Reservation, requiring a fifty percent advance. Second, Cancellation and Refund policies. Third, Venue Usage rules and overtime policies. Fourth, Capacity and Safety guidelines, including our strict no indoor fireworks policy. Fifth, Noise and Conduct rules ensuring music stops by 10 PM. Sixth, Parking and Liability details regarding our complimentary parking. And finally, General terms of agreement. Please read through carefully to ensure a smooth experience.",
    "admin": "Welcome to the secure admin portal. Please securely log in with your verified credentials to closely manage real-time bookings, comprehensively view user inquiries, and smoothly handle all internal venue operations and logistics.",
    "perambur": "Discover our highly accessible premier locations. A.R. Grand in Perambur is strategically situated right at the prime spot of the city center to ensure absolute ease of access and hassle-free commuting for all of your esteemed guests.",
    "vyasarpadi": "Discover our beautifully situated Vyasarpadi location. It offers an incredible blend of local charm and absolute urban ease of access, ensuring all your guests arrive perfectly on time with minimal effort.",
    "madhavaram": "Discover our fantastic Madhavaram branch. Located incredibly centrally with brilliant local connections in Madhavaram to make travel highly convenient, breezy, and pleasant for absolutely everyone attending."
}

os.makedirs('public/audio', exist_ok=True)

subprocess.run(['pip', 'install', 'edge-tts'])

for name, text in routes.items():
    cmd = [
        'edge-tts',
        '--voice', 'en-IN-PrabhatNeural',
        '--pitch', '+35Hz', 
        '--rate', '+15%',
        '--text', text,
        '--write-media', f'public/audio/{name}.mp3'
    ]
    print(f"Generating {name}.mp3...")
    subprocess.run(cmd)

print("All done!")
