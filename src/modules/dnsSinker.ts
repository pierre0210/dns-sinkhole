import ResourceRecord from "../enums/ResourceRecord";
import DnsQuery from "../interfaces/DnsQuery";

const DnsSinker = (msg: Buffer, Queries: DnsQuery[]): Buffer => {
	msg.writeUintBE(msg.readUIntBE(2, 2) ^ (1 << 15), 2, 2);
	let ResponseList: Buffer[] = [msg];
	let ResponseSize: number = msg.length;
	for(let i = 0; i < Queries.length; i++) {
		const names = Queries[i].Name.split(".");
		const nameBuff = Buffer.alloc(names.length * 2 + 1);
		for(let j = 0; j < names.length; j++) {
			nameBuff.writeUIntBE(names[j].length, j * 2, 1);
			nameBuff.writeUIntBE(names[j].charCodeAt(0), j * 2 + 1, 1);
		}
		// console.log(nameBuff);

		const typeBuff = Buffer.alloc(2);
		typeBuff.writeUIntBE(ResourceRecord[Queries[i].Type as keyof typeof ResourceRecord], 0, 2);
		// console.log(typeBuff);

		const classBuff = Buffer.alloc(2);
		classBuff.writeUintBE(Queries[i].Class, 0, 2);
		// console.log(classBuff);

		const ttlBuff = Buffer.alloc(4);
		ttlBuff.writeUIntBE(1 << 16, 0, 4);
		// console.log(ttlBuff);

		const dataBuff = Buffer.alloc(2 + 4);
		dataBuff.writeUIntBE(4, 0, 2);
		// console.log(dataBuff);

		const resBuff = Buffer.concat([nameBuff, typeBuff, classBuff, ttlBuff, dataBuff], (nameBuff.length + typeBuff.length + classBuff.length + ttlBuff.length + dataBuff.length));
		ResponseList.push(resBuff);
		ResponseSize += resBuff.length;
	}
	return Buffer.concat(ResponseList, ResponseSize);
};

export default DnsSinker;