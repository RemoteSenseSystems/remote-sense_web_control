import "@/styles/globals.css";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html suppressHydrationWarning lang="en">
            <head>
                <title>RemoteSense Systems</title>
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-touch-fullscreen" content="yes" />
                <meta name="apple-mobile-web-app-title" content="React Navigation" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            </head>
            <body
                className={clsx(
                    "min-h-screen bg-black font-sans antialiased",
                    fontSans.variable,
                )}
            >
                {children}
            </body>
        </html>
    );
}