const express = require('express');
const router = express.Router();

const listingsRouter = require('./listings.routes');
const featuresRouter = require('./features.routes');
const featureCategoriesRouter = require('./feature_categories.routes');
const listingImagesRouter = require('./listing_images.routes');
const listingStatusesRouter = require('./listing_statuses.routes');
const listingTypesRouter = require('./listing_types.routes');
const locationsRouter = require('./locations.routes');
const ownershipTypesRouter = require('./ownership_types.routes');
const lookupsRouter = require('./lookups.routes');

// Mount the listings router at /listings
router.use('/listings', listingsRouter);

// Mount the features router at /features
router.use('/features', featuresRouter);

// Mount the feature categories router at /feature_categories
router.use('/feature_categories', featureCategoriesRouter);

// Mount the listing images router at /listing_images
router.use('/listing_images', listingImagesRouter);

// Mount the listing statuses router at /listing_statuses
router.use('/listing_statuses', listingStatusesRouter);

// Mount the listing types router at /listing_types
router.use('/listing_types', listingTypesRouter);

// Mount the locations router at /locations
router.use('/locations', locationsRouter);

// Mount the ownership types router at /ownership_types
router.use('/ownership_types', ownershipTypesRouter);

// When you add user routes, you would mount them here:
// const usersRouter = require('./users.routes');
// router.use('/users', usersRouter);
// Mount the lookups router at /lookups
const oRouter = require('./lookups.routes');
router.use('/lookups', lookupsRouter);

module.exports = router;