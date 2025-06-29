const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currency.controller');

/**
 * @swagger
 * tags:
 *   name: Currencies
 *   description: API for managing currency types
 */

/**
 * @swagger
 * /currencies:
 *   get:
 *     summary: Retrieve a list of all currencies
 *     tags: [Currencies]
 *     responses:
 *       200:
 *         description: A list of currencies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Currency'
 */
// GET /api/v1/currencies - Retrieve all currencies
router.get('/', currencyController.getAllCurrencies);

/**
 * @swagger
 * /currencies/{id}:
 *   get:
 *     summary: Retrieve a single currency by ID
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the currency
 *     responses:
 *       200:
 *         description: A single currency object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 *       404:
 *         description: Currency not found
 */
// GET /api/v1/currencies/:id - Retrieve a single currency
router.get('/:id', currencyController.getCurrencyById);

/**
 * @swagger
 * /currencies:
 *   post:
 *     summary: Create a new currency
 *     tags: [Currencies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewCurrency'
 *     responses:
 *       201:
 *         description: The created currency.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 */
// POST /api/v1/currencies - Create a new currency
router.post('/', currencyController.createCurrency);

/**
 * @swagger
 * /currencies/{id}:
 *   put:
 *     summary: Update an existing currency
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the currency to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewCurrency'
 *     responses:
 *       200:
 *         description: The updated currency.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 *       404:
 *         description: Currency not found
 */
// PUT /api/v1/currencies/:id - Update a currency
router.put('/:id', currencyController.updateCurrency);

/**
 * @swagger
 * /currencies/{id}:
 *   delete:
 *     summary: Delete a currency by ID
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the currency to delete
 *     responses:
 *       204:
 *         description: Currency successfully deleted
 *       404:
 *         description: Currency not found
 */
// DELETE /api/v1/currencies/:id - Delete a currency
router.delete('/:id', currencyController.deleteCurrency);

module.exports = router;