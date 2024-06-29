import { ServiceBroker } from 'moleculer';
import HealthMiddleware from '@cards-against-formality/health-check-mixin';

import Service from './rooms-service';
import WebGatewayService from './web-gateway-service';

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
  nodeID: "rooms-service",
  logger: true,
  middlewares: [
    HealthMiddleware()],
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

console.log(`transporter: ${process.env.TRANSPORTER_URI}`);


// broker.errorHandler = (err, info) => {
//   broker.logger.warn("Log the error:", err);
//   throw err; // Throw further
// }

const MONGO_URI = "mongodb://rooms-mongo-mongodb.default.svc.cluster.local:27017/local";
const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};


const listRooms = async (ctx: any) => {
  return broker.services[0].adapter.find({});
}

broker.createService(Service);
// broker.createService(WebGatewayService);

broker.start().then(() => {
    console.log('Broker started');
})
.catch(err => {
    console.error(err);
    process.exit(1);
});