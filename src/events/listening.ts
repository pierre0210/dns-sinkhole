import SocketExtension from "../interfaces/SocketExtension";

const Listening = (server: SocketExtension) => {
	console.log("Sever started");
	console.log(`${server.address().address}:${server.address().port}`);
};

export default Listening;
