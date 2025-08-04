const express = require('express');
const router = express.Router();
const lookupsController = require('../controllers/lookups.controller');


/**
 * @swagger
 * /lookups:
 *   get:
 *     summary: Get all lookup tables and their translations
 *     description: Returns all lookup data (listing types, ownership types, listing statuses, feature categories, features) with translations and sort_order, grouped for frontend dropdowns and filters.
 *     tags:
 *       - Lookups
 *     responses:
 *       200:
 *         description: All lookup tables and their translations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 listing_types:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LookupItem'
 *                 ownership_types:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LookupItem'
 *                 listing_statuses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LookupItem'
 *                 feature_categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FeatureCategoryItem'
 *                 features:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FeatureItem'
 *       500:
 *         description: Failed to fetch lookups
 *
 * components:
 *   schemas:
 *     LookupItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         key:
 *           type: string
 *         sort_order:
 *           type: integer
 *         labels:
 *           type: object
 *           additionalProperties:
 *             type: string
 *           description: Language code to label mapping
 *     FeatureCategoryItem:
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *         sort_order:
 *           type: integer
 *         labels:
 *           type: object
 *           additionalProperties:
 *             type: string
 *     FeatureItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         key:
 *           type: string
 *         category_key:
 *           type: string
 *         sort_order:
 *           type: integer
 *         labels:
 *           type: object
 *           additionalProperties:
 *             type: string
 */
router.get('/', lookupsController.getAllLookups);

module.exports = router;
