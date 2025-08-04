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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   key:
 *                     type: string
 *                   labels:
 *                     type: object
 *                     additionalProperties:
 *                       type: string
 *                     example:
 *                       en: Villa
 *                       id: Vila
 *                       es: Villa
 */
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
*             type: object
*             properties:
 *                   key:
 *                     type: string
 *                     description: Unique key for the listing type (e.g., 'villa')
 *                   translations:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         language_code:
 *                           type: string
 *                           enum: [en, es, id]
 *                           description: Language code for the translation
 *                         name:
 *                           type: string
 *                           description: The translated name for the listing type
 *           example:
 *             key: villa
 *             translations:
 *               - language_code: en
 *                 name: Villa
 *               - language_code: id
 *                 name: Vila
 *               - language_code: es
 *                 name: Villa
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
/**
 * @swagger
 * /listing_types/{id}/translation/{lang}:
 *   put:
 *     summary: Update the translated name for a listing type
 *     tags: [Listing Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the listing type to update
 *       - in: path
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [en, es, id]
 *         required: true
 *         description: Language code for the translation to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The translated name for the listing type
 *     responses:
 *       200:
 *         description: The updated translation for the listing type.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListingType'
 *       404:
 *         description: Listing type or translation not found
 */
router.put('/:id/translation/:lang', listingTypeController.updateListingTypeTranslation);

module.exports = router;