const express = require('express');
const router = express.Router();
const ownershipTypeController = require('../controllers/ownership_type.controller');

/**
 * @swagger
 * tags:
 *   name: Ownership Types
 *   description: API for managing ownership types (e.g., freehold, leasehold)
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
 *                 $ref: '#/components/schemas/OwnershipType'
 */
// GET /api/v1/ownership_types - Retrieve all ownership types
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
// GET /api/v1/ownership_types/:id - Retrieve a single ownership type
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
 *             $ref: '#/components/schemas/NewOwnershipType'
 *     responses:
 *       201:
 *         description: The created ownership type.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OwnershipType'
 */
// POST /api/v1/ownership_types - Create a new ownership type
router.post('/', ownershipTypeController.createOwnershipType);

/**
 * @swagger
 * /ownership_types/{id}:
 *   put:
 *     summary: Update an existing ownership type
 *     tags: [Ownership Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the ownership type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewOwnershipType'
 *     responses:
 *       200:
 *         description: The updated ownership type.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OwnershipType'
 *       404:
 *         description: Ownership type not found
 */
// PUT /api/v1/ownership_types/:id - Update an ownership type
router.put('/:id', ownershipTypeController.updateOwnershipType);

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