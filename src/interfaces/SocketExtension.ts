import dgram from "dgram";

interface SocketExtension extends dgram.Socket {
	BlackList: Set<string>
	WhiteList: Set<string>
};

export default SocketExtension;