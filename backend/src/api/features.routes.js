/**
 * @swagger
 * /features/{id}:
 *   get:
 *     summary: Retrieve a single feature by ID
 *     tags: [Features]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the feature to retrieve
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           example: en
 *         required: false
 *         description: Language code for the translated feature name (optional, returns all if omitted)
 *     responses:
 *       200:
 *         description: A single feature object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 key:
 *                   type: string
 *                 category_key:
 *                   type: string
 *                 sort_order:
 *                   type: integer
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
 *         description: Feature not found
 */
/**
 * @swagger
 * /features:
 *   get:
 *     summary: Retrieve a list of all features
 *     tags: [Features]
 *     parameters:
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           example: en
 *         required: false
 *         description: Language code for the translated feature name (optional, returns all if omitted)
 *     responses:
 *       200:
 *         description: A list of features.
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
 *                   category_key:
 *                     type: string
 *                   sort_order:
 *                     type: integer
 *                   translations:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         language_code:
 *                           type: string
 *                         name:
 *                           type: string
 */
/**
 * @swagger
 * tags:
 *   name: Features
 *   description: API for managing property features (amenities/highlights)
 */

/**
 * @swagger
 * /features:
 *   get:
 *     summary: Retrieve a list of all features
 *     tags: [Features]
 *     responses:
 *       200:
 *         description: A list of features.
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
 *                   category_key:
 *                     type: string
 *                   sort_order:
 *                     type: integer
 *                   translations:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         language_code:
 *                           type: string
 *                         name:
 *                           type: string
 */
const express = require('express');
const router = express.Router();
const featureController = require('../controllers/feature.controller');

/**
 * @swagger
 * tags:
 *   name: Features
 *   description: API for managing property features
 */

/**
 * @swagger
 * /features:
 *   get:
 *     summary: Retrieve a list of all features
 *     tags: [Features]
 *     responses:
 *       200:
 *         description: A list of features.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feature'
 */
// GET /api/v1/features - Retrieve all features
router.get('/', featureController.getAllFeatures);

/**
 * @swagger
 * /features/{id}:
 *   get:
 *     summary: Retrieve a single feature by ID
 *     tags: [Features]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the feature
 *     responses:
 *       200:
 *         description: A single feature object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feature'
 *       404:
 *         description: Feature not found
 */
// GET /api/v1/features/:id - Retrieve a single feature
router.get('/:id', featureController.getFeatureById);

/**
 * @swagger
 * /features:
 *   post:
 *     summary: Create a new feature
 *     tags: [Features]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - category_key
 *               - sort_order
 *               - translations
 *             properties:
 *               key:
 *                 type: string
 *                 example: hot_deal
 *                 description: Unique key for the feature
 *               category_key:
 *                 type: string
 *                 example: highlights
 *                 description: Key of the feature category
 *               sort_order:
 *                 type: integer
 *                 example: 1
 *                 description: Sort order within the category
 *               translations:
 *                 type: array
 *                 description: Array of translation objects for the feature name
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
 *                       example: Hot Deal
 *     responses:
 *       201:
 *         description: The created feature.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 key:
 *                   type: string
 *                 category_key:
 *                   type: string
 *                 sort_order:
 *                   type: integer
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
// POST /api/v1/features - Create a new feature
router.post('/', featureController.createFeature);

/**
 * @swagger
 * /features/{id}:
 *   put:
 *     summary: Update an existing feature
 *     tags: [Features]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the feature to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - category_key
 *               - sort_order
 *               - translations
 *             properties:
 *               key:
 *                 type: string
 *                 example: hot_deal
 *                 description: Unique key for the feature
 *               category_key:
 *                 type: string
 *                 example: highlights
 *                 description: Key of the feature category
 *               sort_order:
 *                 type: integer
 *                 example: 1
 *                 description: Sort order within the category
 *               translations:
 *                 type: array
 *                 description: Array of translation objects for the feature name
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
 *                       example: Hot Deal
 *     responses:
 *       200:
 *         description: The updated feature.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 key:
 *                   type: string
 *                 category_key:
 *                   type: string
 *                 sort_order:
 *                   type: integer
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
 *         description: Feature not found
 */
// PUT /api/v1/features/:id - Update a feature
router.put('/:id', featureController.updateFeature);

/**
 * @swagger
 * /features/{id}:
 *   delete:
 *     summary: Delete a feature by ID
 *     tags: [Features]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the feature to delete
 *     responses:
 *       204:
 *         description: Feature successfully deleted
 *       404:
 *         description: Feature not found
 */
// DELETE /api/v1/features/:id - Delete a feature
router.delete('/:id', featureController.deleteFeature);

module.exports = router;