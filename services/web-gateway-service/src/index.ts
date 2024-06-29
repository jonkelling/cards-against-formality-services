import { ServiceBroker } from 'moleculer';
import HealthMiddleware from '@cards-against-formality/health-check-mixin';

import Service from './web-gateway-service';
import dotenv from 'dotenv';

dotenv.config();

const registry = {
  strategy: 'CpuUsage'
};

const circuitBreaker = {
  enabled: true,
  halfOpenTime: 10 * 1000,
};

const retryPolicy = {
  enabled: true,
  retries: 5,
  delay: 100,
  maxDelay: 2000,
  factor: 2,
  check: err => err && !!(err as any).retryable
};

const broker = new ServiceBroker({
  logger: true,
  middlewares: [HealthMiddleware()],
  logLevel: 'info',
  metrics: false,
  cacher: {
    type: 'Redis',
    options: {
      ttl: 3600 ,
      prefix: 'WEB-G-MOL',
      redis: {
        host: 'redis-master.default.svc.cluster.local',
        port: process.env.REDIS_PORT,
      }
    }
  },
  transporter: process.env.TRANSPORTER_URI,
  circuitBreaker,
  retryPolicy,
  registry
});

new Service(broker);

broker.start();
