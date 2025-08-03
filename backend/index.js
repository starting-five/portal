require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// You would import your own modules here as you create them
const db = require('./src/db'); // Your DB connection setup
const apiRouter = require('./src/api'); // Import the main API router

const app = express();
const PORT = process.env.PORT || 3001;

const pool = db.pool; // Get the pool from your DB module

// --- Core Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.listen(PORT, async () => {
  try {
    // const result = await pool.query('SELECT * from listings'); // Simple test query
    // console.log('Query result:', result.rows); // Print the rows
    console.log('Connected to Postgres database!');
  } catch (err) {
    console.error('Database connection error:', err);
  }
});
// --- API Documentation (OpenAPI/Swagger) ---
        // url: `http://localhost:${PORT}/api/v1`,
        //  url: `https://portal-alpha.onrender.com/api/v1`,
        // url: `http://backend:3001/api/v1`
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Property Portal API',
      version: '1.0.0',
      description: 'API documentation for the real estate portal backend.',
      contact: {
        name: 'Starting Five Team',
      },
    },
    servers: [
      { url: `http://localhost:${PORT}/api/v1`, description: 'Local (host)' },
      { url: `http://backend:3001/api/v1`, description: 'Docker Compose (internal)' },
    ],
    components: {
      schemas: {
        // Schema for a Currency object
        Currency: {
          type: 'object',
          required: ['id', 'code', 'name'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated ID of the currency.',
            },
            code: {
              type: 'string',
              description: 'The 3-letter code of the currency (e.g., IDR, USD).',
              maxLength: 3,
            },
            name: {
              type: 'string',
              description: 'The full name of the currency (e.g., Indonesian Rupiah).',
            },
          },
          example: {
            id: 1,
            code: 'IDR',
            name: 'Indonesian Rupiah',
          },
        },
        // Schema for creating a new Currency
        NewCurrency: {
          type: 'object',
          required: ['code', 'name'],
          properties: {
            code: { type: 'string', example: 'EUR' },
            name: { type: 'string', example: 'Euro' },
          },
        },
        // Schema for a ListingImage object
        ListingImage: {
          type: 'object',
          required: ['id', 'listing_id', 'url'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated ID of the listing image.',
            },
            listing_id: {
              type: 'integer',
              description: 'The ID of the listing this image belongs to.',
            },
            url: {
              type: 'string',
              format: 'url',
              description: 'The URL of the image.',
            },
            alt_text: {
              type: 'string',
              description: 'Alternative text for the image.',
              nullable: true,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the image record was created.',
            },
          },
          example: {
            id: 1,
            listing_id: 1,
            url: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg',
            alt_text: 'Villa exterior view with pool',
            created_at: '2023-10-27T10:00:00Z',
          },
        },
        // Schema for a Feature object
        Feature: {
          type: 'object',
          required: ['id', 'name', 'category'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated ID of the feature.',
            },
            name: {
              type: 'string',
              description: 'The name of the feature (e.g., Swimming Pool).',
            },
            category: {
              type: 'string',
              description: 'The category of the feature.',
              enum: ['scenic', 'property', 'amenity'],
            },
          },
          example: {
            id: 2,
            name: 'Swimming Pool',
            category: 'amenity',
          },
        },
        // Schema for creating a new Feature
        NewFeature: {
          type: 'object',
          required: ['name', 'category'],
          properties: {
            name: { type: 'string', example: 'Rooftop Terrace' },
            category: {
              type: 'string',
              enum: ['scenic', 'property', 'amenity'],
              example: 'property',
            },
          },
        },
        // Schema for creating a new ListingImage
        NewListingImage: {
          type: 'object',
          required: ['listing_id', 'url'],
          properties: {
            listing_id: {
              type: 'integer',
              description: 'The ID of the listing this image belongs to.',
            },
            url: {
              type: 'string',
              format: 'url',
              example: 'https://example.com/new_image.jpg',
            },
            alt_text: { type: 'string', example: 'A new image for the listing', nullable: true },
          },
        },
        // Schema for a ListingStatus object
        ListingStatus: {
          type: 'object',
          required: ['id', 'name'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated ID of the listing status.',
            },
            name: {
              type: 'string',
              description: 'The name of the listing status (e.g., available_for_sale).',
            },
          },
          example: {
            id: 2,
            name: 'available_for_sale',
          },
        },
        // Schema for creating a new ListingStatus
        NewListingStatus: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              description: 'The name of the listing status (e.g., pending).',
              example: 'pending',
            },
          },
        },
        // Schema for a ListingType object
        ListingType: {
          type: 'object',
          required: ['id', 'name'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated ID of the listing type.',
            },
            name: {
              type: 'string',
              description: 'The name of the listing type (e.g., villa, house).',
            },
          },
          example: {
            id: 1,
            name: 'villa',
          },
        },
        // Schema for creating a new ListingType
        NewListingType: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              description: 'The name of the new listing type (e.g., apartment).',
              example: 'apartment',
            },
          },
        },
        // Schema for a Location object
        Location: {
          type: 'object',
          required: ['id', 'name'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated ID of the location.',
            },
            name: {
              type: 'string',
              description: 'The name of the location (e.g., Canggu, Ubud).',
            },
          },
          example: {
            id: 1,
            name: 'Canggu',
          },
        },
        // Schema for creating a new Location
        NewLocation: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              description: 'The name of the new location (e.g., Sanur).',
              example: 'Sanur',
            },
          },
        },
        // Schema for an OwnershipType object
        OwnershipType: {
          type: 'object',
          required: ['id', 'name'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated ID of the ownership type.',
            },
            name: {
              type: 'string',
              description: 'The name of the ownership type (e.g., freehold, leasehold).',
            },
          },
          example: {
            id: 1,
            name: 'freehold',
          },
        },
        // Schema for creating a new OwnershipType
        NewOwnershipType: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              description: 'The name of the new ownership type (e.g., rent).',
              example: 'rent',
            },
          },
        },
        // Schema for a PriceUnit object
        PriceUnit: {
          type: 'object',
          required: ['id', 'name'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated ID of the price unit.',
            },
            name: {
              type: 'string',
              description: 'The name of the price unit (e.g., total, per_year).',
            },
          },
          example: {
            id: 1,
            name: 'total',
          },
        },
        // Schema for creating a new PriceUnit
        NewPriceUnit: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              description: 'The name of the new price unit (e.g., per_week).',
              example: 'per_week',
            },
          },
        },
        // Schema for a full Listing object (response)
        Listing: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Internal database ID' },
            listing_id: { type: 'string', description: 'Human-readable unique ID (e.g., 1234-5678)' },
            title: { type: 'string' },
            description: { type: 'string' },
            listing_type: { type: 'string' },
            ownership_type: { type: 'string' },
            location: { type: 'string' },
            bedrooms: { type: 'integer' },
            bathrooms: { type: 'integer' },
            land_size_sqm: { type: 'integer' },
            building_size_sqm: { type: 'integer', nullable: true },
            status: { type: 'string' },
            price: { type: 'number', format: 'float', description: 'The price amount.', nullable: true },
            year_built: { type: 'integer', nullable: true },
            images: { type: 'array', items: { type: 'object' } },
            features: { type: 'array', items: { type: 'object' } },
          },
        },
        // Schema for creating a new Listing (request body)
        NewListing: {
          type: 'object',
          required: ['title', 'listing_type_id', 'ownership_type_id', 'location_id', 'status_id'],
          properties: {
            title: { type: 'string', example: 'Brand New Villa' },
            description: { type: 'string', example: 'A beautiful villa in a great location.' },
            listing_type_id: { type: 'integer', description: 'ID from the listing_types table' },
            ownership_type_id: { type: 'integer', description: 'ID from the ownership_types table' },
            location_id: { type: 'integer', description: 'ID from the locations table' },
            bedrooms: { type: 'integer', example: 3 },
            bathrooms: { type: 'integer', example: 3 },
            land_size_sqm: { type: 'integer', example: 300 },
            building_size_sqm: { type: 'integer', example: 250 },
            status_id: { type: 'integer', description: 'ID from the listing_statuses table' },
            price: { type: 'number', example: 4500000000, nullable: true },
            year_built: { type: 'integer', example: 2024 },
            features: { type: 'array', items: { type: 'integer' }, description: 'An array of feature IDs', example: [1, 2] },
          },
        },
        // Schema for updating a Listing
        UpdateListing: {
          type: 'object',
          description: 'Only include fields that need to be updated. For features, providing a new array will replace all existing entries.',
          properties: {
            title: { type: 'string', example: 'Updated Villa Title' },
            description: { type: 'string', example: 'An updated description.' },
            listing_type_id: { type: 'integer' },
            ownership_type_id: { type: 'integer' },
            location_id: { type: 'integer' },
            bedrooms: { type: 'integer' },
            bathrooms: { type: 'integer' },
            land_size_sqm: { type: 'integer' },
            building_size_sqm: { type: 'integer' },
            status_id: { type: 'integer', description: 'ID from the listing_statuses table' },
            price: { type: 'number', example: 4600000000, nullable: true },
            year_built: { type: 'integer' },
            features: { type: 'array', items: { type: 'integer' }, description: 'An array of feature IDs. Replaces all existing features.', example: [1, 3, 5] },
          },
        },
      },
    },
  },
  // Path to the API route files which contain the JSDoc comments
  apis: ['./src/api/*.routes.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api/v1', apiRouter);

// Serve the interactive API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

