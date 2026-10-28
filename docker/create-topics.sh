#!/usr/bin/env bash
echo "Waiting for Kafka broker to be available..."
cub kafka-ready -b kafka:9092 1 30 || true

echo "Creating topics with 3 partitions and 7 days retention (604800000 ms)..."
TOPICS=(
  "activation.requested"
  "activation.requested.dlq"
  "billing.events"
  "billing.events.dlq"
  "provisioning.events"
  "provisioning.events.dlq"
  "activation.events"
  "activation.events.dlq"
)

for TOPIC in "${TOPICS[@]}"; do
  /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka:9092 --create --if-not-exists --topic "$TOPIC" --partitions 3 --replication-factor 1 --config retention.ms=604800000
  echo "Topic $TOPIC ready."
done

echo "All topics created successfully."
