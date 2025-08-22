/* eslint-disable @typescript-eslint/no-require-imports */
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
const usersRouter = require('./users.routes');

router.use('/listings', listingsRouter);
router.use('/features', featuresRouter);
router.use('/feature_categories', featureCategoriesRouter);
router.use('/listing_images', listingImagesRouter);
router.use('/listing_statuses', listingStatusesRouter);
router.use('/listing_types', listingTypesRouter);
router.use('/locations', locationsRouter);
router.use('/ownership_types', ownershipTypesRouter);
router.use('/users', usersRouter);
router.use('/lookups', lookupsRouter);

module.exports = router;