const express = require('express');
const router = express.Router();
const listingsController = require('../controllers/listings.controller');
const { requireUser } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Listings
 *   description: API for managing real estate listings
 */

/**
 * @swagger
 * /listings:
 *   get:
 *     summary: Retrieve a list of all listings
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [en, id, es]
 *           default: en
 *         required: false
 *         description: Language code for listing title and description (en, id, es). Defaults to English with fallback.
 *     responses:
 *       200:
 *         description: A list of listings.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Listing'
 *       500:
 *         description: Internal server error
 */
// GET /api/v1/listings - Retrieve all listings
router.get('/', listingsController.getAllListings);

/**
 * @swagger
 * /listings/{listing_id}:
 *   get:
 *     summary: Retrieve a single listing by ID
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: listing_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Human-readable unique ID of the listing to retrieve (e.g., 1234-5678)
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [en, id, es]
 *           default: en
 *         required: false
 *         description: Language code for listing title and description (en, id, es). Defaults to English with fallback.
 *     responses:
 *       200:
 *         description: A single listing object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 *       404:
 *         description: Listing not found
 */
// GET /api/v1/listings/:listing_id - Retrieve a single listing
router.get('/:listing_id', listingsController.getListingById);

/**
 * @swagger
 * /listings:
 *   post:
 *     summary: Create a new listing
 *     tags: [Listings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               translations:
 *                 type: array
 *                 description: Array of translations for title and description
 *                 items:
 *                   type: object
 *                   properties:
 *                     language_code:
 *                       type: string
 *                       enum: [en, id, es]
 *                       description: Language code for this translation (English, Indonesian, Spanish)
 *                     title:
 *                       type: string
 *                       description: Translated title for the listing
 *                     description:
 *                       type: string
 *                       description: Translated description for the listing
 *               ownership_type_id:
 *                 type: integer
 *               listing_type_id:
 *                 type: integer
 *               location_id:
 *                 type: integer
 *               building_size_sqm:
 *                 type: number
 *               land_size_sqm:
 *                 type: number
 *               bedrooms:
 *                 type: integer
 *               bathrooms:
 *                 type: integer
 *               price:
 *                 type: number
 *               year_built:
 *                 type: integer
 *               status_id:
 *                 type: integer
 *               features:
 *                 type: array
 *                 items:
 *                   type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *             required:
 *               - title
 *               - description
 *               - ownership_type_id
 *               - listing_type_id
 *               - location_id
 *               - building_size_sqm
 *               - land_size_sqm
 *               - bedrooms
 *               - bathrooms
 *               - price
 *               - year_built
 *               - status_id
 *               - features
 *               - images
 *               - translations
 *     responses:
 *       201:
 *         description: The created listing.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 */
// POST /api/v1/listings - Create a new listing (requires authentication)
router.post('/', requireUser, listingsController.createListing);

/**
 * @swagger
 * /listings/{listing_id}:
 *   put:
 *     summary: Update an existing listing
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: listing_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Human-readable unique ID of the listing to update (e.g., 1234-5678)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location_id:
 *                 type: integer
 *               listing_type_id:
 *                 type: integer
 *               ownership_type_id:
 *                 type: integer
 *               status_id:
 *                 type: integer
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: integer
 *               translations:
 *                 type: array
 *                 description: Array of translations for title and description
 *                 items:
 *                   type: object
 *                   properties:
 *                     language_code:
 *                       type: string
 *                       enum: [en, id, es]
 *                       description: Language code for this translation (English, Indonesian, Spanish)
 *                     title:
 *                       type: string
 *                       description: Translated title for the listing
 *                     description:
 *                       type: string
 *                       description: Translated description for the listing
 *             required:
 *               - location_id
 *               - listing_type_id
 *               - ownership_type_id
 *               - status_id
 *               - price
 *               - translations
 *     responses:
 *       200:
 *         description: The updated listing.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 *       404:
 *         description: Listing not found
 */
// PUT /api/v1/listings/:listing_id - Update a listing (requires authentication)
router.put('/:listing_id', requireUser, listingsController.updateListing);

/**
 * @swagger
 * /listings/{listing_id}:
 *   delete:
 *     summary: Delete a listing by ID
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: listing_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Human-readable unique ID of the listing to delete (e.g., 1234-5678)
 *     responses:
 *       204:
 *         description: Listing successfully deleted
 *       404:
 *         description: Listing not found
 */
// DELETE /api/v1/listings/:listing_id - Delete a listing (requires authentication)
router.delete('/:listing_id', requireUser, listingsController.deleteListing);

module.exports = router;