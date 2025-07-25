require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passportRoutes = require('./routes/passport');
const swaggerDocs = require('./swagger');

const app = express();
app.use(express.json());
swaggerDocs(app);
app.use('/api/passports', passportRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Passport Service: Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Passport Service running on ${process.env.PORT}`);
    });
  })
  .catch(console.error);
