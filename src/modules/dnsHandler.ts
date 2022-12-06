import dgram from "dgram";
import DnsQuery from "../interfaces/DnsQuery";
import SocketExtension from "../interfaces/SocketExtension";
import { HeaderParser, QueryParser } from "./dnsParser";
import DnsSinker from "./dnsSinker";

const DnsHandler = (server: SocketExtension, msg: Buffer, rinfo: dgram.RemoteInfo): void => {
	try {
		let domainIsSafe: boolean = true;
		const Header = HeaderParser(msg);
		let Queries: DnsQuery[] = [];
		for(let i = 0; i < Header.QuestionCount; i++) {
			const Query = QueryParser(msg);
			if(!server.WhiteList.has(Query.Name)) {
				if(server.BlackList.has(Query.Name)) {
					domainIsSafe = false;
				}
			}
			Queries.push(Query);
		}
		if(domainIsSafe) {
			const dns = dgram.createSocket("udp4");
			dns.on("message", (recvMsg, remoteInfo) => {
				server.send(recvMsg, rinfo.port, rinfo.address);
			});
			dns.send(msg, 53, "8.8.8.8");
		}
		else {
			const sinkMsg = DnsSinker(msg, Queries);
			server.send(sinkMsg, rinfo.port, rinfo.address);
		}
	}
	catch(error) {
		console.log(error);
	}
};

export default DnsHandler;