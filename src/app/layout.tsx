import { Roboto } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "CareWorks | Caregiver",
  description: "CareWorks is a platform for care Provider and care Seeker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head>
        <link rel="icon" href="/logos.svg" />
      </head>
      <body className={`${roboto.className}  antialiased`}> 
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
         <Providers>{children}</Providers>
               <ToastContainer position="top-right" className="p-2" autoClose={3000} />
               </GoogleOAuthProvider>
         </body>
    </html>
  );
}


