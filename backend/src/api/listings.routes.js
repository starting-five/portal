const express = require('express');
const router = express.Router();
const listingsController = require('../controllers/listings.controller');

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
 *             $ref: '#/components/schemas/NewListing'
 *     responses:
 *       201:
 *         description: The created listing.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 */
// POST /api/v1/listings - Create a new listing
router.post('/', listingsController.createListing);

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
 *             $ref: '#/components/schemas/UpdateListing'
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
// PUT /api/v1/listings/:listing_id - Update a listing
router.put('/:listing_id', listingsController.updateListing);

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
// DELETE /api/v1/listings/:listing_id - Delete a listing
router.delete('/:listing_id', listingsController.deleteListing);

module.exports = router;