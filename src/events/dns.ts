import dgram from "dgram";
import DnsQuery from "../interfaces/DnsQuery";
import { HeaderParser, QueryParser } from "../modules/dnsParser";

const DnsHandler = (msg: Buffer, rinfo: dgram.RemoteInfo, server: dgram.Socket): void => {
	try {
		const Header = HeaderParser(msg);
		let Queries: DnsQuery[] = [];
		for(let i = 0; i < Header.QuestionCount; i++) {
			const Query = QueryParser(msg);
			Queries.push(Query);
		}
		
		const dns = dgram.createSocket("udp4");
		dns.on("message", (recvMsg, remoteInfo) => {
			server.send(recvMsg, rinfo.port, rinfo.address);
		});
		dns.send(msg, 53, "8.8.8.8");
	}
	catch(error) {
		console.log(error);
	}
};

export default DnsHandler;