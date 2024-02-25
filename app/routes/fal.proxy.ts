import { createProxy } from "~/fal.proxy.server";
import { json } from "@remix-run/node";

export const { action, loader } = createProxy({ json });
