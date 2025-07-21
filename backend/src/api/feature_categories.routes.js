/**
 * @swagger
 * tags:
 *   name: Feature Categories
 *   description: API for managing feature categories (amenity/highlight groupings)
 */

/**
 * @swagger
 * /feature_categories:
 *   get:
 *     summary: Retrieve a list of all feature categories
 *     tags: [Feature Categories]
 *     responses:
 *       200:
 *         description: A list of feature categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   key:
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
const featureCategoryController = require('../controllers/feature_category.controller');

// GET /api/v1/feature-categories - Retrieve all feature categories with translations
router.get('/', featureCategoryController.getAllFeatureCategories);

module.exports = router;
