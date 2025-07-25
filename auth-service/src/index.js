require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const swaggerDocs = require('./swagger');

const app = express();
app.use(express.json());
swaggerDocs(app);

app.use('/api/auth', authRoutes);
console.log('MONGO_URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => console.log(`Auth service running on ${process.env.PORT}`));
  })
  .catch(console.error);
