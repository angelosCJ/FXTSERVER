const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // ✅ Import cors

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

dotenv.config();
const app = express();

// ✅ Use CORS with wildcard (*)
app.use(cors({origin:"*"})); // This allows requests from all origins

app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
