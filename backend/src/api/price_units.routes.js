const express = require('express');
const router = express.Router();
const priceUnitController = require('../controllers/price_unit.controller');

/**
 * @swagger
 * tags:
 *   name: Price Units
 *   description: API for managing price units (e.g., total, per_year)
 */

/**
 * @swagger
 * /price_units:
 *   get:
 *     summary: Retrieve a list of all price units
 *     tags: [Price Units]
 *     responses:
 *       200:
 *         description: A list of price units.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PriceUnit'
 */
// GET /api/v1/price_units - Retrieve all price units
router.get('/', priceUnitController.getAllPriceUnits);

/**
 * @swagger
 * /price_units/{id}:
 *   get:
 *     summary: Retrieve a single price unit by ID
 *     tags: [Price Units]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the price unit to retrieve
 *     responses:
 *       200:
 *         description: A single price unit object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PriceUnit'
 *       404:
 *         description: Price unit not found
 */
// GET /api/v1/price_units/:id - Retrieve a single price unit
router.get('/:id', priceUnitController.getPriceUnitById);

/**
 * @swagger
 * /price_units:
 *   post:
 *     summary: Create a new price unit
 *     tags: [Price Units]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewPriceUnit'
 *     responses:
 *       201:
 *         description: The created price unit.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PriceUnit'
 */
// POST /api/v1/price_units - Create a new price unit
router.post('/', priceUnitController.createPriceUnit);

/**
 * @swagger
 * /price_units/{id}:
 *   put:
 *     summary: Update an existing price unit
 *     tags: [Price Units]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the price unit to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewPriceUnit'
 *     responses:
 *       200:
 *         description: The updated price unit.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PriceUnit'
 *       404:
 *         description: Price unit not found
 */
// PUT /api/v1/price_units/:id - Update a price unit
router.put('/:id', priceUnitController.updatePriceUnit);

/**
 * @swagger
 * /price_units/{id}:
 *   delete:
 *     summary: Delete a price unit by ID
 *     tags: [Price Units]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the price unit to delete
 *     responses:
 *       204:
 *         description: Price unit successfully deleted
 *       404:
 *         description: Price unit not found
 */
// DELETE /api/v1/price_units/:id - Delete a price unit
router.delete('/:id', priceUnitController.deletePriceUnit);

module.exports = router;