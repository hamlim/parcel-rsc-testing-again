import { callAction, renderRequest } from "@parcel/rsc/server";
import { Hono } from "hono";

// Page components. These must have "use server-entry" so they are treated as code splitting entry points.
import { Page } from "./Page";

const app = new Hono();

if (process.env.NODE_ENV === "development") {
	const { serveStatic } = require("@hono/node-server");
	app.use("/*", serveStatic({ root: "./dist" }));
}

app.get("/", (c) => {
	console.log("Request?!?!?");
	return renderRequest(c.req.raw, <Page />, { component: Page });
});

app.post("/", async (c) => {
	const id = c.req.header("rsc-action-id");

	const result = await callAction(c.req.raw, id);
	let root: any = <Page />;
	if (id) {
		root = { result, root };
	}
	return renderRequest(c.req.raw, root, { component: Page });
});

export default app.fetch;
globalThis.app = app;

if (process.env.NODE_ENV === "development") {
	const { serve } = require("@hono/node-server");

	serve({
		fetch: app.fetch,
		port: 3001,
	});
}
