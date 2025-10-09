const Listing = require("../models/listing.model");

/**
 * Returns counts of listings per status for a user.
 */
const getListingCounts = async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: "Missing user_id" });
  }
  try {
    // Query: group by status_id, count for this user
    const db = require("../db/index.js");
    const result = await db.query(
      `SELECT status_id, COUNT(*) as count FROM listings WHERE user_id = $1 GROUP BY status_id`,
      [userId]
    );
    // Format: { counts: { [status_id]: count } }
    const counts = {};
    for (const row of result.rows) {
      counts[row.status_id] = parseInt(row.count, 10);
    }
    return res.json({ counts });
  } catch (err) {
    console.error("Error getting listing counts:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Retrieves all listings, or a filtered list if query parameters are provided.
 */
const getAllListings = async (req, res) => {
  // Support featuresId, featureIds, features, and feature_ids (comma-separated string)
  let featureIds = null;
  if (req.query.featuresId) {
    if (
      typeof req.query.featuresId === "string" &&
      req.query.featuresId.includes(",")
    ) {
      featureIds = req.query.featuresId
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
    } else {
      featureIds = [parseInt(req.query.featuresId)];
    }
  } else if (req.query.featureIds) {
    if (
      typeof req.query.featureIds === "string" &&
      req.query.featureIds.includes(",")
    ) {
      featureIds = req.query.featureIds
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
    } else {
      featureIds = [parseInt(req.query.featureIds)];
    }
  } else if (req.query.features) {
    if (
      typeof req.query.features === "string" &&
      req.query.features.includes(",")
    ) {
      featureIds = req.query.features
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
    } else {
      featureIds = [parseInt(req.query.features)];
    }
  } else if (req.query.feature_ids) {
    if (
      typeof req.query.feature_ids === "string" &&
      req.query.feature_ids.includes(",")
    ) {
      featureIds = req.query.feature_ids
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
    } else if (Array.isArray(req.query.feature_ids)) {
      featureIds = req.query.feature_ids
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));
    } else {
      featureIds = [parseInt(req.query.feature_ids)];
    }
  }
  try {
    const lang = req.query.lang || "en";
    const userId = req.query.user_id;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const offset = req.query.offset ? parseInt(req.query.offset) : null;
    // Support both ownershipTypeId and ownership_type_id (comma-separated string)
    let ownershipTypeId = null;
    if (req.query.ownershipTypeId) {
      if (
        typeof req.query.ownershipTypeId === "string" &&
        req.query.ownershipTypeId.includes(",")
      ) {
        ownershipTypeId = req.query.ownershipTypeId
          .split(",")
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id));
      } else {
        ownershipTypeId = [parseInt(req.query.ownershipTypeId)];
      }
    } else if (req.query.ownership_type_id) {
      if (
        typeof req.query.ownership_type_id === "string" &&
        req.query.ownership_type_id.includes(",")
      ) {
        ownershipTypeId = req.query.ownership_type_id
          .split(",")
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id));
      } else if (Array.isArray(req.query.ownership_type_id)) {
        ownershipTypeId = req.query.ownership_type_id
          .map((id) => parseInt(id))
          .filter((id) => !isNaN(id));
      } else {
        ownershipTypeId = [parseInt(req.query.ownership_type_id)];
      }
    }
    let listingTypeId = null;
    if (req.query.propertyTypeId) {
      if (
        typeof req.query.propertyTypeId === "string" &&
        req.query.propertyTypeId.includes(",")
      ) {
        listingTypeId = req.query.propertyTypeId
          .split(",")
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id));
      } else {
        listingTypeId = [parseInt(req.query.propertyTypeId)];
      }
    } else if (req.query.listing_type_id) {
      if (
        typeof req.query.listing_type_id === "string" &&
        req.query.listing_type_id.includes(",")
      ) {
        listingTypeId = req.query.listing_type_id
          .split(",")
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id));
      } else if (Array.isArray(req.query.listing_type_id)) {
        listingTypeId = req.query.listing_type_id
          .map((id) => parseInt(id))
          .filter((id) => !isNaN(id));
      } else {
        listingTypeId = [parseInt(req.query.listing_type_id)];
      }
    }
    // Support both listingStatusId and listing_status_id (comma-separated string)
    let listingStatusId = null;
    if (req.query.listingStatusId) {
      if (
        typeof req.query.listingStatusId === "string" &&
        req.query.listingStatusId.includes(",")
      ) {
        listingStatusId = req.query.listingStatusId
          .split(",")
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id));
      } else {
        listingStatusId = [parseInt(req.query.listingStatusId)];
      }
    } else if (req.query.listing_status_id) {
      if (
        typeof req.query.listing_status_id === "string" &&
        req.query.listing_status_id.includes(",")
      ) {
        listingStatusId = req.query.listing_status_id
          .split(",")
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id));
      } else if (Array.isArray(req.query.listing_status_id)) {
        listingStatusId = req.query.listing_status_id
          .map((id) => parseInt(id))
          .filter((id) => !isNaN(id));
      } else {
        listingStatusId = [parseInt(req.query.listing_status_id)];
      }
    }
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;
    let locationId = null;
    if (req.query.locationId) {
      if (
        typeof req.query.locationId === "string" &&
        req.query.locationId.includes(",")
      ) {
        locationId = req.query.locationId
          .split(",")
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id));
      } else if (Array.isArray(req.query.locationId)) {
        locationId = req.query.locationId
          .map((id) => parseInt(id))
          .filter((id) => !isNaN(id));
      } else {
        locationId = [parseInt(req.query.locationId)];
      }
    }
    const bedrooms = req.query.bedrooms ? parseInt(req.query.bedrooms) : null;
    const bathrooms = req.query.bathrooms
      ? parseInt(req.query.bathrooms)
      : null;
    const filters = {};
    if (featureIds) filters.featureIds = featureIds;
    if (userId) filters.userId = userId;
    if (ownershipTypeId) filters.ownershipTypeId = ownershipTypeId;
    if (listingTypeId) filters.listingTypeId = listingTypeId;
    if (listingStatusId) filters.listingStatusId = listingStatusId;
    if (minPrice !== null) filters.minPrice = minPrice;
    if (maxPrice !== null) filters.maxPrice = maxPrice;
    if (locationId !== null) filters.locationId = locationId;
    if (bedrooms !== null) filters.bedrooms = bedrooms;
    if (bathrooms !== null) filters.bathrooms = bathrooms;
    // Get paginated listings
    const listings = await Listing.findByFiltersWithTranslations(
      filters,
      lang,
      limit,
      offset
    );
    // Get total count of matching listings (no limit/offset)
    const totalCount = await Listing.countByFilters(filters);
    // Calculate hasNextPage
    let hasNextPage = false;
    if (limit !== null && offset !== null) {
      hasNextPage = offset + listings.length < totalCount;
    } else if (limit !== null) {
      hasNextPage = listings.length < totalCount;
    }
    res.status(200).json({
      data: listings,
      totalCount,
      limit,
      offset,
      hasNextPage,
    });
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
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === 0
      ) {
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
    const existingListing = await Listing.findByPublicIdWithTranslation(
      listing_id,
      "en"
    );
    if (!existingListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Verify ownership
    if (existingListing.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only edit your own listings" });
    }

    // Only use supported fields for updating a listing
    // Remove unsupported fields from req.body
    const { ...rest } = req.body;

    // Clean optional number fields - convert 0, null, empty string to undefined
    const cleanOptionalNumber = (value) => {
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === 0
      ) {
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

    const updatedListing = await Listing.updateByPublicId(
      listing_id,
      cleanedData
    );

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
    const existingListing = await Listing.findByPublicIdWithTranslation(
      listing_id,
      "en"
    );
    if (!existingListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Verify ownership
    if (existingListing.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own listings" });
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
  getListingCounts,
};
