import dgram from "dgram";
import Error from "./events/error";
import DnsHandler from "./modules/dnsHandler";
import Listening from "./events/listening";
import SocketExtension from "./interfaces/SocketExtension";
import initialize from "./modules/initialize";

const server = dgram.createSocket("udp4") as SocketExtension;

server.on("message", (msg, rinfo) => {
	DnsHandler(server, msg, rinfo);
});

server.on("listening", () => {
	Listening(server);
});

server.on("error", Error);

initialize(server);