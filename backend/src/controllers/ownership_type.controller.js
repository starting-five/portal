const OwnershipType = require('../models/ownership_type.model');

/**
 * Retrieves all ownership types.
 */
const getAllOwnershipTypes = async (req, res) => {
  try {
    const types = await OwnershipType.findAll();
    res.status(200).json(types);
  } catch (error) {
    console.error('Error fetching ownership types:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching ownership types.' });
  }
};

/**
 * Retrieves a single ownership type by its ID.
 */
const getOwnershipTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const type = await OwnershipType.findById(id);
    if (!type) {
      return res.status(404).json({ message: 'Ownership type not found' });
    }
    res.status(200).json(type);
  } catch (error) {
    console.error('Error fetching ownership type by ID:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching the ownership type.' });
  }
};

/**
 * Creates a new ownership type.
 */
const createOwnershipType = async (req, res) => {
  try {
    const newType = await OwnershipType.create(req.body);
    res.status(201).json(newType);
  } catch (error) {
    console.error('Error creating ownership type:', error.stack);
    res.status(500).json({ message: 'An error occurred while creating the ownership type.' });
  }
};

/**
 * Updates an existing ownership type.
 */
const updateOwnershipType = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedType = await OwnershipType.update(id, req.body);
    if (!updatedType) {
      return res.status(404).json({ message: 'Ownership type not found' });
    }
    res.status(200).json(updatedType);
  } catch (error) {
    console.error('Error updating ownership type:', error.stack);
    res.status(500).json({ message: 'An error occurred while updating the ownership type.' });
  }
};

/**
 * Deletes an ownership type.
 */
const deleteOwnershipType = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await OwnershipType.remove(id);
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Ownership type not found' });
    }
    res.status(204).send(); // 204 No Content is standard for a successful deletion
  } catch (error) {
    console.error('Error deleting ownership type:', error.stack);
    res.status(500).json({ message: 'An error occurred while deleting the ownership type.' });
  }
};

module.exports = {
  getAllOwnershipTypes,
  getOwnershipTypeById,
  createOwnershipType,
  updateOwnershipType,
  deleteOwnershipType,
};