const PRODUCTS = [
  {
    id: 1,
    title: "Pro Fitness Treadmill",
    price: 1299.99,
    cost: 850.00,
    img: "p1.svg.jpg",
    category: "Equipment",
    sellerName: "Fitness Pro Store",
    desc: "Experience professional-grade cardio training with our Pro Fitness Treadmill. Features a powerful 3.0 HP motor that supports speeds up to 12 mph, perfect for walking, jogging, and running. The large 20\" x 60\" running surface provides ample space for comfortable workouts. Built-in heart rate monitor tracks your pulse in real-time, while the 12 pre-programmed workout modes keep your training varied and challenging. The cushioned deck reduces impact on joints, and the foldable design saves space when not in use. Includes a digital display showing speed, distance, time, calories burned, and heart rate. Perfect for home gyms and fitness enthusiasts seeking a reliable, feature-rich treadmill.",
    sold: 420,
    rating: 4.8,
    reviews: 2180,
    gallery: ["p1.svg.jpg", "p1.svg.jpg", "p1.svg.jpg"],
    reviewList: [
      { name: "Sarah Johnson", rating: 5, comment: "Excellent treadmill! Very smooth and quiet. Perfect for home use. The heart rate monitor works great and the display is easy to read.", date: "2 weeks ago" },
      { name: "Michael Chen", rating: 5, comment: "Best purchase I've made this year. The foldable design saves so much space. The motor is powerful and handles my daily runs perfectly.", date: "1 month ago" },
      { name: "Emily Rodriguez", rating: 4, comment: "Great treadmill overall. The cushioning is excellent for my knees. Only minor issue is the assembly took a bit longer than expected.", date: "3 weeks ago" },
      { name: "David Thompson", rating: 5, comment: "Professional quality at a reasonable price. The 12 workout programs keep my training varied. Highly recommend!", date: "1 week ago" },
      { name: "Lisa Anderson", rating: 4, comment: "Very satisfied with this purchase. The build quality is solid and it's much quieter than I expected. Great value for money.", date: "2 months ago" }
    ]
  },
  {
    id: 2,
    title: "Yoga Mat Premium",
    price: 39.99,
    cost: 22.00,
    img: "p2.svg.jpg",
    category: "Accessories",
    sellerName: "Zen Wellness Shop",
    desc: "Elevate your yoga practice with our Premium Yoga Mat, crafted from eco-friendly TPE material that's both non-toxic and biodegradable. The 6mm thickness provides optimal cushioning for joints while maintaining stability for balance poses. Advanced non-slip surface technology ensures maximum grip in both dry and sweaty conditions, preventing slips during intense sessions. The closed-cell structure resists moisture and bacteria, making it easy to clean and maintain. Lightweight and portable, it comes with a carrying strap for convenience. Perfect for yoga, Pilates, stretching, and meditation. Available in multiple calming colors to match your style and create a serene practice space.",
    sold: 980,
    rating: 4.6,
    reviews: 1320,
    gallery: ["p2.svg.jpg", "p2.svg.jpg", "p2.svg.jpg"],
    reviewList: [
      { name: "Jessica Martinez", rating: 5, comment: "Perfect mat for my daily yoga practice! The grip is amazing even when sweaty. The thickness is just right - not too thin, not too thick.", date: "5 days ago" },
      { name: "Robert Kim", rating: 4, comment: "Great quality mat at a good price. The non-slip surface really works. My only complaint is the carrying strap could be a bit sturdier.", date: "2 weeks ago" },
      { name: "Amanda White", rating: 5, comment: "Love this mat! It's comfortable, easy to clean, and the eco-friendly material is a bonus. Highly recommend for any yoga enthusiast.", date: "1 week ago" },
      { name: "James Wilson", rating: 4, comment: "Good mat overall. The cushioning is nice and it doesn't slide around during poses. Good value for the price.", date: "3 weeks ago" }
    ]
  },
  {
    id: 3,
    title: "Resistance Bands Set",
    price: 24.99,
    cost: 12.00,
    img: "p3.svg.jpg",
    category: "Accessories",
    sellerName: "FitFlex Equipment",
    desc: "Transform your workout routine with our comprehensive Resistance Bands Set, featuring 5 bands with varying resistance levels (light, medium, heavy, extra heavy, and ultra heavy). Made from premium natural latex, these bands provide smooth, consistent resistance for full-body strength training. Perfect for building muscle, improving flexibility, and enhancing rehabilitation exercises. Each band is color-coded for easy identification and includes resistance levels from 10 to 50 pounds. The set comes with door anchors, ankle straps, and a carrying bag for portability. Ideal for home workouts, travel, physical therapy, and gym training. These versatile bands target all major muscle groups and are suitable for beginners to advanced athletes.",
    sold: 1560,
    rating: 4.7,
    reviews: 980,
    gallery: ["p3.svg.jpg", "p3.svg.jpg", "p3.svg.jpg"],
    reviewList: [
      { name: "Chris Brown", rating: 5, comment: "Amazing set! All 5 bands are high quality and the resistance levels are perfect for progressive training. The door anchors work great.", date: "1 week ago" },
      { name: "Maria Garcia", rating: 4, comment: "Great value for money. The bands are durable and the color coding makes it easy to identify resistance levels. Perfect for home workouts.", date: "2 weeks ago" },
      { name: "John Davis", rating: 5, comment: "Best resistance bands I've used. They don't snap or lose elasticity. The carrying bag is convenient for travel. Highly recommend!", date: "3 days ago" },
      { name: "Patricia Lee", rating: 4, comment: "Good quality bands at an affordable price. The variety of resistance levels is perfect for my fitness journey. Very satisfied!", date: "1 month ago" },
      { name: "Mark Taylor", rating: 5, comment: "Excellent purchase! These bands have replaced most of my gym equipment. The versatility is incredible. Great for full-body workouts.", date: "2 weeks ago" }
    ]
  },
  {
    id: 4,
    title: "Smart Fitness Watch",
    price: 199.99,
    cost: 120.00,
    img: "p4.svg.jpg",
    category: "Wearables",
    sellerName: "TechFit Solutions",
    desc: "Stay connected and track your health with our advanced Smart Fitness Watch. Monitor your heart rate 24/7 with optical heart rate sensors, track your sleep patterns including deep, light, and REM sleep stages, and measure blood oxygen saturation levels. The watch features GPS tracking for accurate distance and pace during outdoor activities. With over 100 workout modes including running, cycling, swimming, and strength training, you can track virtually any exercise. The 1.4-inch color touchscreen display is bright and easy to read in any lighting condition. Water-resistant up to 50 meters, making it perfect for swimming and water sports. Battery life lasts up to 7 days on a single charge. Receive notifications, control music, and access weather updates right from your wrist.",
    sold: 860,
    rating: 4.5,
    reviews: 640,
    gallery: ["p4.svg.jpg", "p4.svg.jpg", "p4.svg.jpg"],
    reviewList: [
      { name: "Daniel Moore", rating: 4, comment: "Great fitness watch with all the features I need. The battery life is impressive and the GPS tracking is accurate. The sleep tracking is very detailed.", date: "1 week ago" },
      { name: "Jennifer Adams", rating: 5, comment: "Love this watch! The heart rate monitor is accurate and the 100+ workout modes cover everything I do. Water resistance is a huge plus.", date: "2 weeks ago" },
      { name: "Kevin Jackson", rating: 4, comment: "Good value for money. The display is clear and the app syncs well. Battery lasts about 6 days with regular use. Very satisfied!", date: "5 days ago" },
      { name: "Nicole Harris", rating: 5, comment: "Best fitness watch I've owned. The sleep tracking is incredibly detailed and the notifications work perfectly. Highly recommend!", date: "3 weeks ago" }
    ]
  },
  {
    id: 5,
    title: "Adjustable Dumbbells 20kg",
    price: 249.99,
    cost: 160.00,
    img: "p5.svg.jpg",
    category: "Equipment",
    sellerName: "Strength Gear Co",
    desc: "Maximize your home gym space with our space-saving Adjustable Dumbbells. Each dumbbell adjusts from 2.5kg to 10kg in 2.5kg increments, giving you the equivalent of 8 pairs of traditional dumbbells in one compact unit. The quick-adjust dial system allows you to change weight in seconds without removing plates. Durable construction with steel plates and a comfortable ergonomic grip handle ensures long-lasting performance. The compact design takes up 90% less space than traditional dumbbell sets, making it perfect for small apartments and home gyms. Includes a storage tray to keep your weights organized. Perfect for strength training, muscle building, and toning exercises. Suitable for users of all fitness levels.",
    sold: 540,
    rating: 4.4,
    reviews: 420,
    gallery: ["p5.svg.jpg", "p5.svg.jpg", "p5.svg.jpg"],
    reviewList: [
      { name: "Ryan Clark", rating: 4, comment: "Space-saving design is perfect for my small apartment. The quick-adjust system works smoothly. Great quality for the price.", date: "2 weeks ago" },
      { name: "Michelle Young", rating: 4, comment: "Love how compact these are! The weight adjustment is easy and the grip is comfortable. Perfect for home workouts.", date: "1 week ago" },
      { name: "Steven King", rating: 5, comment: "Excellent dumbbells! The build quality is solid and they feel just like regular dumbbells. The storage tray is a nice bonus.", date: "3 weeks ago" },
      { name: "Rachel Green", rating: 4, comment: "Good value and quality. The adjustable feature saves so much space. Only minor issue is they're a bit heavy to move around.", date: "1 month ago" }
    ]
  },
  {
    id: 6,
    title: "Training Gloves",
    price: 19.99,
    cost: 9.50,
    img: "s6.png",
    category: "Clothing",
    sellerName: "Active Wear Hub",
    desc: "Protect your hands and enhance your grip with our premium Training Gloves. Made from breathable mesh fabric with reinforced padding in high-wear areas, these gloves prevent blisters and calluses while providing superior grip during weightlifting and cross-training. The flexible design allows for natural hand movement and finger dexterity. Features include padded palms for comfort, adjustable wrist straps for secure fit, and moisture-wicking material to keep hands dry during intense workouts. The seamless construction reduces chafing and irritation. Perfect for gym workouts, CrossFit, powerlifting, and general strength training. Available in multiple sizes to ensure the perfect fit. Machine washable for easy maintenance.",
    sold: 1890,
    rating: 4.3,
    reviews: 760,
    gallery: ["p6.svg.jpg", "p6.svg.jpg", "p6.svg.jpg"],
    reviewList: [
      { name: "Thomas Wright", rating: 4, comment: "Good gloves for the price. The padding protects my hands well and they're breathable. Fit is true to size.", date: "1 week ago" },
      { name: "Laura Martinez", rating: 3, comment: "Decent gloves but the grip could be better. They're comfortable and prevent blisters though. Worth the money.", date: "2 weeks ago" },
      { name: "Brian Foster", rating: 5, comment: "Best training gloves I've used! The grip is excellent and they're very durable. No more calluses on my hands.", date: "3 days ago" },
      { name: "Sandra Phillips", rating: 4, comment: "Comfortable and well-made. The wrist straps provide good support. Great for weightlifting sessions.", date: "1 month ago" }
    ]
  },
  {
    id: 7,
    title: "Protein Shaker Bottle",
    price: 12.99,
    cost: 5.50,
    img: "s1.png",
    category: "Accessories",
    sellerName: "Nutrition Essentials",
    desc: "Mix your protein shakes and supplements perfectly with our leak-proof Protein Shaker Bottle. Features a unique mixing ball that creates a smooth, clump-free consistency every time. The 700ml capacity is ideal for post-workout shakes and meal replacements. Made from BPA-free Tritan plastic that's odor-resistant and won't retain flavors from previous uses. The secure screw-top lid with flip cap ensures no leaks or spills, even when shaken vigorously. The bottle is dishwasher safe and easy to clean. Clear measurement markings on the side help you track your liquid intake. The ergonomic design fits comfortably in gym bags and cup holders. Perfect for athletes, fitness enthusiasts, and anyone leading an active lifestyle who needs convenient nutrition on the go.",
    sold: 2200,
    rating: 4.9,
    reviews: 1540,
    gallery: ["p7.svg.jpg", "p7.svg.jpg", "p7.svg.jpg"],
    reviewList: [
      { name: "Jason Mitchell", rating: 5, comment: "Perfect shaker bottle! The mixing ball works great - no clumps at all. Leak-proof and easy to clean. Best one I've owned!", date: "4 days ago" },
      { name: "Ashley Turner", rating: 5, comment: "Love this bottle! It's completely leak-proof and the mixing ball creates perfectly smooth shakes. Great value!", date: "1 week ago" },
      { name: "Brandon Scott", rating: 4, comment: "Good quality shaker. The BPA-free material is a plus. The mixing ball does its job well. Very satisfied!", date: "2 weeks ago" },
      { name: "Melissa Hall", rating: 5, comment: "Excellent bottle! No leaks, easy to clean, and the capacity is perfect. The mixing ball is a game-changer.", date: "3 days ago" },
      { name: "Justin Baker", rating: 5, comment: "Best protein shaker I've used. The mixing is perfect every time and it's very durable. Highly recommend!", date: "1 month ago" }
    ]
  },
  {
    id: 8,
    title: "Compression Shorts",
    price: 29.99,
    cost: 15.00,
    img: "p8.svg.jpg",
    category: "Clothing",
    sellerName: "Active Wear Hub",
    desc: "Experience enhanced performance and comfort with our high-performance Compression Shorts. Made from premium moisture-wicking fabric that pulls sweat away from your skin, keeping you dry and comfortable during intense workouts. The targeted compression zones provide muscle support, reduce fatigue, and improve blood circulation for faster recovery. The four-way stretch material offers unrestricted movement while maintaining shape and support. Features include a wide elastic waistband with drawstring for secure fit, flatlock seams to prevent chafing, and UPF 50+ sun protection for outdoor activities. Perfect for running, cycling, gym workouts, and sports. The breathable fabric regulates body temperature, and the antimicrobial treatment prevents odor buildup. Available in multiple sizes and colors.",
    sold: 740,
    rating: 4.4,
    reviews: 510,
    gallery: ["p8.svg.jpg", "p8.svg.jpg", "p8.svg.jpg"],
    reviewList: [
      { name: "Eric Nelson", rating: 4, comment: "Great compression shorts! The moisture-wicking works well and they're very comfortable. Good fit and quality.", date: "1 week ago" },
      { name: "Kimberly Carter", rating: 5, comment: "Love these shorts! Perfect compression and they stay in place during workouts. The fabric is high quality.", date: "2 weeks ago" },
      { name: "Andrew Hill", rating: 4, comment: "Good compression shorts for the price. Comfortable and breathable. The fit is true to size. Recommended!", date: "5 days ago" },
      { name: "Stephanie Reed", rating: 4, comment: "Comfortable and well-made. The compression feels good and they're great for running. Good value!", date: "3 weeks ago" }
    ]
  },
  {
    id: 9,
    title: "Foam Roller Set",
    price: 34.99,
    cost: 18.00,
    img: "s4.png",
    category: "Accessories",
    sellerName: "Recovery Pro Shop",
    desc: "Recover faster and improve flexibility with our Professional Foam Roller Set, featuring three different densities to target various muscle groups and recovery needs. The set includes a soft roller for gentle recovery and beginners, a medium-density roller for regular use and moderate muscle tension, and a firm roller with textured surface for deep tissue work and advanced users. Made from high-density EPP foam that's durable and won't flatten over time. The textured surface on the firm roller provides additional massage benefits, breaking up knots and improving circulation. Perfect for myofascial release, reducing muscle soreness, improving flexibility, and enhancing recovery after workouts. Lightweight and portable, these rollers are ideal for home use, gyms, physical therapy, and travel. Use before workouts to warm up muscles or after to aid recovery.",
    sold: 1120,
    rating: 4.6,
    reviews: 890,
    gallery: ["p1.svg.jpg", "p1.svg.jpg", "p1.svg.jpg"],
    reviewList: [
      { name: "Matthew Cooper", rating: 5, comment: "Excellent set! The three different densities are perfect for different needs. The textured roller is great for deep tissue work.", date: "1 week ago" },
      { name: "Angela Rivera", rating: 4, comment: "Great foam rollers! They're durable and the different densities are very useful. Perfect for post-workout recovery.", date: "2 weeks ago" },
      { name: "Joshua Ward", rating: 5, comment: "Best foam roller set I've purchased. The quality is excellent and they haven't flattened after months of use. Highly recommend!", date: "3 weeks ago" },
      { name: "Rebecca Torres", rating: 4, comment: "Good value for three rollers. The soft one is perfect for beginners. The firm textured one is great for advanced users.", date: "1 month ago" }
    ]
  },
  {
    id: 10,
    title: "Pull-Up Bar Doorway",
    price: 49.99,
    cost: 28.00,
    img: "s3.png",
    category: "Equipment",
    sellerName: "Home Gym Experts",
    desc: "Build upper body strength at home with our Heavy-Duty Doorway Pull-Up Bar. This versatile bar requires no drilling, screws, or permanent installation - simply mount it securely in any standard doorway frame. The adjustable width accommodates doorways from 24 to 36 inches wide. The ergonomic grip design with multiple hand positions allows for various pull-up styles including wide grip, narrow grip, and chin-ups. Made from high-strength steel with a weight capacity of 300 pounds, ensuring safety and durability. The padded grips protect your hands and provide comfortable, non-slip surfaces. Perfect for pull-ups, chin-ups, leg raises, and hanging exercises. Compact design stores easily when not in use. Ideal for home gyms, apartments, and anyone looking to add upper body strength training without taking up floor space.",
    sold: 680,
    rating: 4.5,
    reviews: 520,
    gallery: ["p2.svg.jpg", "p2.svg.jpg", "p2.svg.jpg"],
    reviewList: [
      { name: "Timothy Collins", rating: 5, comment: "Perfect pull-up bar! Easy to install, no drilling needed. Very sturdy and the padded grips are comfortable. Great for home workouts!", date: "1 week ago" },
      { name: "Christina Bell", rating: 4, comment: "Good quality bar. The adjustable width fits my doorway perfectly. The grip is comfortable and it feels very secure.", date: "2 weeks ago" },
      { name: "Nathan Powell", rating: 5, comment: "Excellent pull-up bar! The installation is simple and it's very stable. The weight capacity is more than enough. Highly recommend!", date: "3 days ago" },
      { name: "Deborah Long", rating: 4, comment: "Great bar for the price. Easy to set up and remove. The multiple grip positions are very useful. Good value!", date: "1 month ago" }
    ]
  },
  {
    id: 11,
    title: "Wireless Earbuds Sport",
    price: 79.99,
    cost: 45.00,
    img: "s2.png",
    category: "Wearables",
    sellerName: "TechFit Solutions",
    desc: "Stay motivated during workouts with our Wireless Earbuds Sport, designed specifically for active lifestyles. Featuring IPX7 waterproof rating, these earbuds are completely sweat-proof and can withstand heavy rain, making them perfect for intense training sessions and outdoor activities. The secure-fit design with multiple ear tip sizes ensures they stay in place during running, jumping, and high-intensity movements. Advanced Bluetooth 5.0 technology provides stable connectivity and low latency for seamless audio streaming. Enjoy up to 8 hours of playtime on a single charge, with an additional 24 hours from the compact charging case. Crystal-clear sound quality with deep bass and balanced treble enhances your music experience. Touch controls allow you to play, pause, skip tracks, and answer calls without reaching for your phone. The built-in microphone enables hands-free calls. Perfect for gym workouts, running, cycling, and any active pursuit.",
    sold: 1950,
    rating: 4.7,
    reviews: 1420,
    gallery: ["p3.svg.jpg", "p3.svg.jpg", "p3.svg.jpg"],
    reviewList: [
      { name: "Kenneth Patterson", rating: 5, comment: "Amazing earbuds! The sound quality is excellent and they stay in place during intense workouts. The waterproof feature is a huge plus!", date: "4 days ago" },
      { name: "Sharon Hughes", rating: 4, comment: "Great earbuds for workouts. The battery life is impressive and the fit is secure. Sound quality is good for the price.", date: "1 week ago" },
      { name: "Gregory Flores", rating: 5, comment: "Best sport earbuds I've owned! They never fall out and the sound is crystal clear. The charging case is convenient.", date: "2 weeks ago" },
      { name: "Carolyn Butler", rating: 4, comment: "Very satisfied with these earbuds. The waterproof rating gives me peace of mind during sweaty workouts. Good value!", date: "3 weeks ago" },
      { name: "Ralph Simmons", rating: 5, comment: "Excellent earbuds! The Bluetooth connection is stable and the touch controls work perfectly. Highly recommend for athletes!", date: "1 month ago" }
    ]
  },
  {
    id: 12,
    title: "Kettlebell Set 3-Piece",
    price: 89.99,
    cost: 55.00,
    img: "s5.png",
    category: "Equipment",
    sellerName: "Strength Gear Co",
    desc: "Build functional strength and improve cardiovascular fitness with our Professional Kettlebell Set. This comprehensive 3-piece set includes 8kg, 12kg, and 16kg kettlebells, providing progressive resistance for users of all fitness levels. Made from high-quality cast iron with a durable powder-coated finish that prevents rust and provides a secure grip. The uniform size design ensures consistent form and technique across all weights. The wide handle allows for comfortable two-handed grips and various exercise positions. Perfect for swings, squats, presses, Turkish get-ups, and hundreds of other functional movements. Kettlebells provide a full-body workout that builds strength, improves cardiovascular fitness, enhances flexibility, and develops core stability. The compact design takes up minimal space, making them ideal for home gyms. Includes a workout guide with exercise instructions and training programs to help you get started.",
    sold: 450,
    rating: 4.8,
    reviews: 380,
    gallery: ["p4.svg.jpg", "p4.svg.jpg", "p4.svg.jpg"],
    reviewList: [
      { name: "Benjamin Russell", rating: 5, comment: "Excellent kettlebell set! The three weights are perfect for progression. The quality is outstanding and they feel great to use.", date: "1 week ago" },
      { name: "Martha Diaz", rating: 4, comment: "Great set for home workouts. The weights are well-made and the powder coating prevents rust. Good value for three kettlebells.", date: "2 weeks ago" },
      { name: "Frank Hayes", rating: 5, comment: "Best kettlebells I've used! The grip is comfortable and the uniform size makes transitions smooth. Highly recommend!", date: "3 days ago" },
      { name: "Janet Price", rating: 4, comment: "Good quality set. The workout guide is helpful for beginners. The three weights cover all my training needs. Very satisfied!", date: "1 month ago" }
    ]
  }
];
const CATEGORIES = ["All", "Equipment", "Accessories", "Wearables", "Clothing"];