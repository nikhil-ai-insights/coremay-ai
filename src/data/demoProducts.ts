import { Product } from '../types';

export const INITIAL_DEMO_PRODUCTS: Product[] = [
  // Electronics
  {
    id: 'prod_elec_001',
    name: 'Coremay Aura Pro Wireless ANC Headphones',
    category: 'Electronics',
    price: 4999,
    discountPrice: 3999,
    stock: 24,
    description: 'Flagship active noise-cancelling wireless headphones with 40mm beryllium drivers, spatial audio, and ultra-low latency.',
    features: [
      'Hybrid Active Noise Cancellation (42dB reduction)',
      '50-Hour Battery Life with Fast Charge (10m = 5h)',
      'Bluetooth 5.3 with Multipoint Dual Device Connect',
      'Transparency Mode & AI Wind-Noise Reduction Mics'
    ],
    rating: 4.8,
    reviewsCount: 342,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    tags: ['bestseller', 'wireless', 'anc', 'audio'],
    frequentlyBoughtWith: ['prod_acc_003', 'prod_acc_001'],
    badge: 'Bestseller'
  },
  {
    id: 'prod_elec_002',
    name: 'Vortex Quantum Ultra 5G Smartphone',
    category: 'Electronics',
    price: 34999,
    discountPrice: 29999,
    stock: 15,
    description: 'Cutting-edge Android smartphone with 120Hz Super AMOLED display, 108MP OIS AI camera system, and 67W Turbo charging.',
    features: [
      '6.7-inch 120Hz FHD+ Super AMOLED Display',
      '108MP AI Triple Camera with 4K 60FPS Video',
      '5000mAh Battery with 67W Turbo Charger in Box',
      'Octa-Core 4nm 5G Processor with Liquid Cooling'
    ],
    rating: 4.7,
    reviewsCount: 218,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    tags: ['5G', 'smartphone', 'flagship', 'camera'],
    frequentlyBoughtWith: ['prod_acc_001', 'prod_elec_004'],
    badge: 'Featured'
  },
  {
    id: 'prod_elec_003',
    name: 'AeroBook Pro M3 14" Creator Laptop',
    category: 'Electronics',
    price: 68999,
    discountPrice: 62999,
    stock: 11,
    description: 'Ultra-thin, featherlight performance laptop for students, developers, and creators. Features a razor-sharp 2.8K OLED display.',
    features: [
      '14-inch 2.8K 100% DCI-P3 Anti-Glare OLED Panel',
      '16GB LPDDR5X RAM & 1TB PCIe Gen4 SSD',
      'Backlit Ergonomic Keyboard with Precision Trackpad',
      'All-Day 14-Hour Battery with 100W USB-C PD Charging'
    ],
    rating: 4.9,
    reviewsCount: 189,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
    tags: ['laptop', 'ultrabook', 'creator', 'oled'],
    frequentlyBoughtWith: ['prod_acc_002', 'prod_acc_003'],
    badge: 'Top Rated'
  },
  {
    id: 'prod_elec_004',
    name: 'Titan Horizon Smartwatch Series 7',
    category: 'Electronics',
    price: 3499,
    discountPrice: 2799,
    stock: 38,
    description: 'All-in-one fitness and lifestyle smartwatch with continuous SpO2, ECG monitor, AMOLED always-on display, and Bluetooth calling.',
    features: [
      '1.43" AMOLED Always-On Curved Display (1000 nits)',
      '120+ Sports Modes & GPS Route Tracking',
      'Bluetooth Calling with HD Speaker & Microphone',
      'IP68 Water Resistance up to 50 Meters'
    ],
    rating: 4.6,
    reviewsCount: 450,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    tags: ['smartwatch', 'fitness', 'health', 'wearable'],
    frequentlyBoughtWith: ['prod_elec_001', 'prod_fash_001'],
    badge: 'Hot Deal'
  },
  {
    id: 'prod_elec_005',
    name: 'SonicPulse True Wireless ANC Earbuds',
    category: 'Electronics',
    price: 2499,
    discountPrice: 1899,
    stock: 50,
    description: 'Compact in-ear earbuds with punchy bass, dual mic environmental noise cancellation, and ergonomic sweat-proof fit.',
    features: [
      '10mm Dynamic Bass Boost Drivers',
      '32-Hour Combined Playback with Case',
      'Touch Controls with Low Latency Gaming Mode (45ms)',
      'IPX5 Splash and Sweat Proof Rating'
    ],
    rating: 4.5,
    reviewsCount: 512,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    tags: ['earbuds', 'audio', 'tws', 'portable'],
    frequentlyBoughtWith: ['prod_elec_002', 'prod_acc_001'],
    badge: 'Trending'
  },

  // Accessories
  {
    id: 'prod_acc_001',
    name: 'ArmorShield Magnetic Matte Phone Case',
    category: 'Accessories',
    price: 899,
    discountPrice: 599,
    stock: 80,
    description: 'Military-grade drop-tested matte case with built-in neodymium magnetic ring for fast wireless charging and car mounts.',
    features: [
      '10ft Drop Protection with Air-Cushioned Corners',
      'Anti-Fingerprint Frosted Polycarbonate Backing',
      'Raised Camera & Screen Bezel Lip Protection',
      'Compatible with Magnetic Chargers & Wallets'
    ],
    rating: 4.6,
    reviewsCount: 165,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80',
    tags: ['case', 'protection', 'phone', 'magsafe'],
    frequentlyBoughtWith: ['prod_elec_002', 'prod_elec_005'],
    badge: 'Popular Add-on'
  },
  {
    id: 'prod_acc_002',
    name: 'Nomad Executive Waterproof Laptop Backpack',
    category: 'Accessories',
    price: 2999,
    discountPrice: 2299,
    stock: 32,
    description: 'Sleek waterproof 24L commuter backpack with padded compartment fitting up to 16" laptops, USB charging pass-through, and luggage strap.',
    features: [
      'Dedicated 16" Fleece-Lined Laptop Compartment',
      'Water-Repellent 900D Oxford Fabric with YKK Zippers',
      'External USB-A/C Charging Port with Hidden Cable',
      'Anti-Theft Secret Back Pocket for Passport & Wallet'
    ],
    rating: 4.8,
    reviewsCount: 290,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    tags: ['backpack', 'travel', 'laptop', 'waterproof'],
    frequentlyBoughtWith: ['prod_elec_003', 'prod_acc_003'],
    badge: 'Essential'
  },
  {
    id: 'prod_acc_003',
    name: 'GlideMaster Ergonomic Multi-Device Wireless Mouse',
    category: 'Accessories',
    price: 1699,
    discountPrice: 1299,
    stock: 45,
    description: 'Silent-click ergonomic wireless mouse with thumb rest, dual 2.4G/Bluetooth connectivity, and high precision 4000 DPI laser sensor.',
    features: [
      'Tri-Mode Connectivity: 2x Bluetooth 5.1 + 2.4G USB',
      '90% Silent Mechanical Click Switches',
      'Adjustable 800/1600/2400/4000 DPI Levels',
      'Rechargeable 500mAh Lithium Battery (60 days per charge)'
    ],
    rating: 4.7,
    reviewsCount: 380,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    tags: ['mouse', 'wireless', 'ergonomic', 'office'],
    frequentlyBoughtWith: ['prod_elec_003', 'prod_acc_002'],
    badge: 'Best Value'
  },
  {
    id: 'prod_acc_004',
    name: 'OmniCharge 65W GaN Fast Wall Charger 3-Port',
    category: 'Accessories',
    price: 1999,
    discountPrice: 1499,
    stock: 60,
    description: 'Compact Gallium Nitride (GaN) fast charger with 2x USB-C and 1x USB-A ports to charge laptops, tablets, and phones simultaneously.',
    features: [
      '65W High-Speed Output with Power Delivery 3.0',
      '50% Smaller than Traditional Silicon Brick Chargers',
      'Intelligent Power Allocation across 3 Devices',
      'Multi-Protection Overheat & Short-Circuit Safety'
    ],
    rating: 4.8,
    reviewsCount: 220,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    tags: ['charger', 'gan', 'usb-c', 'fast-charge'],
    frequentlyBoughtWith: ['prod_elec_002', 'prod_elec_003'],
    badge: 'Must Have'
  },

  // Fashion
  {
    id: 'prod_fash_001',
    name: 'UrbanStride Breathable Cloudknit Sneakers',
    category: 'Fashion',
    price: 3499,
    discountPrice: 2699,
    stock: 28,
    description: 'Ultra-cushioned running and lifestyle sneakers crafted with zero-waste knit fabric and responsive rebound memory foam soles.',
    features: [
      'Engineered Mesh Upper for Maximum Breathability',
      'Shock-Absorbing Memory Foam Insole with Arch Support',
      'Anti-Skid Textured Rubber Traction Outsole',
      'Lightweight Construction (240g per shoe)'
    ],
    rating: 4.7,
    reviewsCount: 198,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    tags: ['shoes', 'sneakers', 'running', 'comfort'],
    frequentlyBoughtWith: ['prod_fash_002', 'prod_elec_004'],
    badge: 'Top Pick'
  },
  {
    id: 'prod_fash_002',
    name: 'All-Weather ThermoShield Insulated Bomber Jacket',
    category: 'Fashion',
    price: 4499,
    discountPrice: 3499,
    stock: 19,
    description: 'Contemporary minimalist insulated jacket with windproof matte shell, thermal fleece lining, and concealed zipper compartments.',
    features: [
      'Water-Resistant DWR Coated Outer Shell',
      'Eco-Friendly Recycled Microfiber Insulation',
      'Ribbed Collar, Cuffs, and Hem for Snug Fit',
      'Deep Interior Media Pocket with Cord Routing'
    ],
    rating: 4.8,
    reviewsCount: 145,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    tags: ['jacket', 'bomber', 'winter', 'outerwear'],
    frequentlyBoughtWith: ['prod_fash_001', 'prod_acc_002'],
    badge: 'Premium'
  },
  {
    id: 'prod_fash_003',
    name: 'Minimalist Polarized Aerospace Sunglasses',
    category: 'Fashion',
    price: 1899,
    discountPrice: 1299,
    stock: 40,
    description: 'Featherlight stainless steel aviator sunglasses with UV400 polarized anti-glare lenses and scratch-resistant coating.',
    features: [
      '100% UV400 Polarized Triacetate Cellulose (TAC) Lenses',
      'Hypoallergenic Silicone Nose Pads for All-Day Comfort',
      'Shatter-Resistant Stainless Steel Frame Construction',
      'Includes Hard Protective Case and Microfiber Cloth'
    ],
    rating: 4.6,
    reviewsCount: 230,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    tags: ['sunglasses', 'polarized', 'eyewear', 'style'],
    frequentlyBoughtWith: ['prod_fash_002', 'prod_acc_001'],
    badge: 'Popular'
  },

  // Smart Home
  {
    id: 'prod_home_001',
    name: 'Lumina Smart Ambient RGBIC Lightbar Pair',
    category: 'Smart Home',
    price: 2799,
    discountPrice: 2199,
    stock: 22,
    description: 'Dynamic RGBIC LED lightbars with camera screen syncing, music rhythm visualizer, and Google Home/Alexa compatibility.',
    features: [
      '16 Million Colors with Independent Multi-Segment Control',
      'Built-in High-Sensitivity Sound Sensor for Audio Visualizer',
      'App Control with 40+ Pre-Set Dynamic Lighting Scenes',
      'Desk Stand & Monitor Back-Mount Accessories Included'
    ],
    rating: 4.7,
    reviewsCount: 175,
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80',
    tags: ['smart-home', 'rgb', 'lighting', 'desk-setup'],
    frequentlyBoughtWith: ['prod_acc_003', 'prod_elec_003'],
    badge: 'Desk Setup'
  },
  {
    id: 'prod_home_002',
    name: 'AeroPure Smart HEPA Air Purifier Mini',
    category: 'Smart Home',
    price: 3999,
    discountPrice: 3199,
    stock: 16,
    description: 'Whisper-quiet true HEPA H13 desktop air purifier that captures 99.97% of airborne dust, pollen, pet dander, and odors.',
    features: [
      'True HEPA H13 Filter + Activated Carbon Layer',
      'Quiet 22dB Sleep Mode with Essential Oil Aromatherapy Pad',
      'Real-Time PM2.5 Air Quality LED Indicator Ring',
      'Covers up to 250 sq ft with 360-Degree Air Intake'
    ],
    rating: 4.9,
    reviewsCount: 160,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80',
    tags: ['air-purifier', 'hepa', 'wellness', 'home'],
    frequentlyBoughtWith: ['prod_home_001', 'prod_acc_004'],
    badge: 'Wellness'
  }
];

export const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Accessories', 'Smart Home'] as const;
