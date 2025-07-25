require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/document');
const swaggerDocs = require('./swagger');

const app = express();
app.use(express.json());
swaggerDocs(app);

app.use('/api/documents', routes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Document Service: Mongo connected');
    app.listen(process.env.PORT, () => {
      console.log(`Document Service running on port ${process.env.PORT}`);
    });
  })
  .catch(console.error);
