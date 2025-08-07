const express = require('express');
const Data = require('../models/datascheme');
const { encrypt, decrypt } = require('../utils/encryption');
const auth = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/send', auth, async (req, res) => {
  const { date, amountSpent, productName, categoryName } = req.body;
  const encryptedDate = encrypt(date);
  const encryptedAmountSpent = encrypt(amountSpent);
  const encryptedProductName = encrypt(productName);
  const encryptedCategoryName = encrypt(categoryName);

  const newData = new Data({
    userId: req.user.userId,
    date: encryptedDate,
    amountSpent:encryptedAmountSpent,
    productName: encryptedProductName,
    categoryName: encryptedCategoryName
  });

  await newData.save();
  res.json({ message: 'Data saved' });
});

router.get('/getData', auth, async (req, res) => {
  const data = await Data.find({ userId: req.user.userId });

  const decrypted = data.map(item => ({
    _id: item._id,
    date: decrypt(item.date),
    amountSpent: decrypt(item.amountSpent),
    productName: decrypt(item.productName),
    categoryName: decrypt(item.categoryName),
  }));

  res.json(decrypted);
});

// DELETE route to remove a specific data entry by ID
router.delete('/delete/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Data.findOneAndDelete({ _id: id, userId: req.user.userId });

    if (!deleted) {
      return res.status(404).json({ error: 'Data not found or not authorized' });
    }

    res.json({ message: 'Data deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get("/data/sum", auth, async (req, res) => {
  try {
    const userData = await Data.find({ userId: req.user.userId });

    // Decrypt and parse to float
    let totalMoneySpent = 0;

    userData.forEach(item => {
      const decryptedAmount = decrypt(item.amountSpent);
      const amountAsFloat = parseFloat(decryptedAmount);
      if (!isNaN(amountAsFloat)) {
        totalMoneySpent += amountAsFloat;
      }
    });

    res.status(200).json({ totalMoneySpent });
  } catch (error) {
    console.error("Error retrieving sum:", error);
    res.status(500).json({ message: "Error, unable to get sum of all data" });
  }
});


module.exports = router;
