import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import saiyanSans from "./assets/fonts/Saiyan-Sans.ttf?url";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preload", href: saiyanSans, as: "font", type: "font/ttf", crossOrigin: "anonymous" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1c2541" />
        <Meta />
        <Links />
      </head>
      <body>
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

export function HydrateFallback() {
  return (
    <main className="fatal" role="status">
      Preparing your game…
    </main>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  const stack = import.meta.env.DEV && error instanceof Error ? error.stack : undefined;

  return (
    <main className="fatal">
      <h1>{isNotFound ? "Page not found" : "Something went wrong"}</h1>
      <p>{isNotFound ? "That page doesn't exist." : "Reload the page to start a new game."}</p>
      <a className="button button--primary" href="/">
        Back to the game
      </a>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
