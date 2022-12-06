import dgram from "dgram";
import ErrorHandler from "./events/error";
import DnsHandler from "./events/dns";
import Listening from "./events/listening";

const server = dgram.createSocket("udp4");

server.on("message", (msg, rinfo) => {
	DnsHandler(msg, rinfo, server);
});

server.on("listening", Listening);

server.on("error", ErrorHandler);

server.bind(53, "127.0.0.1");