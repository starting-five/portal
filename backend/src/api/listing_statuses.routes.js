const express = require('express');
const router = express.Router();
const listingStatusController = require('../controllers/listing_status.controller');

/**
 * @swagger
 * tags:
 *   name: Listing Statuses
 *   description: API for managing listing statuses (e.g., available, sold)
 */

/**
 * @swagger
 * /listing_statuses:
 *   get:
 *     summary: Retrieve a list of all listing statuses
 *     tags: [Listing Statuses]
 *     parameters:
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           example: en
 *         required: false
 *         description: Language code for the translated status name (defaults to 'en')
 *     responses:
 *       200:
 *         description: A list of listing statuses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   key:
 *                     type: string
 *                   name:
 *                     type: string
 */
// GET /api/v1/listing_statuses - Retrieve all listing statuses
router.get('/', listingStatusController.getAllListingStatuses);

/**
 * @swagger
 * /listing_statuses/{id}:
 *   get:
 *     summary: Retrieve a single listing status by ID
 *     tags: [Listing Statuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the listing status to retrieve
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           example: en
 *         required: false
 *         description: Language code for the translated status name (defaults to 'en')
 *     responses:
 *       200:
 *         description: A single listing status object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 key:
 *                   type: string
 *                 name:
 *                   type: string
 *       404:
 *         description: Listing status not found
 */
// GET /api/v1/listing_statuses/:id - Retrieve a single listing status
router.get('/:id', listingStatusController.getListingStatusById);

/**
 * @swagger
 * /listing_statuses:
 *   post:
 *     summary: Create a new listing status
 *     tags: [Listing Statuses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - translations
 *             properties:
 *               key:
 *                 type: string
 *                 example: for_sale
 *                 description: Unique key for the status (e.g., for_sale, sold)
 *               translations:
 *                 type: array
 *                 description: Array of translation objects for the status name
 *                 items:
 *                   type: object
 *                   required:
 *                     - language_code
 *                     - name
 *                   properties:
 *                     language_code:
 *                       type: string
 *                       example: en
 *                     name:
 *                       type: string
 *                       example: For Sale
 *     responses:
 *       201:
 *         description: The created listing status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 key:
 *                   type: string
 *                 translations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       language_code:
 *                         type: string
 *                       name:
 *                         type: string
 */
// POST /api/v1/listing_statuses - Create a new listing status
router.post('/', listingStatusController.createListingStatus);

/**
 * @swagger
 * /listing_statuses/{id}:
 *   put:
 *     summary: Update an existing listing status
 *     tags: [Listing Statuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the listing status to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - translations
 *             properties:
 *               key:
 *                 type: string
 *                 example: for_sale
 *                 description: Unique key for the status (e.g., for_sale, sold)
 *               translations:
 *                 type: array
 *                 description: Array of translation objects for the status name
 *                 items:
 *                   type: object
 *                   required:
 *                     - language_code
 *                     - name
 *                   properties:
 *                     language_code:
 *                       type: string
 *                       example: en
 *                     name:
 *                       type: string
 *                       example: For Sale
 *     responses:
 *       200:
 *         description: The updated listing status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 key:
 *                   type: string
 *                 translations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       language_code:
 *                         type: string
 *                       name:
 *                         type: string
 *       404:
 *         description: Listing status not found
 */
// PUT /api/v1/listing_statuses/:id - Update a listing status
router.put('/:id', listingStatusController.updateListingStatus);

/**
 * @swagger
 * /listing_statuses/{id}:
 *   delete:
 *     summary: Delete a listing status by ID
 *     tags: [Listing Statuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the listing status to delete
 *     responses:
 *       204:
 *         description: Listing status successfully deleted
 *       404:
 *         description: Listing status not found
 */
// DELETE /api/v1/listing_statuses/:id - Delete a listing status
router.delete('/:id', listingStatusController.deleteListingStatus);

module.exports = router;