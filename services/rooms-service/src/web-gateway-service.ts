import { Service, ServiceBroker } from "moleculer";
import ApiGatewayService from "moleculer-web";

class WebGatewayService extends Service {
    public constructor(broker: ServiceBroker) {
        super(broker);

        this.parseServiceSchema({
            name: "web-gateway",  // Ensure the name is specified
            mixins: [ApiGatewayService],
            actions: {
                list: this.callRoomsList,
            }
        });
    }

    private async callRoomsList(ctx: any) {
        return this.broker.call("rooms.list");
    }
}

export = WebGatewayService;
