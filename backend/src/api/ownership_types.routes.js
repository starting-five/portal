/**
 * @swagger
 * tags:
 *   name: Ownership Types
 *   description: API for managing ownership types (e.g., freehold, leasehold)
 * components:
 *   schemas:
 *     OwnershipType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         key:
 *           type: string
 *         labels:
 *           type: object
 *           additionalProperties:
 *             type: string
 *           example:
 *             en: Freehold
 *             id: Hak Milik
 *             es: Propiedad absoluta
 *     OwnershipTypeTranslation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         ownership_type_id:
 *           type: integer
 *         language_code:
 *           type: string
 *         name:
 *           type: string
 */

/**
 * @swagger
 * /ownership_types:
 *   get:
 *     summary: Retrieve a list of all ownership types
 *     tags: [Ownership Types]
 *     responses:
 *       200:
 *         description: A list of ownership types.
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
 *                       en: Freehold
 *                       id: Hak Milik
 *                       es: Propiedad absoluta
 */
const express = require('express');
const router = express.Router();
const ownershipTypeController = require('../controllers/ownership_type.controller');
const ownershipTypeTranslationController = require('../controllers/ownership_type_translation.controller');

// ...existing code...

/**
 * @swagger
 * /ownership_types:
 *   get:
 *     summary: Retrieve a list of all ownership types
 *     tags: [Ownership Types]
 *     responses:
 *       200:
 *         description: A list of ownership types.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OwnershipType'
 */
// GET /api/v1/ownership_types - Retrieve all ownership types (optionally translated)
router.get('/', ownershipTypeController.getAllOwnershipTypes);


/**
 * @swagger
 * /ownership_types/{id}:
 *   get:
 *     summary: Retrieve a single ownership type by ID
 *     tags: [Ownership Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the ownership type to retrieve
 *     responses:
 *       200:
 *         description: A single ownership type object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OwnershipType'
 *       404:
 *         description: Ownership type not found
 */
// GET /api/v1/ownership_types/:id - Retrieve a single ownership type (optionally translated)
router.get('/:id', ownershipTypeController.getOwnershipTypeById);

/**
 * @swagger
 * /ownership_types:
 *   post:
 *     summary: Create a new ownership type
 *     tags: [Ownership Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *                 description: Unique key for the ownership type (e.g., 'freehold')
 *               sort_order:
 *                 type: integer
 *                 description: Order for display (lower comes first)
 *               translations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     language_code:
 *                       type: string
 *                       enum: [en, es, id]
 *                       description: Language code for the translation
 *                     name:
 *                       type: string
 *                       description: The translated name for the ownership type
 *           example:
 *             key: freehold
 *             sort_order: 1
 *             translations:
 *               - language_code: en
 *                 name: Freehold
 *               - language_code: id
 *                 name: Hak Milik
 *               - language_code: es
 *                 name: Propiedad absoluta
 *     responses:
 *       201:
 *         description: The created ownership type.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OwnershipType'
 */
// POST /api/v1/ownership_types - Create a new ownership type with translations
router.post('/', ownershipTypeTranslationController.createOwnershipTypeWithTranslations);

/**
 * @swagger
 * /ownership_types/{id}/translation/{lang}:
 *   put:
 *     summary: Update the translated name for an ownership type
 *     tags: [Ownership Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the ownership type to update
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
 *                 description: The translated name for the ownership type
 *     responses:
 *       200:
 *         description: The updated translation for the ownership type.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OwnershipTypeTranslation'
 *       404:
 *         description: Ownership type or translation not found
 */
// PUT /api/v1/ownership_types/:id/translation/:lang - Update ownership type translation for a language
router.put('/:id/translation/:lang', ownershipTypeTranslationController.updateOwnershipTypeTranslation);

/**
 * @swagger
 * /ownership_types/{id}:
 *   delete:
 *     summary: Delete an ownership type by ID
 *     tags: [Ownership Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the ownership type to delete
 *     responses:
 *       204:
 *         description: Ownership type successfully deleted
 *       404:
 *         description: Ownership type not found
 */
// DELETE /api/v1/ownership_types/:id - Delete an ownership type
router.delete('/:id', ownershipTypeController.deleteOwnershipType);

module.exports = router;