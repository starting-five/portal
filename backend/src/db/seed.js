const { pool } = require('./index');

const listingsData = [
  {
    listing: {
      listing_type: 'villa', ownership_type: 'leasehold', location: 'Canggu',
      bedrooms: 3, bathrooms: 3, land_size_sqm: 300, building_size_sqm: 250, status: 'available_for_sale',
      price: 4500000000,
      year_built: 2022
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6', alt_text: 'Modern villa exterior' },
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811', alt_text: 'Spacious living room' }
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
      bedrooms: 2, bathrooms: 2, land_size_sqm: 150, building_size_sqm: 120, status: 'available_for_rent',
      price: 250000000,
      year_built: 2018
    },
    images: [{ url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', alt_text: 'Cozy house exterior' }],
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
      bedrooms: 0, bathrooms: 0, land_size_sqm: 1000, building_size_sqm: null, status: 'available_for_sale',
      price: 2500000000,
      year_built: null
    },
    images: [{ url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef', alt_text: 'Lush green land with rice paddies' }],
    features: ['rice_field_view', 'garden'],
    translations: [
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
      bedrooms: 4, bathrooms: 5, land_size_sqm: 500, building_size_sqm: 450, status: 'available_for_sale',
      price: 15000000000,
      year_built: 2023
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914', alt_text: 'Villa exterior view with pool' },
      { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6', alt_text: 'Master bedroom with ocean view' }
    ],
    features: ['ocean_view', 'private_pool', 'fully_furnished', 'enclosed_living_room']
      ,
      translations: [
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
    images: [{ url: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c', alt_text: 'Architectural rendering of the villa' }],
    features: ['private_pool', 'open_living_room'],
      translations: [
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
      bedrooms: 1, bathrooms: 1, land_size_sqm: 0, building_size_sqm: 45, status: 'available_for_rent',
      price: 80000000,
      year_built: 2020
    },
    images: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', alt_text: 'Clean apartment interior' }],
    features: ['security'],
    translations: [
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
      bedrooms: 6, bathrooms: 7, land_size_sqm: 2000, building_size_sqm: 1500, status: 'available_for_sale',
      price: 75000000000,
      year_built: 2019
    },
    images: [{ url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', alt_text: 'Luxury villa on the beach' }],
    features: ['beach_front', 'ocean_view', 'private_pool', 'fully_furnished', 'security'],
      translations: [
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
      bedrooms: 3, bathrooms: 2, land_size_sqm: 800, building_size_sqm: 200, status: 'available_for_sale',
      price: 5000000000,
      year_built: 2010
    },
    images: [{ url: 'https://images.unsplash.com/photo-1628744448848-3c6516f4b4a2', alt_text: 'Traditional wooden house' }],
    features: ['rice_field_view', 'open_living_room'],
      translations: [
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
      bedrooms: 0, bathrooms: 0, land_size_sqm: 200, building_size_sqm: null, status: 'available_for_sale',
      price: 500000000,
      year_built: null
    },
    images: [{ url: 'https://images.unsplash.com/photo-1599620582427-a9e2dba860ac', alt_text: 'Empty plot of land' }],
    features: [],
      translations: [
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
    images: [{ url: 'https://images.unsplash.com/photo-1576759391412-66b43b278633', alt_text: 'Villa with a sold sign' }],
    features: ['private_pool', 'fully_furnished'],
      translations: [
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
      bedrooms: 4, bathrooms: 3, land_size_sqm: 400, building_size_sqm: 300, status: 'available_for_sale',
      price: 8000000000,
      year_built: 2005
    },
    images: [{ url: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1', alt_text: 'Modern renovated house' }],
    features: ['enclosed_living_room', 'security'],
      translations: [
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
      bedrooms: 0, bathrooms: 0, land_size_sqm: 5000, building_size_sqm: null, status: 'available_for_sale',
      price: 30000000,
      year_built: null
    },
    images: [{ url: 'https://images.unsplash.com/photo-1517825738774-7de9363ef735', alt_text: 'Dramatic cliff overlooking the ocean' }],
    features: ['cliff-front', 'ocean_view'],
      translations: [
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
      bedrooms: 1, bathrooms: 1, land_size_sqm: 80, building_size_sqm: 70, status: 'available_for_rent',
      price: 35000000,
      year_built: 2021
    },
    images: [{ url: 'https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd', alt_text: 'Compact modern villa with plunge pool' }],
    features: ['private_pool', 'fully_furnished', 'enclosed_living_room'],
    translations: [
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

const seedDatabase = async () => {
  // Use a single client for the entire seeding process to run it as a transaction
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start transaction

    // 1. Clean existing data
    console.log('Resetting database tables...');
    await client.query('TRUNCATE listings, listing_images, features, listing_features, locations, listing_types, ownership_types, listing_statuses RESTART IDENTITY CASCADE;');
    console.log('-> Tables truncated.');

    // 2. Seed Locations
    console.log('Seeding locations...');
    const uniqueLocations = [...new Set(listingsData.map(item => item.listing.location))];
    for (const locationName of uniqueLocations) {
      await client.query(
        'INSERT INTO locations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [locationName]
      );
    }
    console.log('-> Locations seeded.');

    // 3. Fetch all locations into a map for easy lookup
    const allLocationsRes = await client.query('SELECT id, name FROM locations');
    const locationsMap = allLocationsRes.rows.reduce((acc, loc) => {
      acc[loc.name] = loc.id;
      return acc;
    }, {});


    // 3. Seed Lookup Tables (Types, Ownerships, Statuses)
    console.log('Seeding lookup tables...');
    // Listing types with translations
    const listingTypes = [
      {
        key: 'villa',
        translations: [
          { language_code: 'en', name: 'Villa' },
          { language_code: 'id', name: 'Vila' },
          { language_code: 'es', name: 'Villa' }
        ]
      },
      {
        key: 'house',
        translations: [
          { language_code: 'en', name: 'House' },
          { language_code: 'id', name: 'Rumah' },
          { language_code: 'es', name: 'Casa' }
        ]
      },
      {
        key: 'land',
        translations: [
          { language_code: 'en', name: 'Land' },
          { language_code: 'id', name: 'Tanah' },
          { language_code: 'es', name: 'Terreno' }
        ]
      },
      {
        key: 'apartment',
        translations: [
          { language_code: 'en', name: 'Apartment' },
          { language_code: 'id', name: 'Apartemen' },
          { language_code: 'es', name: 'Apartamento' }
        ]
      }
    ];
    const ownershipTypes = ['freehold', 'leasehold'];
    const listingStatuses = ['draft', 'available_for_sale', 'available_for_rent', 'off_plan', 'sold', 'rented', 'unavailable'];
    // Removed priceUnits and related seeding

    // Insert listing types and translations
    const listingTypesMap = {};
    for (const type of listingTypes) {
      const typeRes = await client.query('INSERT INTO listing_types DEFAULT VALUES RETURNING id');
      const typeId = typeRes.rows[0].id;
      for (const t of type.translations) {
        await client.query(
          'INSERT INTO listing_type_translations (listing_type_id, language_code, name) VALUES ($1, $2, $3)',
          [typeId, t.language_code, t.name]
        );
        if (t.language_code === 'en') {
          listingTypesMap[type.key] = typeId;
        }
      }
    }

    // Ownership types with translations

    // Ownership types with translations
    const ownershipTypesWithTranslations = [
      {
        key: 'freehold',
        translations: [
          { language_code: 'en', name: 'Freehold' },
          { language_code: 'id', name: 'Hak Milik' },
          { language_code: 'es', name: 'Propiedad absoluta' }
        ]
      },
      {
        key: 'leasehold',
        translations: [
          { language_code: 'en', name: 'Leasehold' },
          { language_code: 'id', name: 'Hak Sewa' },
          { language_code: 'es', name: 'Arrendamiento' }
        ]
      }
    ];

    // Insert ownership types and translations
    // Build ownershipTypesMap here
    const ownershipTypesMap = {};
    for (const type of ownershipTypesWithTranslations) {
      // Insert only the ID, no name column
      const typeRes = await client.query('INSERT INTO ownership_types DEFAULT VALUES RETURNING id');
      const typeId = typeRes.rows[0].id;
      for (const t of type.translations) {
        await client.query(
          'INSERT INTO ownership_type_translations (ownership_type_id, language_code, name) VALUES ($1, $2, $3) ON CONFLICT (ownership_type_id, language_code) DO UPDATE SET name = EXCLUDED.name',
          [typeId, t.language_code, t.name]
        );
        if (t.language_code === 'en') {
          ownershipTypesMap[type.key] = typeId;
        }
      }
    }

    // Listing statuses with keys and translations (best-practice order)
    const listingStatusesWithTranslations = [
      {
        key: 'for_sale',
        translations: [
          { language_code: 'en', name: 'For Sale' },
          { language_code: 'id', name: 'Dijual' },
          { language_code: 'es', name: 'En venta' }
        ]
      },
      {
        key: 'for_rent',
        translations: [
          { language_code: 'en', name: 'For Rent' },
          { language_code: 'id', name: 'Disewa' },
          { language_code: 'es', name: 'En alquiler' }
        ]
      },
      {
        key: 'off_plan',
        translations: [
          { language_code: 'en', name: 'Off Plan' },
          { language_code: 'id', name: 'Off Plan' },
          { language_code: 'es', name: 'Sobre plano' }
        ]
      },
      {
        key: 'sold',
        translations: [
          { language_code: 'en', name: 'Sold' },
          { language_code: 'id', name: 'Terjual' },
          { language_code: 'es', name: 'Vendido' }
        ]
      },
      {
        key: 'rented',
        translations: [
          { language_code: 'en', name: 'Rented' },
          { language_code: 'id', name: 'Tersewa' },
          { language_code: 'es', name: 'Alquilado' }
        ]
      },
      {
        key: 'draft',
        translations: [
          { language_code: 'en', name: 'Draft' },
          { language_code: 'id', name: 'Draft' },
          { language_code: 'es', name: 'Borrador' }
        ]
      },
      {
        key: 'archived',
        translations: [
          { language_code: 'en', name: 'Archived' },
          { language_code: 'id', name: 'Diarsipkan' },
          { language_code: 'es', name: 'Archivado' }
        ]
      },
      {
        key: 'deleted',
        translations: [
          { language_code: 'en', name: 'Deleted' },
          { language_code: 'id', name: 'Dihapus' },
          { language_code: 'es', name: 'Eliminado' }
        ]
      }
    ];

    // Insert listing statuses and translations
    const listingStatusesMap = {};
    for (const status of listingStatusesWithTranslations) {
      // Insert status key
      const statusRes = await client.query('INSERT INTO listing_statuses (key) VALUES ($1) RETURNING id', [status.key]);
      const statusId = statusRes.rows[0].id;
      for (const t of status.translations) {
        await client.query(
          'INSERT INTO listing_statuses_translations (listing_status_id, language_code, name) VALUES ($1, $2, $3) ON CONFLICT (listing_status_id, language_code) DO UPDATE SET name = EXCLUDED.name',
          [statusId, t.language_code, t.name]
        );
      }
      listingStatusesMap[status.key] = statusId;
    }
    console.log('-> Lookup tables seeded.');

    // 4. Fetch all lookup data into maps
    // listingTypesMap already built above
    // No need to rebuild ownershipTypesMap, already built above


    // listingStatusesMap already built above


    // Removed priceUnitsMap


    // 6. Seed Features (refactored for new schema and agreed data)
    console.log('Seeding feature categories and features...');
    // Define feature categories with keys and translations (including Spanish)
    const featureCategories = [
      { key: 'highlights', sort_order: 0, translations: [
        { language_code: 'en', name: 'Highlights' },
        { language_code: 'id', name: 'Unggulan' },
        { language_code: 'es', name: 'Destacados' }
      ] },
      { key: 'outdoor_leisure', sort_order: 1, translations: [
        { language_code: 'en', name: 'Outdoor & Leisure' },
        { language_code: 'id', name: 'Luar Ruangan & Rekreasi' },
        { language_code: 'es', name: 'Aire libre y ocio' }
      ] },
      { key: 'views_location', sort_order: 2, translations: [
        { language_code: 'en', name: 'Views & Location' },
        { language_code: 'id', name: 'Pemandangan & Lokasi' },
        { language_code: 'es', name: 'Vistas y ubicación' }
      ] },
      { key: 'security_access', sort_order: 3, translations: [
        { language_code: 'en', name: 'Security & Access' },
        { language_code: 'id', name: 'Keamanan & Akses' },
        { language_code: 'es', name: 'Seguridad y acceso' }
      ] },
      { key: 'living_comfort', sort_order: 4, translations: [
        { language_code: 'en', name: 'Living & Comfort' },
        { language_code: 'id', name: 'Kenyamanan' },
        { language_code: 'es', name: 'Comodidad y vida' }
      ] },
      { key: 'kitchen_dining', sort_order: 5, translations: [
        { language_code: 'en', name: 'Kitchen & Dining' },
        { language_code: 'id', name: 'Dapur & Ruang Makan' },
        { language_code: 'es', name: 'Cocina y comedor' }
      ] },
      { key: 'wellness_facilities', sort_order: 6, translations: [
        { language_code: 'en', name: 'Wellness & Facilities' },
        { language_code: 'id', name: 'Fasilitas' },
        { language_code: 'es', name: 'Bienestar y facilidades' }
      ] }
    ];

    // Insert feature categories and translations (assume feature_categories table exists)
    for (const category of featureCategories) {
      // Insert into feature_categories table (if not exists)
      await client.query(
        'INSERT INTO feature_categories (key, sort_order) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING',
        [category.key, category.sort_order]
      );
      for (const t of category.translations) {
        await client.query(
          'INSERT INTO feature_categories_translations (category_key, language_code, name) VALUES ($1, $2, $3) ON CONFLICT (category_key, language_code) DO UPDATE SET name = EXCLUDED.name',
          [category.key, t.language_code, t.name]
        );
      }
    }

    // Features data with category_key and Spanish translations
    const featuresData = [
      // Highlights (Primary Tags) - only special tags, not ownership/property types or views
      { key: 'hot_deal', category_key: 'highlights', sort_order: 1, translations: [
        { language_code: 'en', name: 'Hot Deal' },
        { language_code: 'id', name: 'Penawaran Menarik' },
        { language_code: 'es', name: 'Oferta especial' }
      ] },
      { key: 'new_listing', category_key: 'highlights', sort_order: 2, translations: [
        { language_code: 'en', name: 'New Listing' },
        { language_code: 'id', name: 'Listing Baru' },
        { language_code: 'es', name: 'Nuevo listado' }
      ] },
      { key: 'price_reduced', category_key: 'highlights', sort_order: 3, translations: [
        { language_code: 'en', name: 'Price Reduced' },
        { language_code: 'id', name: 'Harga Turun' },
        { language_code: 'es', name: 'Precio reducido' }
      ] },
      { key: 'investment_opportunity', category_key: 'highlights', sort_order: 4, translations: [
        { language_code: 'en', name: 'Investment Opportunity' },
        { language_code: 'id', name: 'Peluang Investasi' },
        { language_code: 'es', name: 'Oportunidad de inversión' }
      ] },

      // Outdoor & Leisure
      { key: 'private_pool', category_key: 'outdoor_leisure', sort_order: 1, translations: [
        { language_code: 'en', name: 'Private pool' },
        { language_code: 'id', name: 'Kolam renang pribadi' },
        { language_code: 'es', name: 'Piscina privada' }
      ] },
      { key: 'shared_pool', category_key: 'outdoor_leisure', sort_order: 2, translations: [
        { language_code: 'en', name: 'Shared pool' },
        { language_code: 'id', name: 'Kolam renang bersama' },
        { language_code: 'es', name: 'Piscina compartida' }
      ] },
      { key: 'garden', category_key: 'outdoor_leisure', sort_order: 3, translations: [
        { language_code: 'en', name: 'Garden' },
        { language_code: 'id', name: 'Taman' },
        { language_code: 'es', name: 'Jardín' }
      ] },
      { key: 'rooftop', category_key: 'outdoor_leisure', sort_order: 4, translations: [
        { language_code: 'en', name: 'Rooftop' },
        { language_code: 'id', name: 'Atap' },
        { language_code: 'es', name: 'Azotea' }
      ] },
      { key: 'balcony', category_key: 'outdoor_leisure', sort_order: 5, translations: [
        { language_code: 'en', name: 'Balcony' },
        { language_code: 'id', name: 'Balkon' },
        { language_code: 'es', name: 'Balcón' }
      ] },
      { key: 'bbq_area', category_key: 'outdoor_leisure', sort_order: 6, translations: [
        { language_code: 'en', name: 'BBQ area' },
        { language_code: 'id', name: 'Area BBQ' },
        { language_code: 'es', name: 'Zona de barbacoa' }
      ] },
      { key: 'outdoor_shower', category_key: 'outdoor_leisure', sort_order: 7, translations: [
        { language_code: 'en', name: 'Outdoor shower' },
        { language_code: 'id', name: 'Shower luar ruangan' },
        { language_code: 'es', name: 'Ducha exterior' }
      ] },
      { key: 'gazebo', category_key: 'outdoor_leisure', sort_order: 8, translations: [
        { language_code: 'en', name: 'Gazebo / Bale Bengong' },
        { language_code: 'id', name: 'Gazebo / Bale Bengong' },
        { language_code: 'es', name: 'Gazebo / Bale Bengong' }
      ] },

      // Views & Location
      { key: 'ocean_view', category_key: 'views_location', sort_order: 1, translations: [
        { language_code: 'en', name: 'Ocean view' },
        { language_code: 'id', name: 'Pemandangan laut' },
        { language_code: 'es', name: 'Vista al mar' }
      ] },
      { key: 'beach_front', category_key: 'views_location', sort_order: 2, translations: [
        { language_code: 'en', name: 'Beach front' },
        { language_code: 'id', name: 'Tepi pantai' },
        { language_code: 'es', name: 'Frente a la playa' }
      ] },
      { key: 'rice_field_view', category_key: 'views_location', sort_order: 3, translations: [
        { language_code: 'en', name: 'Rice field view' },
        { language_code: 'id', name: 'Pemandangan sawah' },
        { language_code: 'es', name: 'Vista a los arrozales' }
      ] },
      { key: 'mountain_view', category_key: 'views_location', sort_order: 4, translations: [
        { language_code: 'en', name: 'Mountain view' },
        { language_code: 'id', name: 'Pemandangan gunung' },
        { language_code: 'es', name: 'Vista a la montaña' }
      ] },
      { key: 'jungle_view', category_key: 'views_location', sort_order: 5, translations: [
        { language_code: 'en', name: 'Jungle view' },
        { language_code: 'id', name: 'Pemandangan hutan' },
        { language_code: 'es', name: 'Vista a la selva' }
      ] },

      // Security & Access
      { key: 'security', category_key: 'security_access', sort_order: 1, translations: [
        { language_code: 'en', name: 'Security' },
        { language_code: 'id', name: 'Keamanan' },
        { language_code: 'es', name: 'Seguridad' }
      ] },
      { key: 'cctv', category_key: 'security_access', sort_order: 2, translations: [
        { language_code: 'en', name: 'CCTV' },
        { language_code: 'id', name: 'CCTV' },
        { language_code: 'es', name: 'CCTV' }
      ] },
      { key: 'gated_complex', category_key: 'security_access', sort_order: 3, translations: [
        { language_code: 'en', name: 'Gated complex' },
        { language_code: 'id', name: 'Kompleks berpagar' },
        { language_code: 'es', name: 'Complejo cerrado' }
      ] },
      { key: 'private_car_parking', category_key: 'security_access', sort_order: 4, translations: [
        { language_code: 'en', name: 'Private car parking' },
        { language_code: 'id', name: 'Parkir mobil pribadi' },
        { language_code: 'es', name: 'Estacionamiento privado' }
      ] },
      { key: 'garage', category_key: 'security_access', sort_order: 5, translations: [
        { language_code: 'en', name: 'Garage' },
        { language_code: 'id', name: 'Garasi' },
        { language_code: 'es', name: 'Garaje' }
      ] },

      // Living & Comfort
      { key: 'enclosed_living_room', category_key: 'living_comfort', sort_order: 1, translations: [
        { language_code: 'en', name: 'Enclosed living room' },
        { language_code: 'id', name: 'Ruang tamu tertutup' },
        { language_code: 'es', name: 'Sala de estar cerrada' }
      ] },
      { key: 'open_living_room', category_key: 'living_comfort', sort_order: 2, translations: [
        { language_code: 'en', name: 'Open living room' },
        { language_code: 'id', name: 'Ruang tamu terbuka' },
        { language_code: 'es', name: 'Sala de estar abierta' }
      ] },
      { key: 'air_conditioning', category_key: 'living_comfort', sort_order: 3, translations: [
        { language_code: 'en', name: 'Air conditioning' },
        { language_code: 'id', name: 'AC' },
        { language_code: 'es', name: 'Aire acondicionado' }
      ] },
      { key: 'dedicated_workspace', category_key: 'living_comfort', sort_order: 4, translations: [
        { language_code: 'en', name: 'Dedicated workspace' },
        { language_code: 'id', name: 'Ruang kerja' },
        { language_code: 'es', name: 'Espacio de trabajo dedicado' }
      ] },
      { key: 'laundry_room', category_key: 'living_comfort', sort_order: 5, translations: [
        { language_code: 'en', name: 'Laundry room' },
        { language_code: 'id', name: 'Ruang cuci' },
        { language_code: 'es', name: 'Lavandería' }
      ] },
      { key: 'washing_machine', category_key: 'living_comfort', sort_order: 6, translations: [
        { language_code: 'en', name: 'Washing machine' },
        { language_code: 'id', name: 'Mesin cuci' },
        { language_code: 'es', name: 'Lavadora' }
      ] },
      { key: 'fully_furnished', category_key: 'living_comfort', sort_order: 7, translations: [
        { language_code: 'en', name: 'Fully furnished' },
        { language_code: 'id', name: 'Full furnished' },
        { language_code: 'es', name: 'Totalmente amueblado' }
      ] },
      { key: 'storage_room', category_key: 'living_comfort', sort_order: 8, translations: [
        { language_code: 'en', name: 'Storage room' },
        { language_code: 'id', name: 'Gudang' },
        { language_code: 'es', name: 'Trastero' }
      ] },
      { key: 'guest_toilet', category_key: 'living_comfort', sort_order: 9, translations: [
        { language_code: 'en', name: 'Guest toilet' },
        { language_code: 'id', name: 'Toilet tamu' },
        { language_code: 'es', name: 'Baño de invitados' }
      ] },

      // Kitchen & Dining
      { key: 'fully_equipped_kitchen', category_key: 'kitchen_dining', sort_order: 1, translations: [
        { language_code: 'en', name: 'Fully equipped kitchen' },
        { language_code: 'id', name: 'Dapur lengkap' },
        { language_code: 'es', name: 'Cocina totalmente equipada' }
      ] },
      { key: 'refrigerator', category_key: 'kitchen_dining', sort_order: 2, translations: [
        { language_code: 'en', name: 'Refrigerator' },
        { language_code: 'id', name: 'Kulkas' },
        { language_code: 'es', name: 'Refrigerador' }
      ] },
      { key: 'stove', category_key: 'kitchen_dining', sort_order: 3, translations: [
        { language_code: 'en', name: 'Stove' },
        { language_code: 'id', name: 'Kompor' },
        { language_code: 'es', name: 'Estufa' }
      ] },

      // Wellness & Facilities
      { key: 'gym', category_key: 'wellness_facilities', sort_order: 1, translations: [
        { language_code: 'en', name: 'Gym' },
        { language_code: 'id', name: 'Gym' },
        { language_code: 'es', name: 'Gimnasio' }
      ] },
      { key: 'sauna', category_key: 'wellness_facilities', sort_order: 2, translations: [
        { language_code: 'en', name: 'Sauna' },
        { language_code: 'id', name: 'Sauna' },
        { language_code: 'es', name: 'Sauna' }
      ] },
      { key: 'home_theater', category_key: 'wellness_facilities', sort_order: 3, translations: [
        { language_code: 'en', name: 'Home theater' },
        { language_code: 'id', name: 'Home theater' },
        { language_code: 'es', name: 'Cine en casa' }
      ] },
      { key: 'office_space', category_key: 'wellness_facilities', sort_order: 4, translations: [
        { language_code: 'en', name: 'Office space' },
        { language_code: 'id', name: 'Ruang kantor' },
        { language_code: 'es', name: 'Oficina' }
      ] },
      { key: 'bathtub', category_key: 'wellness_facilities', sort_order: 5, translations: [
        { language_code: 'en', name: 'Bathtub' },
        { language_code: 'id', name: 'Bathtub' },
        { language_code: 'es', name: 'Bañera' }
      ] },
      { key: 'jacuzzi', category_key: 'wellness_facilities', sort_order: 6, translations: [
        { language_code: 'en', name: 'Jacuzzi' },
        { language_code: 'id', name: 'Jacuzzi' },
        { language_code: 'es', name: 'Jacuzzi' }
      ] }
    ];

    // Insert features and translations (single block, using category_key)
    const featuresMap = {};
    for (const feature of featuresData) {
      const featureRes = await client.query(
        'INSERT INTO features (category_key, key, sort_order) VALUES ($1, $2, $3) RETURNING id',
        [feature.category_key, feature.key, feature.sort_order]
      );
      const featureId = featureRes.rows[0].id;
      featuresMap[feature.key] = featureId;
      for (const t of feature.translations) {
        await client.query(
          'INSERT INTO features_translations (feature_id, language_code, name) VALUES ($1, $2, $3)',
          [featureId, t.language_code, t.name]
        );
      }
    }
    console.log('-> Features seeded.');

    // 8. Loop through listings data and insert into the database
    console.log('Seeding listings and their related data...');
    for (const data of listingsData) {
      const locationId = locationsMap[data.listing.location];
      const listingTypeId = listingTypesMap[data.listing.listing_type];
      // Only allow 'freehold' and 'leasehold' for ownership_type
      let ownershipTypeId = ownershipTypesMap[data.listing.ownership_type];
      if (!ownershipTypeId) {
        throw new Error(`Invalid ownership_type: ${data.listing.ownership_type} in listing for ${data.listing.location}`);
      }
      const statusId = listingStatusesMap[data.listing.status];
      // Insert listing
      const listingQuery = `
        INSERT INTO listings (listing_type_id, ownership_type_id, location_id, bedrooms, bathrooms, land_size_sqm, building_size_sqm, status_id, price, year_built)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id;
      `;
      const listingValues = [
        listingTypeId, ownershipTypeId, locationId,
        data.listing.bedrooms, data.listing.bathrooms, data.listing.land_size_sqm,
        data.listing.building_size_sqm, statusId, data.listing.price, data.listing.year_built
      ];
      const listingResult = await client.query(listingQuery, listingValues);
      const newListingId = listingResult.rows[0].id;
      console.log(` -> Created listing with internal ID: ${newListingId}`);

      // Insert all translations for title/description
      // Only use translations array, which now always includes English
      for (const t of data.translations || []) {
        await client.query(
          'INSERT INTO listing_translations (listing_id, language_code, title, description) VALUES ($1, $2, $3, $4)',
          [newListingId, t.language_code, t.title, t.description]
        );
      }

      // Insert images
      for (const image of data.images) {
        await client.query(
          'INSERT INTO listing_images (listing_id, url, alt_text) VALUES ($1, $2, $3)',
          [newListingId, image.url, image.alt_text]
        );
      }

      // Link features
      for (const featureName of data.features) {
        const featureId = featuresMap[featureName];
        if (featureId) {
          await client.query(
            'INSERT INTO listing_features (listing_id, feature_id) VALUES ($1, $2)',
            [newListingId, featureId]
          );
        }
      }
    }

    await client.query('COMMIT'); // Commit the transaction
    console.log('✅ Database seeding complete!');
  } catch (err) {
    await client.query('ROLLBACK'); // Rollback on error
    console.error('Error seeding database:', err.stack);
  } finally {
    client.release(); // Release the client back to the pool
    await pool.end(); // Close the pool so the script exits
  }
};

seedDatabase();