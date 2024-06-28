import { ServiceBroker } from 'moleculer';
import HealthMiddleware from '@cards-against-formality/health-check-mixin';

import Service from './rooms-service2';

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
  nodeID: "rooms-service",
  logger: true,
  middlewares: [HealthMiddleware()],
  logLevel: 'info',
  metrics: false,
  cacher: {
    type: 'Redis',
    options: {
      ttl: 3600 ,
      prefix: 'ROOMS-MOL',
      redis: {
        host: 'redis-master.default.svc.cluster.local',
        port: process.env.REDIS_PORT,
      }
    }
  },
  tracing: {
		enabled: true,
		exporter: {
			type: "Console", // Console exporter is only for development!
			options: {
				// Custom logger
				logger: null,
				// Using colors
				colors: true,
				// Width of row
				width: 100,
				// Gauge width in the row
				gaugeWidth: 40
			}
		}
	},
  transporter: process.env.TRANSPORTER_URI,
  circuitBreaker,
  retryPolicy,
  registry
});

broker.errorHandler = (err, info) => {
  broker.logger.warn("Log the error:", err);
  throw err; // Throw further
}

const service = new Service(broker);
broker.createService(service);

broker.start().then(() => {
    console.log('Broker started');
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
