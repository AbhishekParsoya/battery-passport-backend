require('dotenv').config();
const express = require('express');
const runConsumer = require('./consumer');

const app = express();

app.get('/', (req, res) => {
  res.send('Notification Service is running and listening to Kafka events...');
});

const start = async () => {
  await runConsumer();
  app.listen(process.env.PORT, () =>
    console.log(`Notification Service running on ${process.env.PORT}`)
  );
};

start();
