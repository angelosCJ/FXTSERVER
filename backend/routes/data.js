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


module.exports = router;
