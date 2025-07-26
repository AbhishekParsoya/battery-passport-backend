const { Kafka } = require('kafkajs');

const isProd = process.env.NODE_ENV === 'production';
let producer;

if (!isProd) {
  const kafka = new Kafka({
    clientId: 'passport-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  });

  producer = kafka.producer();
  producer.connect().catch((err) => {
    console.error('❌ Failed to connect Kafka producer:', err);
  });
}

const produceEvent = async (eventType, payload) => {
  if (isProd) {
    console.log(`[MOCK KAFKA] Topic: ${eventType}, Payload: ${JSON.stringify(payload)}`);
    return;
  }

  try {
    await producer.send({
      topic: eventType,
      messages: [{ value: JSON.stringify(payload) }],
    });
    console.log(`✅ Kafka Event Sent: ${eventType}`);
  } catch (err) {
    console.error(`❌ Kafka send failed: ${eventType}`, err);
  }
};

module.exports = { produceEvent };
