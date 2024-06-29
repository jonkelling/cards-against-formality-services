import { Service, ServiceBroker } from "moleculer";

class WebGatewayService extends Service {
    public constructor(broker: ServiceBroker) {
        super(broker);

        this.parseServiceSchema({
            name: "web-gateway",  // Ensure the name is specified
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
