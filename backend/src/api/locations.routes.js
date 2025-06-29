const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: API for managing geographical locations
 */

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Retrieve a list of all locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: A list of locations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 */
// GET /api/v1/locations - Retrieve all locations
router.get('/', locationController.getAllLocations);

/**
 * @swagger
 * /locations/{id}:
 *   get:
 *     summary: Retrieve a single location by ID
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the location to retrieve
 *     responses:
 *       200:
 *         description: A single location object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Location not found
 */
// GET /api/v1/locations/:id - Retrieve a single location
router.get('/:id', locationController.getLocationById);

/**
 * @swagger
 * /locations:
 *   post:
 *     summary: Create a new location
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewLocation'
 *     responses:
 *       201:
 *         description: The created location.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 */
// POST /api/v1/locations - Create a new location
router.post('/', locationController.createLocation);

/**
 * @swagger
 * /locations/{id}:
 *   put:
 *     summary: Update an existing location
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the location to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewLocation'
 *     responses:
 *       200:
 *         description: The updated location.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Location not found
 */
// PUT /api/v1/locations/:id - Update a location
router.put('/:id', locationController.updateLocation);

/**
 * @swagger
 * /locations/{id}:
 *   delete:
 *     summary: Delete a location by ID
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the location to delete
 *     responses:
 *       204:
 *         description: Location successfully deleted
 *       404:
 *         description: Location not found
 */
// DELETE /api/v1/locations/:id - Delete a location
router.delete('/:id', locationController.deleteLocation);

module.exports = router;