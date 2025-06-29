const express = require('express');
const router = express.Router();
const listingTypeController = require('../controllers/listing_type.controller');

/**
 * @swagger
 * tags:
 *   name: Listing Types
 *   description: API for managing listing types (e.g., villa, house)
 */

/**
 * @swagger
 * /listing_types:
 *   get:
 *     summary: Retrieve a list of all listing types
 *     tags: [Listing Types]
 *     responses:
 *       200:
 *         description: A list of listing types.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ListingType'
 */
// GET /api/v1/listing_types - Retrieve all listing types
router.get('/', listingTypeController.getAllListingTypes);

/**
 * @swagger
 * /listing_types/{id}:
 *   get:
 *     summary: Retrieve a single listing type by ID
 *     tags: [Listing Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the listing type to retrieve
 *     responses:
 *       200:
 *         description: A single listing type object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListingType'
 *       404:
 *         description: Listing type not found
 */
// GET /api/v1/listing_types/:id - Retrieve a single listing type
router.get('/:id', listingTypeController.getListingTypeById);

/**
 * @swagger
 * /listing_types:
 *   post:
 *     summary: Create a new listing type
 *     tags: [Listing Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewListingType'
 *     responses:
 *       201:
 *         description: The created listing type.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListingType'
 */
// POST /api/v1/listing_types - Create a new listing type
router.post('/', listingTypeController.createListingType);

/**
 * @swagger
 * /listing_types/{id}:
 *   put:
 *     summary: Update an existing listing type
 *     tags: [Listing Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the listing type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewListingType'
 *     responses:
 *       200:
 *         description: The updated listing type.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListingType'
 *       404:
 *         description: Listing type not found
 */
// PUT /api/v1/listing_types/:id - Update a listing type
router.put('/:id', listingTypeController.updateListingType);

/**
 * @swagger
 * /listing_types/{id}:
 *   delete:
 *     summary: Delete a listing type by ID
 *     tags: [Listing Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the listing type to delete
 *     responses:
 *       204:
 *         description: Listing type successfully deleted
 *       404:
 *         description: Listing type not found
 */
// DELETE /api/v1/listing_types/:id - Delete a listing type
router.delete('/:id', listingTypeController.deleteListingType);

module.exports = router;