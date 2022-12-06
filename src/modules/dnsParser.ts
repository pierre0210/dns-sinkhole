import ResourceRecord from "../enums/ResourceRecord";
import DnsHeader from "../interfaces/DnsHeader";
import DnsQuery from "../interfaces/DnsQuery";
import Flag from "../interfaces/Flag";

const HeaderParser = (msg: Buffer): DnsHeader => {
	const flag: Flag = {
		QR: msg.readUintBE(2, 2) >> 15,
		OPCode: (msg.readUintBE(2, 4) >> 11) & ((1 << 5) - 1),
		AA: (msg.readUintBE(2, 2) >> 10) & 1,
		TC: (msg.readUintBE(2, 2) >> 9) & 1,
		RD: (msg.readUintBE(2, 2) >> 8) & 1,
		RA: (msg.readUintBE(2, 2) >> 7) & 1,
		RCode: msg.readUintBE(2, 2) & ((1 << 5) - 1)
	};

	const header: DnsHeader = {
		ID: msg.readUIntBE(0, 2),
		Flag: flag,
		QuestionCount: msg.readUintBE(4, 2),
		RRCount: msg.readUintBE(6, 2),
		AuthRRCount: msg.readUintBE(8, 2),
		AddRRCount: msg.readUintBE(10, 2)
	};
	console.log(header);
	return header;
};

const QueryParser = (msg: Buffer): DnsQuery => {
	let domain = "";
	let index = 12;
	let subStringLength = msg.readUint8(index++);
	
	while(subStringLength != 0) {
		for(let i = 0; i < subStringLength; i++) {
			domain = domain.padEnd(domain.length + 1, String.fromCharCode(msg.readUInt8(index++)));
		}
		subStringLength = msg.readUInt8(index++);
		if(subStringLength != 0) {
			domain = domain.padEnd(domain.length + 1, ".");
		}
	}

	const query: DnsQuery = {
		Name: domain,
		Type: ResourceRecord[msg.readUIntBE(index, 2)],
		Class: msg.readUIntBE(index + 2, 2)
	};
	console.log(query);
	return query;
};

export { HeaderParser, QueryParser };