const Listing = require("../models/listing.model");

/**
 * Retrieves all listings, or a filtered list if query parameters are provided.
 */
const getAllListings = async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const userId = req.query.user_id;
    let listings;
    if (userId) {
      listings = await Listing.findAllByUserWithTranslations(userId, lang);
    } else {
      listings = await Listing.findAllWithTranslations(lang);
    }
    res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error.stack);
    res
      .status(500)
      .json({ message: "An error occurred while fetching listings." });
  }
};

/**
 * Retrieves a single listing by its ID.
 */
const getListingById = async (req, res) => {
  try {
    const { listing_id } = req.params;
    const lang = req.query.lang || "en";
    const listing = await Listing.findByPublicIdWithTranslation(
      listing_id,
      lang
    );
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({
      ...listing,
    });
  } catch (error) {
    console.error("Error fetching listing by ID:", error.stack);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the listing." });
  }
};

/**
 * Creates a new listing.
 */
const createListing = async (req, res) => {
  // console.time('Create-Listing-Total');
  try {
    // console.time('Auth-Check');
    if (!req.user || !req.user.id) {
      // console.timeEnd('Auth-Check');
      // console.timeEnd('Create-Listing-Total');
      return res.status(401).json({ message: "Authentication required" });
    }
    // console.timeEnd('Auth-Check');
    
    // console.time('Data-Preparation');
    // // Debug: Log what we received from frontend
    // console.log("📋 Backend received req.body:", req.body);
    // console.log("📋 Building size:", req.body.building_size_sqm, "Type:", typeof req.body.building_size_sqm);
    // console.log("📋 Land size:", req.body.land_size_sqm, "Type:", typeof req.body.land_size_sqm);
    // console.log("📋 Bedrooms:", req.body.bedrooms, "Type:", typeof req.body.bedrooms);
    // console.log("📋 Bathrooms:", req.body.bathrooms, "Type:", typeof req.body.bathrooms);
    
    // Only use supported fields for creating a listing
    const { ...rest } = req.body;
    
    // Clean optional number fields - convert 0, null, empty string to undefined
    const cleanOptionalNumber = (value) => {
      if (value === null || value === undefined || value === "" || value === 0) {
        return undefined;
      }
      return value;
    };
    
    // Clean the optional number fields
    const cleanedData = {
      ...rest,
      building_size_sqm: cleanOptionalNumber(rest.building_size_sqm),
      land_size_sqm: cleanOptionalNumber(rest.land_size_sqm),
      bedrooms: cleanOptionalNumber(rest.bedrooms),
      bathrooms: cleanOptionalNumber(rest.bathrooms),
      year_built: cleanOptionalNumber(rest.year_built),
    };
    
    // Set user_id from authenticated user
    const listingData = { ...cleanedData, user_id: req.user.id };
    
    // console.log("📋 Data being sent to model:", listingData);
    // console.timeEnd('Data-Preparation');
    
    // console.time('Database-Insert');
    const newListing = await Listing.create(listingData);
    // console.timeEnd('Database-Insert');
    
    // console.timeEnd('Create-Listing-Total');
    res.status(201).json(newListing);
  } catch (error) {
    // console.timeEnd('Create-Listing-Total');
    console.error("Error creating listing:", error.stack);
    res
      .status(500)
      .json({ message: "An error occurred while creating the listing." });
  }
};

/**
 * Updates an existing listing.
 */
const updateListing = async (req, res) => {
  try {
    // Check authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { listing_id } = req.params;
    
    // First, check if listing exists and verify ownership
    const existingListing = await Listing.findByPublicIdWithTranslation(listing_id, 'en');
    if (!existingListing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    
    // Verify ownership
    if (existingListing.user_id !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own listings" });
    }

    // Only use supported fields for updating a listing
    // Remove unsupported fields from req.body
    const { ...rest } = req.body;
    
    // Clean optional number fields - convert 0, null, empty string to undefined
    const cleanOptionalNumber = (value) => {
      if (value === null || value === undefined || value === "" || value === 0) {
        return undefined;
      }
      return value;
    };
    
    // Clean the optional number fields
    const cleanedData = {
      ...rest,
      building_size_sqm: cleanOptionalNumber(rest.building_size_sqm),
      land_size_sqm: cleanOptionalNumber(rest.land_size_sqm),
      bedrooms: cleanOptionalNumber(rest.bedrooms),
      bathrooms: cleanOptionalNumber(rest.bathrooms),
      year_built: cleanOptionalNumber(rest.year_built),
    };
    
    const updatedListing = await Listing.updateByPublicId(listing_id, cleanedData);
    
    res.status(200).json(updatedListing);
  } catch (error) {
    console.error("Error updating listing:", error.stack);
    res
      .status(500)
      .json({ message: "An error occurred while updating the listing." });
  }
};

/**
 * Deletes a listing by its ID.
 */
const deleteListing = async (req, res) => {
  try {
    // Check authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { listing_id } = req.params;
    
    // First, check if listing exists and verify ownership
    const existingListing = await Listing.findByPublicIdWithTranslation(listing_id, 'en');
    if (!existingListing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    
    // Verify ownership
    if (existingListing.user_id !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own listings" });
    }

    await Listing.removeByPublicId(listing_id);
    res.status(204).send(); // 204 No Content is standard for a successful deletion
  } catch (error) {
    console.error("Error deleting listing:", error.stack);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the listing." });
  }
};

module.exports = {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
};
