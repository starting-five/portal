import express from "express";
import listingImageController from "../controllers/listing_image.controller";
const router = express.Router();

/**
/**
 * @swagger
 * components:
 *   schemas:
 *     ListingImage:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         listing_id:
 *           type: integer
 *         url:
 *           type: string
 *         alt_text:
 *           type: string
 *         sort_order:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - listing_id
 *         - url
 *         - sort_order
 *         - created_at
 *   tags:
 *     - name: Listing Images
 *       description: API for managing images associated with listings
 */

/**
 * @swagger
 * /listing_images:
 *   get:
 *     summary: Retrieve a list of all listing images
 *     tags: [Listing Images]
 *     responses:
 *       200:
 *         description: A list of listing images.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ListingImage'
 */
// GET /api/v1/listing_images - Retrieve all listing images
router.get("/", listingImageController.getAllListingImages);

/**
 * @swagger
 * /listing_images/{id}:
 *   get:
 *     summary: Retrieve a single listing image by ID
 *     tags: [Listing Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the listing image
 *     responses:
 *       200:
 *         description: A single listing image object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListingImage'
 *       404:
 *         description: Listing image not found
 */
// GET /api/v1/listing_images/:id - Retrieve a single listing image
router.get("/:id", listingImageController.getListingImageById);

/**
 * @swagger
 * /listing_images:
 *   post:
 *     summary: Create a new listing image
 *     tags: [Listing Images]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewListingImage'
 *     responses:
 *       201:
 *         description: The created listing image.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListingImage'
 */

/**
 * @swagger
 * /listing_images/bulk:
 *   post:
 *     summary: Bulk create listing images
 *     tags: [Listing Images]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/NewListingImage'
 *     responses:
 *       201:
 *         description: The created listing images.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ListingImage'
 */
// POST /api/v1/listing_images/bulk - Bulk create listing images
router.post("/bulk", listingImageController.bulkCreateListingImages);

// POST /api/v1/listing_images - Create a new listing image
router.post("/", listingImageController.createListingImage);

/**
 * @swagger
 * /listing_images/{id}:
 *   put:
 *     summary: Update an existing listing image
 *     tags: [Listing Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the listing image to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewListingImage'
 *     responses:
 *       200:
 *         description: The updated listing image.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListingImage'
 *       404:
 *         description: Listing image not found
 */
// PUT /api/v1/listing_images/:id - Update a listing image
router.put("/:id", listingImageController.updateListingImage);

/**
 * @swagger
 * /listing_images/{id}:
 *   delete:
 *     summary: Delete a listing image by ID
 *     tags: [Listing Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the listing image to delete
 *     responses:
 *       204:
 *         description: Listing image successfully deleted
 *       404:
 *         description: Listing image not found
 */
// DELETE /api/v1/listing_images/:id - Delete a listing image
router.delete("/:id", listingImageController.deleteListingImage);

export default router;
