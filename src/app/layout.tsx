import { Providers } from "@/redux/providers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";

import "./globals.css";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Trazo",
    description: "Aplicación Trazo",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body
                className={`relative ${geistSans.variable} ${geistMono.variable}`}
            >
                <Toaster
                    richColors
                    position="top-center"
                    toastOptions={{
                        style: {
                            background: "#fff",
                            borderBlockColor: "#e2e8f0",
                        },
                    }}
                    closeButton
                />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
