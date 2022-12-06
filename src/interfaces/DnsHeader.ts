import Flag from "./Flag";

interface DnsHeader {
	ID: number;
	Flag: Flag;
	QuestionCount: number;
	RRCount: number;
	AuthRRCount: number;
	AddRRCount: number;
};

export default DnsHeader;