const { pool } = require('./index');

const listingsData = [
  {
    listing: {
      title: 'Stunning Leasehold Villa in the Heart of Canggu',
      description: 'A beautiful 3-bedroom villa with a modern design, private pool, and lush garden. Located just minutes from the famous beaches and cafes of Canggu. 25-year leasehold.',
      listing_type: 'villa', ownership_type: 'leasehold', location: 'Canggu',
      bedrooms: 3, bathrooms: 3, land_size_sqm: 300, building_size_sqm: 250, status: 'available_for_sale',
      price: 4500000000, currency: 'IDR', price_unit: 'total',
      year_built: 2022,
      facilities: JSON.stringify({ "AC Units": 4, "Electricity": "7700W", "Water Source": "Drilled Well" })
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6', alt_text: 'Modern villa exterior' },
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811', alt_text: 'Spacious living room' }
    ],
    features: ['Swimming Pool', 'Full Furnished', 'Enclosed Living', 'Security']
  },
  {
    listing: {
      title: 'Cozy 2-Bedroom House for Yearly Rent in Seminyak',
      description: 'Charming and fully furnished house available for yearly rental. Features a small garden and a quiet neighborhood, walking distance to shops and restaurants.',
      listing_type: 'house', ownership_type: 'rent', location: 'Seminyak',
      bedrooms: 2, bathrooms: 2, land_size_sqm: 150, building_size_sqm: 120, status: 'available_for_rent',
      price: 250000000, currency: 'IDR', price_unit: 'per_year',
      year_built: 2018,
      facilities: JSON.stringify({ "AC Units": 2, "Electricity": "4400W", "Water Source": "PDAM" })
    },
    images: [{ url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', alt_text: 'Cozy house exterior' }],
    features: ['Full Furnished', 'Security']
  },
  {
    listing: {
      title: 'Prime Freehold Land with Ricefield View in Ubud',
      description: 'A rare opportunity to own a beautiful plot of land with stunning, protected ricefield views. Perfect for building a dream home or a yoga retreat. Total 1000 sqm (10 Are).',
      listing_type: 'land', ownership_type: 'freehold', location: 'Ubud',
      bedrooms: 0, bathrooms: 0, land_size_sqm: 1000, building_size_sqm: null, status: 'available_for_sale',
      price: 2500000000, currency: 'IDR', price_unit: 'total',
      year_built: null, facilities: null
    },
    images: [{ url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef', alt_text: 'Lush green land with rice paddies' }],
    features: ['Ricefield View', 'Riverside']
  },
  {
    listing: {
      title: 'Magnificent Tropical-Modern Villa with Ocean View in Uluwatu',
      description: 'A stunning villa offering breathtaking ocean views, perfect for a luxurious getaway or a high-return investment. Features an open-plan living area, a private infinity pool, and state-of-the-art amenities.',
      listing_type: 'villa', ownership_type: 'freehold', location: 'Uluwatu',
      bedrooms: 4, bathrooms: 5, land_size_sqm: 500, building_size_sqm: 450, status: 'available_for_sale',
      price: 15000000000, currency: 'IDR', price_unit: 'total',
      year_built: 2023,
      facilities: JSON.stringify({ "AC Units": 5, "Electricity": "10000W", "Water Source": "Drilled Well" })
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914', alt_text: 'Villa exterior view with pool' },
      { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6', alt_text: 'Master bedroom with ocean view' }
    ],
    features: ['Ocean View', 'Swimming Pool', 'Full Furnished', 'Enclosed Living']
  },
    {
    listing: {
      title: 'Off-Plan Modern Villa in Pererenan',
      description: 'An exciting investment opportunity for an off-plan villa in the rising area of Pererenan. Scheduled for completion in Q4 2025. 30-year leasehold.',
      listing_type: 'villa', ownership_type: 'leasehold', location: 'Pererenan',
      bedrooms: 2, bathrooms: 2, land_size_sqm: 180, building_size_sqm: 150, status: 'off_plan',
      price: 3200000000, currency: 'IDR', price_unit: 'total',
      year_built: 2025,
      facilities: JSON.stringify({ "AC Units": 3, "Electricity": "5500W", "Water Source": "Drilled Well" }),
    },
    images: [{ url: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c', alt_text: 'Architectural rendering of the villa' }],
    features: ['Swimming Pool', 'Open Space Living'],
  },
  {
    listing: {
      title: 'Simple 1-Bedroom Apartment in Denpasar',
      description: 'A clean and practical apartment for rent in a central Denpasar location. Ideal for a single professional or a couple. Includes basic furnishing.',
      listing_type: 'apartment', ownership_type: 'rent', location: 'Denpasar',
      bedrooms: 1, bathrooms: 1, land_size_sqm: 0, building_size_sqm: 45, status: 'available_for_rent',
      price: 80000000, currency: 'IDR', price_unit: 'per_year',
      year_built: 2020,
      facilities: JSON.stringify({ "AC Units": 1, "Electricity": "2200W", "Water Source": "PDAM" }),
    },
    images: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', alt_text: 'Clean apartment interior' }],
    features: ['Security'],
  },
  {
    listing: {
      title: 'Absolute Beachfront Luxury Villa in Nusa Dua',
      description: 'The pinnacle of luxury. This expansive 6-bedroom freehold villa sits on the white sands of Nusa Dua, offering unparalleled ocean views and 5-star facilities.',
      listing_type: 'villa', ownership_type: 'freehold', location: 'Nusa Dua',
      bedrooms: 6, bathrooms: 7, land_size_sqm: 2000, building_size_sqm: 1500, status: 'available_for_sale',
      price: 75000000000, currency: 'IDR', price_unit: 'total',
      year_built: 2019,
      facilities: JSON.stringify({ "AC Units": 10, "Electricity": "25000W", "Water Source": "PDAM", "Private Gym": true }),
    },
    images: [{ url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', alt_text: 'Luxury villa on the beach' }],
    features: ['Beachfront', 'Ocean View', 'Swimming Pool', 'Full Furnished', 'Security'],
  },
  {
    listing: {
      title: 'Traditional Javanese Joglo House in Tabanan',
      description: 'A unique and authentic Joglo-style house with serene ricefield views. This freehold property offers a peaceful retreat away from the hustle and bustle.',
      listing_type: 'house', ownership_type: 'freehold', location: 'Tabanan',
      bedrooms: 3, bathrooms: 2, land_size_sqm: 800, building_size_sqm: 200, status: 'available_for_sale',
      price: 5000000000, currency: 'IDR', price_unit: 'total',
      year_built: 2010,
      facilities: JSON.stringify({ "AC Units": 1, "Electricity": "3300W", "Water Source": "Well" }),
    },
    images: [{ url: 'https://images.unsplash.com/photo-1628744448848-3c6516f4b4a2', alt_text: 'Traditional wooden house' }],
    features: ['Ricefield View', 'Open Space Living'],
  },
  {
    listing: {
      title: '2 Are (200sqm) Leasehold Land in Jimbaran',
      description: 'A small plot of land in a residential area of Jimbaran. Ideal for building a small house. 15-year leasehold with extension options.',
      listing_type: 'land', ownership_type: 'leasehold', location: 'Jimbaran',
      bedrooms: 0, bathrooms: 0, land_size_sqm: 200, building_size_sqm: null, status: 'available_for_sale',
      price: 500000000, currency: 'IDR', price_unit: 'total',
      year_built: null, facilities: null,
    },
    images: [{ url: 'https://images.unsplash.com/photo-1599620582427-a9e2dba860ac', alt_text: 'Empty plot of land' }],
    features: [],
  },
  {
    listing: {
      title: 'Stylish 2BR Villa in Seminyak',
      description: 'A stylish 2-bedroom villa in a prime Seminyak location. Was offered with a 20-year leasehold.',
      listing_type: 'villa', ownership_type: 'leasehold', location: 'Seminyak',
      bedrooms: 2, bathrooms: 2, land_size_sqm: 200, building_size_sqm: 180, status: 'sold',
      price: null, currency: null, price_unit: 'total',
      year_built: 2019,
      facilities: JSON.stringify({ "AC Units": 3, "Electricity": "5500W", "Water Source": "Drilled Well" }),
    },
    images: [{ url: 'https://images.unsplash.com/photo-1576759391412-66b43b278633', alt_text: 'Villa with a sold sign' }],
    features: ['Swimming Pool', 'Full Furnished'],
  },
  {
    listing: {
      title: 'Newly Renovated Family Home in Sanur',
      description: 'A beautifully renovated 4-bedroom freehold house in the family-friendly area of Sanur. Modern kitchen and bathrooms, with a spacious garden.',
      listing_type: 'house', ownership_type: 'freehold', location: 'Sanur',
      bedrooms: 4, bathrooms: 3, land_size_sqm: 400, building_size_sqm: 300, status: 'available_for_sale',
      price: 8000000000, currency: 'IDR', price_unit: 'total',
      year_built: 2005,
      facilities: JSON.stringify({ "AC Units": 5, "Electricity": "7700W", "Water Source": "PDAM", "Renovated": 2024 }),
    },
    images: [{ url: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1', alt_text: 'Modern renovated house' }],
    features: ['Enclosed Living', 'Security'],
  },
  {
    listing: {
      title: 'Spectacular Cliff-Front Freehold Land in Uluwatu',
      description: 'A once-in-a-lifetime opportunity to acquire 50 Are (5000 sqm) of absolute cliff-front land in Uluwatu, with panoramic sunset ocean views.',
      listing_type: 'land', ownership_type: 'freehold', location: 'Uluwatu',
      bedrooms: 0, bathrooms: 0, land_size_sqm: 5000, building_size_sqm: null, status: 'available_for_sale',
      price: 30000000, currency: 'IDR', price_unit: 'per_sqm',
      year_built: null, facilities: null,
    },
    images: [{ url: 'https://images.unsplash.com/photo-1517825738774-7de9363ef735', alt_text: 'Dramatic cliff overlooking the ocean' }],
    features: ['Cliff-front', 'Ocean View'],
  },
  {
    listing: {
      title: 'Modern 1BR Villa for Monthly Rent in Berawa',
      description: 'Perfect for digital nomads. A stylish and compact 1-bedroom villa with a plunge pool, available for monthly rental. High-speed internet included.',
      listing_type: 'villa', ownership_type: 'rent', location: 'Berawa',
      bedrooms: 1, bathrooms: 1, land_size_sqm: 80, building_size_sqm: 70, status: 'available_for_rent',
      price: 35000000, currency: 'IDR', price_unit: 'per_month',
      year_built: 2021,
      facilities: JSON.stringify({ "AC Units": 1, "Electricity": "3300W", "Water Source": "Well", "Internet": "100Mbps" }),
    },
    images: [{ url: 'https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd', alt_text: 'Compact modern villa with plunge pool' }],
    features: ['Swimming Pool', 'Full Furnished', 'Enclosed Living'],
  }
];

const seedDatabase = async () => {
  // Use a single client for the entire seeding process to run it as a transaction
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start transaction

    // 1. Clean existing data
    console.log('Resetting database tables...');
    await client.query('TRUNCATE listings, listing_images, features, listing_features, locations, listing_types, ownership_types, listing_statuses, currencies, price_units RESTART IDENTITY CASCADE;');
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
    const listingTypes = ['villa', 'house', 'land', 'apartment'];
    const ownershipTypes = ['freehold', 'leasehold', 'rent'];
    const listingStatuses = ['draft', 'available_for_sale', 'available_for_rent', 'off_plan', 'sold', 'rented', 'unavailable'];
    const currencies = [
      { code: 'IDR', name: 'Indonesian Rupiah' },
      { code: 'USD', name: 'United States Dollar' }
    ];
    const priceUnits = ['total', 'per sqm', 'per year', 'per month', 'per week', 'per day'];

    for (const currency of currencies) {
      await client.query('INSERT INTO currencies (code, name) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING', [currency.code, currency.name]);
    }
    for (const unit of priceUnits) {
      await client.query('INSERT INTO price_units (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [unit]);
    }

    for (const type of listingTypes) {
      await client.query('INSERT INTO listing_types (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [type]);
    }
    for (const type of ownershipTypes) {
      await client.query('INSERT INTO ownership_types (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [type]);
    }
    for (const status of listingStatuses) {
      await client.query('INSERT INTO listing_statuses (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [status]);
    }
    console.log('-> Lookup tables seeded.');

    // 4. Fetch all lookup data into maps
    const allListingTypesRes = await client.query('SELECT id, name FROM listing_types');
    const listingTypesMap = allListingTypesRes.rows.reduce((acc, item) => {
      acc[item.name] = item.id;
      return acc;
    }, {});

    const allOwnershipTypesRes = await client.query('SELECT id, name FROM ownership_types');
    const ownershipTypesMap = allOwnershipTypesRes.rows.reduce((acc, item) => {
      acc[item.name] = item.id;
      return acc;
    }, {});

    const allListingStatusesRes = await client.query('SELECT id, name FROM listing_statuses');
    const listingStatusesMap = allListingStatusesRes.rows.reduce((acc, item) => {
      acc[item.name] = item.id;
      return acc;
    }, {});

    const allCurrenciesRes = await client.query('SELECT id, code FROM currencies');
    const currenciesMap = allCurrenciesRes.rows.reduce((acc, item) => {
      acc[item.code] = item.id;
      return acc;
    }, {});

    const allPriceUnitsRes = await client.query('SELECT id, name FROM price_units');
    const priceUnitsMap = allPriceUnitsRes.rows.reduce((acc, item) => {
      acc[item.name] = item.id;
      return acc;
    }, {});

    // 6. Seed Features
    console.log('Seeding features...');
    const featuresData = [
      { name: 'Ocean View', category: 'scenic' },
      { name: 'Swimming Pool', category: 'amenity' },
      { name: 'Full Furnished', category: 'property' },
      { name: 'Enclosed Living', category: 'property' },
      { name: 'Beachfront', category: 'scenic' },
      { name: 'Ricefield View', category: 'scenic' },
      { name: 'Riverside', category: 'scenic' },
      { name: 'Security', category: 'amenity' },
      { name: 'Open Space Living', category: 'property' },
      { name: 'Cliff-front', category: 'scenic' },
    ];

    for (const feature of featuresData) {
      await client.query(
        'INSERT INTO features (name, category) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [feature.name, feature.category]
      );
    }
    console.log('-> Features seeded.');

    // 7. Fetch all features into a map for easy lookup
    const allFeaturesRes = await client.query('SELECT id, name FROM features');
    const featuresMap = allFeaturesRes.rows.reduce((acc, feature) => {
      acc[feature.name] = feature.id;
      return acc;
    }, {});

    // 8. Loop through listings data and insert into the database
    console.log('Seeding listings and their related data...');
    for (const data of listingsData) {
      const locationId = locationsMap[data.listing.location];
      const listingTypeId = listingTypesMap[data.listing.listing_type];
      const ownershipTypeId = ownershipTypesMap[data.listing.ownership_type];
      const statusId = listingStatusesMap[data.listing.status];
      const priceUnitId = data.listing.price_unit ? priceUnitsMap[data.listing.price_unit] : null;
      const currencyId = data.listing.currency ? currenciesMap[data.listing.currency] : null;
      // Insert listing
      const listingQuery = `
        INSERT INTO listings (title, description, listing_type_id, ownership_type_id, location_id, bedrooms, bathrooms, land_size_sqm, building_size_sqm, status_id, price_unit_id, price, currency_id, year_built, facilities)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING id;
      `;
      const listingValues = [
        data.listing.title, data.listing.description,
        listingTypeId, ownershipTypeId, locationId,
        data.listing.bedrooms, data.listing.bathrooms, data.listing.land_size_sqm,
        data.listing.building_size_sqm, statusId, priceUnitId, data.listing.price, currencyId, data.listing.year_built,
        data.listing.facilities
      ];
      const listingResult = await client.query(listingQuery, listingValues);
      const newListingId = listingResult.rows[0].id;
      console.log(` -> Created listing with internal ID: ${newListingId}`);

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