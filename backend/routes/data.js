const express = require('express');
const Data = require('../models/datascheme');
const { encrypt, decrypt } = require('../utils/encryption');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/send', auth, async (req, res) => {
  try {
    let { date, amountSpent, productName, categoryName } = req.body;

    // Convert all to strings before encrypting
    date = String(date);
    amountSpent = String(amountSpent);
    productName = String(productName);
    categoryName = String(categoryName);

    if (!date || !amountSpent || !productName || !categoryName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const encryptedDate = encrypt(date);
    const encryptedAmountSpent = encrypt(amountSpent);
    const encryptedProductName = encrypt(productName);
    const encryptedCategoryName = encrypt(categoryName);

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
    }

    const newData = new Data({
      userId: req.user.userId,
      date: encryptedDate,
      amountSpent: encryptedAmountSpent,
      productName: encryptedProductName,
      categoryName: encryptedCategoryName,
    });

    await newData.save();

    res.json({ message: 'Data saved' });
  } catch (err) {
    console.error('Error in /send route:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// CREATE
router.post('/send', auth, async (req, res) => {
  try {
    let { date, amountSpent, productName, categoryName } = req.body;

    // Convert all to strings before encrypting
    date = String(date);
    amountSpent = String(amountSpent);
    productName = String(productName);
    categoryName = String(categoryName);

    if (!date || !amountSpent || !productName || !categoryName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const encryptedDate = encrypt(date);
    const encryptedAmountSpent = encrypt(amountSpent);
    const encryptedProductName = encrypt(productName);
    const encryptedCategoryName = encrypt(categoryName);

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
    }

    const newData = new Data({
      userId: req.user.userId,
      date: encryptedDate,
      amountSpent: encryptedAmountSpent,
      productName: encryptedProductName,
      categoryName: encryptedCategoryName,
    });

    await newData.save();

    res.json({ message: 'Data saved' });
  } catch (err) {
    console.error('Error in /send route:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// READ (Get all user data)
router.get('/read', auth, async (req, res) => {
  try {
    const data = await Data.find({ userId: req.user.userId });

    const decryptedData = data.map(item => ({
      _id: item._id,
      userId: item.userId,
      date: decrypt(item.date),
      amountSpent: decrypt(item.amountSpent),
      productName: decrypt(item.productName),
      categoryName: decrypt(item.categoryName),
    }));

    res.json(decryptedData);
  } catch (err) {
    console.error('Error in /read route:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE (Delete by ID)
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const deleted = await Data.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error('Error in /delete route:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// SUM of amountSpent
router.get('/sum', auth, async (req, res) => {
  try {
    const data = await Data.find({ userId: req.user.userId });

    let total = 0;
    data.forEach(item => {
      const amount = parseFloat(decrypt(item.amountSpent));
      if (!isNaN(amount)) total += amount;
    });

    res.json({ totalAmountSpent: total });
  } catch (err) {
    console.error('Error in /sum route:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
