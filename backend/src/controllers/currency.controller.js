const Currency = require('../models/currency.model');

/**
 * Retrieves all currencies.
 */
const getAllCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.findAll();
    res.status(200).json(currencies);
  } catch (error) {
    console.error('Error fetching currencies:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching currencies.' });
  }
};

/**
 * Retrieves a single currency by its ID.
 */
const getCurrencyById = async (req, res) => {
  try {
    const { id } = req.params;
    const currency = await Currency.findById(id);
    if (!currency) {
      return res.status(404).json({ message: 'Currency not found' });
    }
    res.status(200).json(currency);
  } catch (error) {
    console.error('Error fetching currency by ID:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching the currency.' });
  }
};

/**
 * Creates a new currency.
 */
const createCurrency = async (req, res) => {
  try {
    const newCurrency = await Currency.create(req.body);
    res.status(201).json(newCurrency);
  } catch (error) {
    console.error('Error creating currency:', error.stack);
    res.status(500).json({ message: 'An error occurred while creating the currency.' });
  }
};

/**
 * Updates an existing currency.
 */
const updateCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCurrency = await Currency.update(id, req.body);
    if (!updatedCurrency) {
      return res.status(404).json({ message: 'Currency not found' });
    }
    res.status(200).json(updatedCurrency);
  } catch (error) {
    console.error('Error updating currency:', error.stack);
    res.status(500).json({ message: 'An error occurred while updating the currency.' });
  }
};

/**
 * Deletes a currency.
 */
const deleteCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await Currency.remove(id);
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Currency not found' });
    }
    res.status(204).send(); // 204 No Content is standard for a successful deletion
  } catch (error) {
    console.error('Error deleting currency:', error.stack);
    res.status(500).json({ message: 'An error occurred while deleting the currency.' });
  }
};

module.exports = {
  getAllCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  deleteCurrency,
};