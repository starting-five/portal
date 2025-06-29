const PriceUnit = require('../models/price_unit.model');

/**
 * Retrieves all price units.
 */
const getAllPriceUnits = async (req, res) => {
  try {
    const units = await PriceUnit.findAll();
    res.status(200).json(units);
  } catch (error) {
    console.error('Error fetching price units:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching price units.' });
  }
};

/**
 * Retrieves a single price unit by its ID.
 */
const getPriceUnitById = async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await PriceUnit.findById(id);
    if (!unit) {
      return res.status(404).json({ message: 'Price unit not found' });
    }
    res.status(200).json(unit);
  } catch (error) {
    console.error('Error fetching price unit by ID:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching the price unit.' });
  }
};

/**
 * Creates a new price unit.
 */
const createPriceUnit = async (req, res) => {
  try {
    const newUnit = await PriceUnit.create(req.body);
    res.status(201).json(newUnit);
  } catch (error) {
    console.error('Error creating price unit:', error.stack);
    res.status(500).json({ message: 'An error occurred while creating the price unit.' });
  }
};

/**
 * Updates an existing price unit.
 */
const updatePriceUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUnit = await PriceUnit.update(id, req.body);
    if (!updatedUnit) {
      return res.status(404).json({ message: 'Price unit not found' });
    }
    res.status(200).json(updatedUnit);
  } catch (error) {
    console.error('Error updating price unit:', error.stack);
    res.status(500).json({ message: 'An error occurred while updating the price unit.' });
  }
};

/**
 * Deletes a price unit.
 * @param {number} id The ID of the price unit to delete.
 * @returns {Promise<number>} A promise that resolves to the number of deleted rows (1 or 0).
 */
const deletePriceUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await PriceUnit.remove(id);
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Price unit not found' });
    }
    res.status(204).send(); // 204 No Content is standard for a successful deletion
  } catch (error) {
    console.error('Error deleting price unit:', error.stack);
    res.status(500).json({ message: 'An error occurred while deleting the price unit.' });
  }
};

module.exports = {
  getAllPriceUnits,
  getPriceUnitById,
  createPriceUnit,
  updatePriceUnit,
  deletePriceUnit,
};