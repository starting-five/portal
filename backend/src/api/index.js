const express = require('express');
const router = express.Router();

const listingsRouter = require('./listings.routes');
const currenciesRouter = require('./currencies.routes');
const featuresRouter = require('./features.routes');
const listingImagesRouter = require('./listing_images.routes');
const listingStatusesRouter = require('./listing_statuses.routes');
const listingTypesRouter = require('./listing_types.routes');
const locationsRouter = require('./locations.routes');
const priceUnitsRouter = require('./price_units.routes');
const ownershipTypesRouter = require('./ownership_types.routes');

// Mount the listings router at /listings
router.use('/listings', listingsRouter);

// Mount the currencies router at /currencies
router.use('/currencies', currenciesRouter);

// Mount the features router at /features
router.use('/features', featuresRouter);

// Mount the listing images router at /listing_images
router.use('/listing_images', listingImagesRouter);

// Mount the listing statuses router at /listing_statuses
router.use('/listing_statuses', listingStatusesRouter);

// Mount the listing types router at /listing_types
router.use('/listing_types', listingTypesRouter);

// Mount the locations router at /locations
router.use('/locations', locationsRouter);

// Mount the price units router at /price_units
router.use('/price_units', priceUnitsRouter);

// Mount the ownership types router at /ownership_types
router.use('/ownership_types', ownershipTypesRouter);

// When you add user routes, you would mount them here:
// const usersRouter = require('./users.routes');
// router.use('/users', usersRouter);

module.exports = router;