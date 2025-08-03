// Test listings data for development/demo purposes only
// This file is imported by insertTestListings.js


const listingsData = [
  {
    listing: {
      listing_type: 'villa', ownership_type: 'leasehold', location: 'Canggu',
      bedrooms: 3, bathrooms: 3, land_size_sqm: 300, building_size_sqm: 250, status: 'for_sale',
      price: 4500000000,
      year_built: 2022
    },
    images: [
      { url: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg', alt_text: 'Modern villa exterior' },
      { url: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg', alt_text: 'Spacious living room' }
    ],
    features: ['private_pool', 'fully_furnished', 'enclosed_living_room', 'security'],
    translations: [
      {
        language_code: 'en',
        title: 'Stunning Leasehold Villa in the Heart of Canggu',
        description: 'A beautiful 3-bedroom villa with a modern design, private pool, and lush garden. Located just minutes from the famous beaches and cafes of Canggu. 25-year leasehold.'
      },
      {
        language_code: 'id',
        title: 'Vila Hak Sewa Menakjubkan di Pusat Canggu',
        description: 'Vila 3 kamar tidur yang indah dengan desain modern, kolam renang pribadi, dan taman hijau. Terletak hanya beberapa menit dari pantai dan kafe terkenal di Canggu. Hak sewa 25 tahun.'
      },
      {
        language_code: 'es',
        title: 'Impresionante Villa en Arrendamiento en el Corazón de Canggu',
        description: 'Una hermosa villa de 3 habitaciones con diseño moderno, piscina privada y jardín exuberante. Ubicada a minutos de las famosas playas y cafeterías de Canggu. Arrendamiento por 25 años.'
      }
    ]
  },
  {
    listing: {
      listing_type: 'house', ownership_type: 'leasehold', location: 'Seminyak',
      bedrooms: 2, bathrooms: 2, land_size_sqm: 150, building_size_sqm: 120, status: 'for_rent',
      price: 250000000,
      year_built: 2018
    },
    images: [{ url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', alt_text: 'Cozy house exterior' }],
    features: ['fully_furnished', 'security'],
    translations: [
      {
        language_code: 'en',
        title: 'Cozy 2-Bedroom House for Yearly Rent in Seminyak',
        description: 'Charming and fully furnished house available for yearly rental. Features a small garden and a quiet neighborhood, walking distance to shops and restaurants.'
      },
      {
        language_code: 'id',
        title: 'Rumah Nyaman 2 Kamar untuk Sewa Tahunan di Seminyak',
        description: 'Rumah menawan dan lengkap dengan furnitur tersedia untuk sewa tahunan. Memiliki taman kecil dan lingkungan yang tenang, dekat dengan toko dan restoran.'
      },
      {
        language_code: 'es',
        title: 'Acogedora Casa de 2 Habitaciones para Alquiler Anual en Seminyak',
        description: 'Casa encantadora y completamente amueblada disponible para alquiler anual. Cuenta con un pequeño jardín y un vecindario tranquilo, a poca distancia de tiendas y restaurantes.'
      }
    ]
  },
  {
    listing: {
      listing_type: 'land', ownership_type: 'freehold', location: 'Ubud',
      bedrooms: 0, bathrooms: 0, land_size_sqm: 1000, building_size_sqm: null, status: 'for_sale',
      price: 2500000000,
      year_built: null
    },
    images: [{ url: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg', alt_text: 'Lush green land with rice paddies' }],
    features: ['rice_field_view', 'garden'],
    translations: [
      {
        language_code: 'en',
        title: 'Prime Freehold Land with Rice Field View in Ubud',
        description: '[EN] Translation missing. Please provide English.'
      },
      {
        language_code: 'id',
        title: 'Tanah Hak Milik Utama dengan Pemandangan Sawah di Ubud',
        description: 'Kesempatan langka untuk memiliki sebidang tanah indah dengan pemandangan sawah yang menakjubkan dan terlindungi. Cocok untuk membangun rumah impian atau retret yoga. Total 1000 m2 (10 are).'
      },
      {
        language_code: 'es',
        title: 'Terreno Principal en Propiedad con Vista a los Arrozales en Ubud',
        description: 'Una oportunidad única para poseer un hermoso terreno con impresionantes vistas protegidas a los arrozales. Perfecto para construir la casa de tus sueños o un retiro de yoga. Total 1000 m2 (10 are).' 
      }
    ]
  },
  {
    listing: {
      listing_type: 'villa', ownership_type: 'freehold', location: 'Uluwatu',
      bedrooms: 4, bathrooms: 5, land_size_sqm: 500, building_size_sqm: 450, status: 'for_sale',
      price: 15000000000,
      year_built: 2023
    },
    images: [
      { url: 'https://images.pexels.com/photos/261146/pexels-photo-261146.jpeg', alt_text: 'Villa exterior view with pool' },
      { url: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg', alt_text: 'Master bedroom with ocean view' }
    ],
    features: ['ocean_view', 'private_pool', 'fully_furnished', 'enclosed_living_room']
      ,
    translations: [
      {
        language_code: 'en',
        title: 'Magnificent Tropical-Modern Villa with Ocean View in Uluwatu',
        description: '[EN] Translation missing. Please provide English.'
      },
      {
        language_code: 'id',
        title: 'Vila Tropis-Modern Megah dengan Pemandangan Laut di Uluwatu',
        description: 'Vila menakjubkan dengan pemandangan laut yang memukau, sempurna untuk liburan mewah atau investasi tinggi. Fasilitas ruang tamu terbuka, kolam renang infinity pribadi, dan fasilitas modern.'
      },
      {
        language_code: 'es',
        title: 'Magnífica Villa Tropical-Moderna con Vista al Océano en Uluwatu',
        description: 'Una villa impresionante con vistas al océano, perfecta para una escapada lujosa o una inversión de alto rendimiento. Cuenta con sala de estar de planta abierta, piscina infinita privada y comodidades de última generación.'
      }
    ]
  },
    {
    listing: {
      listing_type: 'villa', ownership_type: 'leasehold', location: 'Pererenan',
      bedrooms: 2, bathrooms: 2, land_size_sqm: 180, building_size_sqm: 150, status: 'off_plan',
      price: 3200000000,
      year_built: 2025
    },
    images: [{ url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg', alt_text: 'Architectural rendering of the villa' }],
    features: ['private_pool', 'open_living_room'],
    translations: [
      {
        language_code: 'en',
        title: 'Modern Off-Plan Villa in Pererenan',
        description: '[EN] Translation missing. Please provide English.'
      },
      {
        language_code: 'id',
        title: 'Vila Modern Off-Plan di Pererenan',
        description: 'Peluang investasi menarik untuk vila off-plan di area Pererenan yang sedang naik daun. Dijadwalkan selesai Q4 2025. Hak sewa 30 tahun.'
      },
      {
        language_code: 'es',
        title: 'Villa Moderna en Proyecto en Pererenan',
        description: 'Oportunidad de inversión para una villa en proyecto en la zona emergente de Pererenan. Programada para completarse en el cuarto trimestre de 2025. Arrendamiento por 30 años.'
      }
    ]
  },
  {
    listing: {
      listing_type: 'apartment', ownership_type: 'leasehold', location: 'Denpasar',
      bedrooms: 1, bathrooms: 1, land_size_sqm: 0, building_size_sqm: 45, status: 'for_rent',
      price: 80000000,
      year_built: 2020
    },
    images: [{ url: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg', alt_text: 'Clean apartment interior' }],
    features: ['security'],
    translations: [
      {
        language_code: 'en',
        title: 'Simple 1-Bedroom Apartment in Denpasar',
        description: '[EN] Translation missing. Please provide English.'
      },
      {
        language_code: 'id',
        title: 'Apartemen 1 Kamar Sederhana di Denpasar',
        description: 'Apartemen bersih dan praktis untuk disewa di lokasi pusat Denpasar. Ideal untuk profesional tunggal atau pasangan. Termasuk perabotan dasar.'
      },
      {
        language_code: 'es',
        title: 'Apartamento Simple de 1 Habitación en Denpasar',
        description: 'Un apartamento limpio y práctico para alquilar en una ubicación céntrica de Denpasar. Ideal para un profesional solo o una pareja. Incluye mobiliario básico.'
      }
    ]
  },
  {
    listing: {
      listing_type: 'villa', ownership_type: 'freehold', location: 'Nusa Dua',
      bedrooms: 6, bathrooms: 7, land_size_sqm: 2000, building_size_sqm: 1500, status: 'for_sale',
      price: 75000000000,
      year_built: 2019
    },
    images: [{ url: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg', alt_text: 'Luxury villa on the beach' }],
    features: ['beach_front', 'ocean_view', 'private_pool', 'fully_furnished', 'security'],
    translations: [
      {
        language_code: 'en',
        title: 'Luxury Beachfront Villa in Nusa Dua',
        description: '[EN] Translation missing. Please provide English.'
      },
      {
        language_code: 'id',
        title: 'Vila Mewah Tepi Pantai di Nusa Dua',
        description: 'Puncak kemewahan. Vila hak milik 6 kamar tidur yang luas di pasir putih Nusa Dua, menawarkan pemandangan laut yang tak tertandingi dan fasilitas bintang 5.'
      },
      {
        language_code: 'es',
        title: 'Villa de Lujo Frente a la Playa en Nusa Dua',
        description: 'La cima del lujo. Esta amplia villa de 6 habitaciones frente a la playa de Nusa Dua ofrece vistas al mar incomparables y comodidades de 5 estrellas.'
      }
    ]
  },
  {
    listing: {
      listing_type: 'house', ownership_type: 'freehold', location: 'Tabanan',
      bedrooms: 3, bathrooms: 2, land_size_sqm: 800, building_size_sqm: 200, status: 'for_sale',
      price: 5000000000,
      year_built: 2010
    },
    images: [{ url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', alt_text: 'Traditional wooden house' }],
    features: ['rice_field_view', 'open_living_room'],
    translations: [
      {
        language_code: 'en',
        title: 'Traditional Javanese Joglo House in Tabanan',
        description: '[EN] Translation missing. Please provide English.'
      },
      {
        language_code: 'id',
        title: 'Rumah Joglo Jawa Tradisional di Tabanan',
        description: 'Rumah gaya Joglo yang unik dan otentik dengan pemandangan sawah yang tenang. Properti hak milik ini menawarkan tempat peristirahatan damai jauh dari keramaian.'
      },
      {
        language_code: 'es',
        title: 'Casa Joglo Tradicional de Java en Tabanan',
        description: 'Una casa de estilo Joglo única y auténtica con vistas tranquilas a los arrozales. Esta propiedad en propiedad ofrece un retiro pacífico lejos del bullicio.'
      }
    ]
  },
  {
    listing: {
      listing_type: 'land', ownership_type: 'leasehold', location: 'Jimbaran',
      bedrooms: 0, bathrooms: 0, land_size_sqm: 200, building_size_sqm: null, status: 'for_sale',
      price: 500000000,
      year_built: null
    },
    images: [{ url: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg', alt_text: 'Empty plot of land' }],
    features: [],
    translations: [
      {
        language_code: 'en',
        title: 'Leasehold Land 2 Are (200m2) in Jimbaran',
        description: '[EN] Translation missing. Please provide English.'
      },
      {
        language_code: 'id',
        title: 'Tanah Hak Sewa 2 Are (200m2) di Jimbaran',
        description: 'Sebidang tanah kecil di area perumahan Jimbaran. Ideal untuk membangun rumah kecil. Hak sewa 15 tahun dengan opsi perpanjangan.'
      },
      {
        language_code: 'es',
        title: 'Terreno de Arrendamiento de 2 Are (200m2) en Jimbaran',
        description: 'Un pequeño terreno en una zona residencial de Jimbaran. Ideal para construir una casa pequeña. Arrendamiento por 15 años con opciones de extensión.'
      }
    ]
  },
  {
    listing: {
      listing_type: 'villa', ownership_type: 'leasehold', location: 'Seminyak',
      bedrooms: 2, bathrooms: 2, land_size_sqm: 200, building_size_sqm: 180, status: 'sold',
      price: null,
      year_built: 2019
    },
    images: [{ url: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg', alt_text: 'Villa with a sold sign' }],
    features: ['private_pool', 'fully_furnished'],
    translations: [
      {
        language_code: 'en',
        title: 'Stylish 2-Bedroom Villa in Seminyak',
        description: '[EN] Translation missing. Please provide English.'
      },
      {
        language_code: 'id',
        title: 'Vila 2 Kamar Bergaya di Seminyak',
        description: 'Vila 2 kamar tidur bergaya di lokasi utama Seminyak. Ditawarkan dengan hak sewa 20 tahun.'
      },
      {
        language_code: 'es',
        title: 'Villa Estilosa de 2 Habitaciones en Seminyak',
        description: 'Una villa elegante de 2 habitaciones en una ubicación privilegiada de Seminyak. Se ofreció con arrendamiento de 20 años.'
      }
    ]
  },
  {
    listing: {
      listing_type: 'house', ownership_type: 'freehold', location: 'Sanur',
      bedrooms: 4, bathrooms: 3, land_size_sqm: 400, building_size_sqm: 300, status: 'for_sale',
      price: 8000000000,
      year_built: 2005
    },
    images: [{ url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', alt_text: 'Modern renovated house' }],
    features: ['enclosed_living_room', 'security'],
    translations: [
      {
        language_code: 'en',
        title: 'Newly Renovated Family Home in Sanur',
        description: '[EN] Translation missing. Please provide English.'
      },
      {
        language_code: 'id',
        title: 'Rumah Keluarga Baru Renovasi di Sanur',
        description: 'Rumah hak milik 4 kamar tidur yang baru direnovasi di area ramah keluarga Sanur. Dapur dan kamar mandi modern, dengan taman luas.'
      },
      {
        language_code: 'es',
        title: 'Casa Familiar Recién Renovada en Sanur',
        description: 'Una casa de 4 habitaciones recién renovada en la zona familiar de Sanur. Cocina y baños modernos, con un jardín espacioso.'
      }
    ]
  },
  {
    listing: {
      listing_type: 'land', ownership_type: 'freehold', location: 'Uluwatu',
      bedrooms: 0, bathrooms: 0, land_size_sqm: 5000, building_size_sqm: null, status: 'for_sale',
      price: 30000000,
      year_built: null
    },
    images: [{ url: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg', alt_text: 'Dramatic cliff overlooking the ocean' }],
    features: ['cliff-front', 'ocean_view'],
    translations: [
      {
        language_code: 'en',
        title: 'Spectacular Freehold Cliff-Front Land in Uluwatu',
        description: '[EN] Translation missing. Please provide English.'
      },
      {
        language_code: 'id',
        title: 'Tanah Hak Milik Spektakuler di Tepi Tebing Uluwatu',
        description: 'Kesempatan sekali seumur hidup untuk memiliki 50 are (5000 m2) tanah tepi tebing di Uluwatu, dengan pemandangan laut matahari terbenam yang panoramik.'
      },
      {
        language_code: 'es',
        title: 'Terreno Espectacular Frente al Acantilado en Uluwatu',
        description: 'Una oportunidad única para adquirir 50 are (5000 m2) de terreno frente al acantilado en Uluwatu, con vistas panorámicas al mar y atardeceres.'
      }
    ]
  },
  {
    listing: {
      listing_type: 'villa', ownership_type: 'leasehold', location: 'Berawa',
      bedrooms: 1, bathrooms: 1, land_size_sqm: 80, building_size_sqm: 70, status: 'for_rent',
      price: 35000000,
      year_built: 2021
    },
    images: [{ url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg', alt_text: 'Compact modern villa with plunge pool' }],
    features: ['private_pool', 'fully_furnished', 'enclosed_living_room'],
    translations: [
      {
        language_code: 'en',
        title: 'Modern 1-Bedroom Villa for Monthly Rent in Berawa',
        description: '[EN] Translation missing. Please provide English.'
      },
      {
        language_code: 'id',
        title: 'Vila 1 Kamar Modern untuk Sewa Bulanan di Berawa',
        description: 'Sempurna untuk digital nomad. Vila 1 kamar tidur bergaya dan kompak dengan kolam rendam, tersedia untuk sewa bulanan. Termasuk internet berkecepatan tinggi.'
      },
      {
        language_code: 'es',
        title: 'Villa Moderna de 1 Habitación para Alquiler Mensual en Berawa',
        description: 'Perfecta para nómadas digitales. Una villa moderna y compacta de 1 habitación con piscina pequeña, disponible para alquiler mensual. Internet de alta velocidad incluido.'
      }
    ]
  }
];

module.exports = listingsData;
