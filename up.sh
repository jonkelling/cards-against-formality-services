#!/bin/bash

NAMESPACE=default  # or your namespace

kubectl scale deployment admin-gateway-service --replicas=1 --namespace=$NAMESPACE
kubectl scale deployment cards-service --replicas=1 --namespace=$NAMESPACE
kubectl scale deployment clients-service --replicas=1 --namespace=$NAMESPACE
kubectl scale deployment decks-service --replicas=1 --namespace=$NAMESPACE
kubectl scale deployment games-service --replicas=1 --namespace=$NAMESPACE
kubectl scale deployment nats --replicas=1 --namespace=$NAMESPACE
kubectl scale deployment nginx-gateway --replicas=1 --namespace=$NAMESPACE
kubectl scale deployment redis-master --replicas=1 --namespace=$NAMESPACE
kubectl scale deployment rooms-service --replicas=1 --namespace=$NAMESPACE
kubectl scale deployment web-gateway-service --replicas=1 --namespace=$NAMESPACE
kubectl scale deployment websocket-gateway-service --replicas=1 --namespace=$NAMESPACE

echo "Scaled down deployments"