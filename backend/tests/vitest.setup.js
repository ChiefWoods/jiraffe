import { beforeAll, afterAll, afterEach } from "vitest";
import server from "../mocks/node.js";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
