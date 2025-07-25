const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'passport-service',
  brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();

const produceEvent = async (eventType, payload) => {
  await producer.connect();
  await producer.send({
    topic: eventType,
    messages: [{ value: JSON.stringify(payload) }]
  });
};

module.exports = { produceEvent };
