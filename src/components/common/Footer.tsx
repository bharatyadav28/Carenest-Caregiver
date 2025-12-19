import Image from "next/image";
import Link from "next/link";
import React from "react";

import {
  youtubeIcon as youtube,
  facebookIcon as facebook,
  tiktokIcon as tiktok,
  instagramIcon as instagram,
  LinkedinIcon as linkedin,
} from "@/lib/svg_icons";

type linkItems = {
  icons?: string | React.JSX.Element;
  title?: string;
  link: string;
};
type linkSection = {
  [section: string]: linkItems[];
};
const link: linkSection[] = [
  {
    Company: [
      { title: "About Us", link: "https://care-nest-teal.vercel.app/aboutUs" },
      { title: "Become A Caregiver", link: "https://care-nest-teal.vercel.app/care-provider" },
      { title: "Who We Are", link: "https://care-nest-teal.vercel.app/who-we-are" },
      { title: "We Accept Medicaid", link: "https://care-nest-teal.vercel.app/medicaid" },
    ],
    Resource: [
      { title: "Transportation", link: "https://care-nest-teal.vercel.app/service/transportation" },
      { title: "Veteran Homecare", link: "https://care-nest-teal.vercel.app/veterans" },
      { title: "Private Sitters", link: "https://care-nest-teal.vercel.app/service/sitter-service" },
      { title: "Homemakers", link: "https://care-nest-teal.vercel.app/service/home-maker" },
    ],
    Carrer: [
      { title: "Sugarland, TX", link: "https://care-nest-teal.vercel.app/location/Sugarland-TX" },
      { title: "Katy, TX", link: "https://care-nest-teal.vercel.app/location/Katy-TX" },
      { title: "Spring, TX", link: "https://care-nest-teal.vercel.app/location/Spring-TX" },
      { title: "Cypress, TX", link: "https://care-nest-teal.vercel.app/location/Cypress-TX" },
      { title: "Pearland, TX", link: "https://care-nest-teal.vercel.app/location/Pearland-TX" },
    ],
    Help: [
      { title: "FAQ's", link: "https://care-nest-teal.vercel.app/faq" },
      { title: "Privacy Policy", link: "https://care-nest-teal.vercel.app/privacy" },
      { title: "Resources", link: "https://care-nest-teal.vercel.app/resources" },
      { title: "Veterans Financial Assistance", link: "https://care-nest-teal.vercel.app/veterans" },
    ],
  },
];

const footerLink: linkItems[] = [
  {
    title: "Terms",
    link: "https://care-nest-teal.vercel.app/terms",
  },
  {
    title: "Privacy",
    link: "https://care-nest-teal.vercel.app/privacy",
  },
  {
    title: "Legal",
    link: "https://care-nest-teal.vercel.app/legal",
  },
];
const socialLink: linkItems[] = [
  {
    icons: youtube,
    link: "/",
  },
  {
    icons: tiktok,
    link: "/",
  },
  {
    icons: linkedin,
    link: "/",
  },
  {
    icons: instagram,
    link: "/",
  },
  {
    icons: facebook,
    link: "/",
  },
];

const Footer = () => {
  return (
    <>
      <div className="py-8 mt-15 lg:px-24 md:px-12 px-6 bg-primary-foreground text-white overflow-hidden">
        <div className="flex flex-wrap justify-between gap-2">
          <div className="sm:w-79 w-full">
            <div className="relative w-50 h-30">
              <Link href={"/dashboard"}>
                <Image src={"/Logo.svg"} alt="Logo" fill />
              </Link>
            </div>
            <p className="mt-4 text-lg text-gray-300">
              CareWorks provides compassionate, personalized eldercare services that support seniors and their families with dignity and respect.
            </p>
          </div>

          <FooterLink title="Company" links={link[0]["Company"]} />
          <FooterLink title="Other Services" links={link[0]["Resource"]} />
          <FooterLink title="Location we Cover" links={link[0]["Carrer"]} />
          <FooterLink title="Quick Links" links={link[0]["Help"]} />
        </div>

        <div className="my-7 flex items-center justify-center flex-wrap gap-y-5">
          <div>
            <h1
              className="font-bold xl:text-[130px] lg:text-[80px] 
           text-gray-400/30 mx-auto tracking-widest sm:mt-0 mt-2"
            >
              CAREWORKS
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-y-4 items-center justify-between sm:my-4 sm:mt-4 mt-8">
          <div className="flex items-center justify-around sm:w-auto w-full gap-x-5">
            {footerLink.map((item, i) => (
              <a 
                href={item.link} 
                key={i} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lg text-gray-200 hover:text-white transition-colors hover:underline"
              >
                {item.title}
              </a>
            ))}
          </div>

          <div className="sm:w-auto w-full flex justify-center sm:order-0 order-1">
            <p className="text-lg text-gray-100">
              © 2025 Copyright | All rights reserved
            </p>
          </div>

          <div className="flex sm:w-auto w-full justify-around items-center gap-x-5">
            {socialLink.map((item, i) => (
              <a
                href={item.link}
                key={i}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-200 p-2 rounded-full border border-gray-200 hover:border-white hover:text-white transition-colors"
              >
                {item.icons}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="relative bottom-25">
        <hr />
      </div>
    </>
  );
};

const FooterLink = ({
  title,
  links,
}: {
  title: string;
  links: linkItems[];
}) => {
  return (
    <div>
      <p className="font-semibold mb-4 text-xl">{title}</p>
      <ul className="flex flex-col gap-4">
        {links.map((item, index) => (
          <li className="text-lg text-gray-300 hover:text-white transition-colors" key={index}>
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Footer;