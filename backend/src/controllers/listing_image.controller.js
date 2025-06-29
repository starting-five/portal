const ListingImage = require('../models/listing_image.model');

/**
 * Retrieves all listing images.
 */
const getAllListingImages = async (req, res) => {
  try {
    const images = await ListingImage.findAll();
    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching listing images:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching listing images.' });
  }
};

/**
 * Retrieves a single listing image by its ID.
 */
const getListingImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await ListingImage.findById(id);
    if (!image) {
      return res.status(404).json({ message: 'Listing image not found' });
    }
    res.status(200).json(image);
  } catch (error) {
    console.error('Error fetching listing image by ID:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching the listing image.' });
  }
};

/**
 * Retrieves all listing images for a specific listing ID.
 */
const getImagesForListing = async (req, res) => {
  try {
    const { listingId } = req.params; // Assuming a route like /listings/:listingId/images
    const images = await ListingImage.findByListingId(listingId);
    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images for listing:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching images for the listing.' });
  }
};

/**
 * Creates a new listing image.
 */
const createListingImage = async (req, res) => {
  try {
    const newImage = await ListingImage.create(req.body);
    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error creating listing image:', error.stack);
    res.status(500).json({ message: 'An error occurred while creating the listing image.' });
  }
};

/**
 * Updates an existing listing image.
 */
const updateListingImage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedImage = await ListingImage.update(id, req.body);
    if (!updatedImage) {
      return res.status(404).json({ message: 'Listing image not found' });
    }
    res.status(200).json(updatedImage);
  } catch (error) {
    console.error('Error updating listing image:', error.stack);
    res.status(500).json({ message: 'An error occurred while updating the listing image.' });
  }
};

/**
 * Deletes a listing image.
 */
const deleteListingImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await ListingImage.remove(id);
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Listing image not found' });
    }
    res.status(204).send(); // 204 No Content is standard for a successful deletion
  } catch (error) {
    console.error('Error deleting listing image:', error.stack);
    res.status(500).json({ message: 'An error occurred while deleting the listing image.' });
  }
};

module.exports = {
  getAllListingImages,
  getListingImageById,
  getImagesForListing, // Added for potential nested routes
  createListingImage,
  updateListingImage,
  deleteListingImage,
};