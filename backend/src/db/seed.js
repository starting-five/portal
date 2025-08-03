const { pool } = require('./index');


const seedDatabase = async () => {
  // Use a single client for the entire seeding process to run it as a transaction
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start transaction

    // 1. Clean existing data
    console.log('Resetting database tables...');
    await client.query('TRUNCATE listings, listing_images, features, listing_features, locations, listing_types, ownership_types, listing_statuses RESTART IDENTITY CASCADE;');
    console.log('-> Tables truncated.');


    // 2. Seed Locations (independent of listingsData)
    console.log('Seeding locations...');
    // Define your canonical list of locations here
    const locationsSeed = [
      { name: 'Canggu', sort_order: 1 },
      { name: 'Seminyak', sort_order: 2 },
      { name: 'Berawa', sort_order: 3 },
      { name: 'Uluwatu', sort_order: 4 },
      { name: 'Bingin', sort_order: 5 },
      { name: 'Pererenan', sort_order: 6 },
      { name: 'Ubud', sort_order: 7 },
      { name: 'Jimbaran', sort_order: 8 },
      { name: 'Sanur', sort_order: 9 },
      { name: 'Nusa Dua', sort_order: 10 },
      { name: 'Denpasar', sort_order: 11 },
      { name: 'Kerobokan', sort_order: 12 },
      { name: 'Seseh', sort_order: 13 },
      { name: 'Tabanan', sort_order: 14 },
      { name: 'Pecatu', sort_order: 15 },
      { name: 'Ungasan', sort_order: 16 },
      { name: 'Legian', sort_order: 17 },
      { name: 'Kuta', sort_order: 18 },
      { name: 'Bukit', sort_order: 19 },
      { name: 'Padang Padang', sort_order: 20 },
      { name: 'Sidemen', sort_order: 21 },
      { name: 'Amed', sort_order: 22 },
      { name: 'Lovina', sort_order: 23 }
    ];
    for (const loc of locationsSeed) {
      await client.query(
        'INSERT INTO locations (name, sort_order) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET sort_order = EXCLUDED.sort_order',
        [loc.name, loc.sort_order]
      );
    }
    console.log('-> Locations seeded.');



    // 4. Seed Lookup Tables (Types, Ownerships, Statuses)
    console.log('Seeding lookup tables...');
    // Listing types with translations
    const listingTypes = [
      {
        key: 'villa',
        sort_order: 1,
        translations: [
          { language_code: 'en', name: 'Villa' },
          { language_code: 'id', name: 'Vila' },
          { language_code: 'es', name: 'Villa' }
        ]
      },
      {
        key: 'house',
        sort_order: 2,
        translations: [
          { language_code: 'en', name: 'House' },
          { language_code: 'id', name: 'Rumah' },
          { language_code: 'es', name: 'Casa' }
        ]
      },
      {
        key: 'land',
        sort_order: 3,
        translations: [
          { language_code: 'en', name: 'Land' },
          { language_code: 'id', name: 'Tanah' },
          { language_code: 'es', name: 'Terreno' }
        ]
      },
      {
        key: 'apartment',
        sort_order: 4,
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
      const typeRes = await client.query('INSERT INTO listing_types (key, sort_order) VALUES ($1, $2) RETURNING id', [type.key, type.sort_order]);
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
        sort_order: 1,
        translations: [
          { language_code: 'en', name: 'Freehold' },
          { language_code: 'id', name: 'Hak Milik' },
          { language_code: 'es', name: 'Propiedad absoluta' }
        ]
      },
      {
        key: 'leasehold',
        sort_order: 2,
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
      // Insert with key and sort_order columns
      const typeRes = await client.query('INSERT INTO ownership_types (key, sort_order) VALUES ($1, $2) RETURNING id', [type.key, type.sort_order]);
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

    // Listing statuses with keys, sort_order, and translations (best-practice order)
    const listingStatusesWithTranslations = [
      {
        key: 'for_sale',
        sort_order: 1,
        translations: [
          { language_code: 'en', name: 'For Sale' },
          { language_code: 'id', name: 'Dijual' },
          { language_code: 'es', name: 'En venta' }
        ]
      },
      {
        key: 'for_rent',
        sort_order: 2,
        translations: [
          { language_code: 'en', name: 'For Rent' },
          { language_code: 'id', name: 'Disewa' },
          { language_code: 'es', name: 'En alquiler' }
        ]
      },
      {
        key: 'off_plan',
        sort_order: 3,
        translations: [
          { language_code: 'en', name: 'Off Plan' },
          { language_code: 'id', name: 'Off Plan' },
          { language_code: 'es', name: 'Sobre plano' }
        ]
      },
      {
        key: 'sold',
        sort_order: 4,
        translations: [
          { language_code: 'en', name: 'Sold' },
          { language_code: 'id', name: 'Terjual' },
          { language_code: 'es', name: 'Vendido' }
        ]
      },
      {
        key: 'rented',
        sort_order: 5,
        translations: [
          { language_code: 'en', name: 'Rented' },
          { language_code: 'id', name: 'Tersewa' },
          { language_code: 'es', name: 'Alquilado' }
        ]
      },
      {
        key: 'draft',
        sort_order: 6,
        translations: [
          { language_code: 'en', name: 'Draft' },
          { language_code: 'id', name: 'Draft' },
          { language_code: 'es', name: 'Borrador' }
        ]
      },
      {
        key: 'archived',
        sort_order: 7,
        translations: [
          { language_code: 'en', name: 'Archived' },
          { language_code: 'id', name: 'Diarsipkan' },
          { language_code: 'es', name: 'Archivado' }
        ]
      },
      {
        key: 'deleted',
        sort_order: 8,
        translations: [
          { language_code: 'en', name: 'Deleted' },
          { language_code: 'id', name: 'Dihapus' },
          { language_code: 'es', name: 'Eliminado' }
        ]
      }
    ];

    // Insert listing statuses and translations, including sort_order
    const listingStatusesMap = {};
    for (const status of listingStatusesWithTranslations) {
      // Insert status key and sort_order
      const statusRes = await client.query('INSERT INTO listing_statuses (key, sort_order) VALUES ($1, $2) RETURNING id', [status.key, status.sort_order]);
      const statusId = statusRes.rows[0].id;
      for (const t of status.translations) {
        await client.query(
          'INSERT INTO listing_statuses_translations (listing_status_id, language_code, name) VALUES ($1, $2, $3) ON CONFLICT (listing_status_id, language_code) DO UPDATE SET name = EXCLUDED.name',
          [statusId, t.language_code, t.name]
        );
      }
      listingStatusesMap[status.key] = statusId;
    }
    console.log("-> Lookup tables seeded.");

    // 5. Seed Features (refactored for new schema and agreed data)
    console.log("Seeding feature categories and features...");
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