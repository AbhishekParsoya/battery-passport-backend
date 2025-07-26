const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');
const sendMail = require('./mailer');

const isDev = process.env.NODE_ENV === 'development';

let consumer;

const logNotification = (message) => {
  const logPath = path.join(__dirname, '../notifications.log');
  fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
};

const runConsumer = async () => {
  if (!isDev) {
    console.log('⚠️ Kafka is disabled in production (NODE_ENV !== development)');
    return;
  }

  const kafka = new Kafka({
    clientId: 'notification-service',
    brokers: [process.env.KAFKA_BROKER],
  });

  consumer = kafka.consumer({ groupId: 'notification-group' });

  try {
    await consumer.connect();

    const topics = ['passport.created', 'passport.updated', 'passport.deleted'];
    for (const topic of topics) {
      await consumer.subscribe({ topic, fromBeginning: true });
    }

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const data = message.value.toString();
        const log = `Event: ${topic}, Data: ${data}`;
        console.log(log);
        logNotification(log);

        // Uncomment to enable email sending:
        // await sendMail(`Battery Passport ${topic}`, data);
      },
    });

    console.log('✅ Kafka Consumer is running...');
  } catch (err) {
    console.error('❌ Kafka Consumer failed to start:', err);
  }
};

module.exports = runConsumer;
