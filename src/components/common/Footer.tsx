import { ChevronRight } from "lucide-react";
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
      { title: "Features", link: "/" },
      { title: "Pricing", link: "/" },
      { title: "About us", link: "/" },
      { title: "Contact", link: "/" },
    ],
    Resource: [
      { title: "Blog", link: "/" },
      { title: "Customer stories", link: "/" },
      { title: "Information", link: "/" },
      { title: "Legal", link: "/" },
      { title: "Payments", link: "/" },
    ],
    Carrer: [
      { title: "Jobs", link: "/" },
      { title: "Hiring", link: "/" },
      { title: "News", link: "/" },
      { title: "Tips and Tricks", link: "/" },
    ],
    Help: [
      { title: "FAQ", link: "/" },
      { title: "Help Center", link: "/" },
      { title: "Support", link: "/" },
    ],
  },
];

const footerLink: linkItems[] = [
  {
    title: "Terms",
    link: "/",
  },
  {
    title: "Privacy",
    link: "/",
  },
  {
    title: "Cookies",
    link: "/",
  },
  {
    title: "Legal",
    link: "/",
  },
  {
    title: "Recalls",
    link: "/",
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
    <div className=" py-8 mt-15 lg:px-24 md:px-12 px-6 bg-primary-foreground text-white overflow-hidden">
      <div className="flex flex-wrap justify-between gap-2  ">
        <div className="sm:w-79 w-full ">
          <div className="relative w-24 h-24 x">
            <Image src={"/Logo.svg"} alt="Logo" fill />
          </div>
          <p className="mt-4 text-sm text-gray-300">
            CARENEST: Pioneering Advanced Medical Solutions to Elevate
            Healthcare Services and Improve Patient Outcomes
          </p>  
        </div>

        <FooterLink title="Company" links={link[0]["Company"]} />
        <FooterLink title="Resource" links={link[0]["Resource"]} />
        <FooterLink title="Carrer" links={link[0]["Carrer"]} />
        <FooterLink title="Help" links={link[0]["Help"]} />
      </div>

      <div className="my-7 flex items-center justify-between flex-wrap gap-y-5">
        <div>
          <h3 className="text-lg font-medium lg:mb-3">
            Subscribe to our newsletter
          </h3>
          <div className="flex">
            <input
              type="text"
              placeholder="Email address"
              className="outline-none border-b py-2 sm:w-60 w-70"
            />
            <button className="bg-primary text-black px-4 py-4 rounded-t-lg cursor-pointer">
              <ChevronRight />{" "}
            </button>
          </div>
        </div>

        <div>
          <h1
            className="font-bold xl:text-[120px] lg:text-[80px] 
           text-gray-400/30 tracking-widest sm:mt-0 mt-2"
          >
            CARENEST
          </h1>
        </div>
      </div>

      <hr />

      <div className="flex flex-wrap gap-y-4 items-center justify-between sm:my-4 sm:mt-4 mt-8">
        <div className="flex items-center justify-around sm:w-auto w-full gap-x-5">
          {footerLink.map((item, i) => (
            <Link href={item.link} key={i} className="text-sm text-gray-200">
              {item.title}
            </Link>
          ))}
        </div>

        <div className="sm:w-auto w-full flex justify-center sm:order-0 order-1">
          <p className="text-sm text-gray-100 ">
            {" "}
            © 2024 Copyright By Sansbro - IMEDIC
          </p>
        </div>

        <div className="flex sm:w-auto w-full justify-around items-center gap-x-5">
          {socialLink.map((item, i) => (
            <Link
              href={item.link}
              key={i}
              className="text-sm text-gray-200 p-2 rounded-full border border-gray-200"
            >
              {item.icons}
            </Link>
          ))}
        </div>
      </div>
    </div>
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
      <p className="font-semibold mb-4">{title}</p>
      <ul className="flex flex-col gap-2">
        {links.map((item, index) => (
          <li className="text-sm text-gray-300" key={index}>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Footer;
