import fs from "fs";
import path from "path";
import https from "https";
import SocketExtension from "../interfaces/SocketExtension";
import { EventEmitter } from "stream";

const defaultConfig = {
	BlackListURL: "https://raw.githubusercontent.com/HoshizoraProject/OpenData/main/domain/unsafelist.txt",
	WhiteListURL: "https://raw.githubusercontent.com/anudeepND/whitelist/master/domains/whitelist.txt"
}

const initialize = (server: SocketExtension) => {
	const configFilePath = path.join(__dirname, "..", "config.json");
	const blackListPath = path.join(__dirname, "..", "blacklist.txt");
	const whiteListPath = path.join(__dirname, "..", "whitelist.txt");

	if(!fs.existsSync(configFilePath)) {
		fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 4));
		console.log("config.json created.");
	}

	const config = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
	const blackListStream = fs.createWriteStream(blackListPath);
	const whiteListStream = fs.createWriteStream(whiteListPath);

	const ListSync = new EventEmitter();
	https.get(config.WhiteListURL as string, (res) => {
		res.on("end", () => {
			console.log(`${whiteListPath} downloaded.`);
			server.WhiteList = new Set(fs.readFileSync(whiteListPath, "utf-8").split("\n"));
		});
		res.pipe(whiteListStream);
	});
	https.get(config.BlackListURL as string, (res) => {
		res.on("end", () => {
			console.log(`${blackListPath} downloaded.`);
			server.BlackList = new Set(fs.readFileSync(blackListPath, "utf-8").split("\n"));
			ListSync.emit("done");
		});
		res.pipe(blackListStream);
	});
	ListSync.on("done", () => {
		server.bind(53, "127.0.0.1");
	});
};

export default initialize;