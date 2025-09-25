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
      { title: "About Us", link: "/" },
      { title: "Pricing", link: "/" },
    
        { title: "Features", link: "/" },
      { title: "We accept Medicaid", link: "/" },
    ],
    Resource: [
      { title: "Transportation", link: "/" },
      { title: "Veteran Homecare", link: "/" },
      { title: "Private Sitters", link: "/" },
      { title: "Homemakers", link: "/" },
  
    ],
    Carrer: [
      { title: "Sugarland, TX", link: "/" },
      { title: "Katy, TX", link: "/" },
      { title: "Spring, TX", link: "/" },
      { title: "Cypress, TX", link: "/" },
    ],
    Help: [
      { title: "FAQ's", link: "/" },
      { title: "Privacy Policy", link: "/" },
      { title: "Resources", link: "/" },
        { title: "Veterans Finacial Assistance", link: "/" },
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
      <>
    <div className=" py-8 mt-15 lg:px-24 md:px-12 px-6 bg-primary-foreground text-white overflow-hidden ">
      <div className="flex flex-wrap justify-between gap-2 ">
        <div className="sm:w-79 w-full ">
          <div className="relative w-50 h-30 x">
             <Link href={"/dashboard"}>
            <Image src={"/Logo.svg"} alt="Logo" fill />
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-300">
          CareWorks provides compassionate, personalized eldercare services that support seniors and their families with dignity and respect.
          </p>  
        </div>

        <FooterLink title="Company" links={link[0]["Company"]} />
        <FooterLink title="Other Services" links={link[0]["Resource"]} />
        <FooterLink title="Location we Cover" links={link[0]["Carrer"]} />
        <FooterLink title="Quick Links" links={link[0]["Help"]} />
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
            className="font-bold xl:text-[130px] lg:text-[80px] 
           text-gray-400/30 mx-auto tracking-widest sm:mt-0 mt-2"
          >
            CAREWORKS
          </h1>
          <div></div>
        </div>
      </div>

    

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
    <div className="relative bottom-25">  <hr /></div>
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
      <p className="font-semibold mb-4">{title}</p>
      <ul className="flex flex-col gap-4">
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
