import { Service, ServiceBroker } from "moleculer";
import DbService from "moleculer-db";
import MongoDBAdapter from "moleculer-db-adapter-mongo";

const MONGO_URI = "mongodb://rooms-mongo-mongodb.default.svc.cluster.local:27017/local";
const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

export default class RoomsService extends Service {
    public constructor(broker: ServiceBroker) {
        super(broker);

        this.parseServiceSchema({
            name: "rooms",
            // mixins: [DbService],
            // adapter: new MongoDBAdapter(MONGO_URI, MONGO_OPTIONS),
            // collection: "rooms",
            actions: {
                list: {
                    cache: false,
                    handler: this.listRooms
                }
            }
        });

        // this.on("connected", () => this.logger.info("MongoDB adapter connected."));
        // this.on("disconnected", () => {
        //     this.logger.warn("MongoDB adapter disconnected. Retrying...");
        //     setTimeout(() => this.connect(), 5000);  // Retry connection after 5 seconds
        // });
    }

    private async listRooms(ctx: any) {
        return {};//this.adapter.find({});
    }
}
