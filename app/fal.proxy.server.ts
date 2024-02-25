// !!! Credits to drochetti (https://github.com/fal-ai/fal-js/pull/36)

import {
  json,
  type ActionFunctionArgs,
  type ActionFunction,
  type LoaderFunctionArgs,
  type LoaderFunction,
  json as jsonFunction,
} from "@remix-run/node";

type FalRemixProxy = {
  action: ActionFunction;
  loader: LoaderFunction;
};

type FalRemixProxyOptions = {
  json: typeof jsonFunction;
};

import { handleRequest } from "@fal-ai/serverless-proxy";

function fromHeaders(headers: Headers): Record<string, string | string[]> {
  // Object.fromEntries(headers.entries());
  const result: Record<string, string | string[]> = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function createProxy({ json }: FalRemixProxyOptions): FalRemixProxy {
  const proxy = async ({
    request,
  }: ActionFunctionArgs | LoaderFunctionArgs) => {
    const responseHeaders = new Headers();
    return handleRequest({
      id: "remix",
      method: request.method,
      respondWith: (status, data) =>
        json(data, { status, headers: responseHeaders }),
      getHeaders: () => fromHeaders(request.headers),
      getHeader: (name) => request.headers.get(name),
      sendHeader: (name, value) => responseHeaders.set(name, value),
      getBody: async () => JSON.stringify(await request.json()),
    });
  };
  return {
    action: proxy,
    loader: proxy,
  };
}

export const { action, loader } = createProxy({ json });
