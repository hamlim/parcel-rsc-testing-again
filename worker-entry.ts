import "./dist/server.js";

export default {
	fetch: (...args: any[]) => {
		console.log("Wrapper is called");
		return globalThis.app.fetch(...args);
	},
};
