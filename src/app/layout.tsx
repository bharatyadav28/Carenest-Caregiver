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
  title: "Carenest | Caregiver",
  description: "CareNest is a platform for care Provider and care Seeker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className}  antialiased`}> 
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
         <Providers>{children}</Providers>
               <ToastContainer position="top-right" autoClose={3000} />
               </GoogleOAuthProvider>
         </body>
    </html>
  );
}


