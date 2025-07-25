const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');

const sendMail = require('./mailer');

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

const logNotification = (message) => {
  const logPath = path.join(__dirname, '../notifications.log');
  fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
};

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'passport.created', fromBeginning: true });
  await consumer.subscribe({ topic: 'passport.updated', fromBeginning: true });
  await consumer.subscribe({ topic: 'passport.deleted', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = message.value.toString();
      const log = `Event: ${topic}, Data: ${data}`;
      console.log(log);
      logNotification(log);

      //await sendMail(`Battery Passport ${topic}`, data);
    }
  });
};

module.exports = runConsumer;
