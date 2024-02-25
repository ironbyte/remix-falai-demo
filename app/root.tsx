import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { LinksFunction } from "@remix-run/node";

import tailwindHref from "~/styles/tailwind.css?url";

export const links: LinksFunction = () => {
  return [
    { rel: "preload", href: tailwindHref, as: "style" },
    { rel: "stylesheet", href: tailwindHref },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = "dark";

  return (
    <html lang="en" className={`${theme} h-full overflow-x-hidden antialiased`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background text-foreground">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
