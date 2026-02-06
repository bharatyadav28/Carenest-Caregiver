"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import youtube from "../../../public/Youtube.svg";
import facebook from "../../../public/Facebook.svg";
import tiktok from "../../../public/tiktok.svg";
import instagram from "../../../public/instagram.svg";
import linkedin from "../../../public/linkedin.svg";

type SocialLink = {
  id: string;
  url: string;
  icon: string;
  platform: string;
};

type FooterData = {
  footerDescription: string;
  locations: string[];
  socialLinks: SocialLink[];
};

type linkItems = {
  icons?: string;
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
    "Other Services": [
      { title: "Transportation", link: "https://care-nest-teal.vercel.app/service/transportation" },
      { title: "Veteran Homecare", link: "https://care-nest-teal.vercel.app/veterans" },
      { title: "Private Sitters", link: "https://care-nest-teal.vercel.app/service/sitter-service" },
      { title: "Homemakers", link: "https://care-nest-teal.vercel.app/service/home-maker" },
    ],
    "Quick Links": [
      { title: "FAQs", link: "https://care-nest-teal.vercel.app/faq" },
      { title: "Privacy Policy", link: "https://care-nest-teal.vercel.app/privacy" },
      { title: "Resources", link: "https://care-nest-teal.vercel.app/resources" },
      { title: "Veterans Financial Assistance", link: "https://care-nest-teal.vercel.app/veterans" },
    ],
  },
];

const footerLink: linkItems[] = [
  { title: "Terms", link: "https://care-nest-teal.vercel.app/terms" },
  { title: "Privacy", link: "https://care-nest-teal.vercel.app/privacy" },
  { title: "Legal", link: "https://care-nest-teal.vercel.app/legal" },
];

const Footer = () => {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchFooter = async () => {
   

      try {
        const endpoint = `https://api.careworks.biz/api/v1/footer`;
        const res = await fetch(endpoint);
        console.log("Footer API response status:", res);  
        if (res.ok) {
          const json = await res.json();
          const footer = json?.data?.footer;
          
          if (footer) {
            setFooterData({
              footerDescription: footer.footerDescription || "",
              locations: footer.locations || [],
              socialLinks: footer.socialLinks || [],
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch footer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooter();
  }, []);

  // Prepare dynamic location links from API
  const locationLinks: linkItems[] = (footerData?.locations || []).map((loc) => {
    // Remove commas, trim, replace multiple spaces with one, then replace spaces with hyphens
    // e.g., 'Sugarland, TX' -> 'Sugarland-TX'
    const cleaned = loc.replace(/,/g, '').trim().replace(/\s+/g, '-');
    return {
      title: loc,
      link: `https://care-nest-teal.vercel.app/location/${cleaned}`,
    };
  });

  // Prepare dynamic social links from API
  const dynamicSocialLinks: linkItems[] = (footerData?.socialLinks || []).map((social) => ({
    icons: social.icon,
    link: social.url,
  }));

  // Fallback social links if API doesn't return any
  const defaultSocialLinks: linkItems[] = [
    { icons: youtube.src, link: "https://youtube.com", title: "YouTube" },
    { icons: facebook.src, link: "https://facebook.com", title: "Facebook" },
    { icons: tiktok.src, link: "https://tiktok.com", title: "TikTok" },
    { icons: instagram.src, link: "https://instagram.com", title: "Instagram" },
    { icons: linkedin.src, link: "https://linkedin.com", title: "LinkedIn" },
  ];

  const socialLinksToUse = dynamicSocialLinks.length > 0 ? dynamicSocialLinks : defaultSocialLinks;

  return (
    <div className="py-8 mt-15 lg:px-24 md:px-12 px-6 bg-primary-foreground text-white overflow-hidden">
      <div className="flex flex-wrap justify-between gap-6 mb-8">
        {/* Logo and Description */}
        <div className="sm:w-80 w-full">
          <div className="relative w-50 h-30">
            <Link href="/" className="relative w-45 h-45 block cursor-pointer ">
              <Image 
                src="/Logo.svg" 
                alt="Carenest logo" 
                fill 
                priority 
                className="object-contain pb-3"
              />
            </Link>
          </div>
          <p className="mt-4 text-lg text-gray-300">
            CareWorks provides compassionate, personalized eldercare services that support seniors and their families with dignity and respect.
          </p>
          
          {/* Social Links */}
          <div className="mt-6">
            <p className="text-base font-medium mb-3 text-[#F2A307]">Follow us on Social Platforms</p>
            <div className="flex items-center gap-4">
              {socialLinksToUse.map((item, i) => (
                <a
                  href={item.link}
                  key={i}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                  aria-label={`Visit our ${item.title || 'social'} page`}
                >
                  <div className="relative w-12 h-12">
                    <Image
                      src={item.icons || ""}
                      alt="social icon"
                      fill
                      className="object-contain"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Company Links */}
        <div className="min-w-[200px]">
          <FooterLink title="Company" links={link[0]["Company"]} />
        </div>
        
        {/* Other Services */}
        <div className="min-w-[200px]">
          <FooterLink title="Other Services" links={link[0]["Other Services"]} />
        </div>
        
        {/* Locations we cover */}
        <div className="min-w-[200px]">
          {loading ? (
            <div>
              <p className="font-semibold mb-4 text-xl">Locations we cover</p>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded animate-pulse w-32" />
                <div className="h-4 bg-gray-700 rounded animate-pulse w-28" />
                <div className="h-4 bg-gray-700 rounded animate-pulse w-36" />
              </div>
            </div>
          ) : (
            <FooterLink 
              title="Locations we cover" 
              links={locationLinks.length > 0 ? locationLinks : [
                { title: "Sugarland, TX", link: "https://care-nest-teal.vercel.app/location/Sugarland-TX" },
                { title: "Katy, TX", link: "https://care-nest-teal.vercel.app/location/Katy-TX" },
                { title: "Spring, TX", link: "https://care-nest-teal.vercel.app/location/Spring-TX" },
                { title: "Cypress, TX", link: "https://care-nest-teal.vercel.app/location/Cypress-TX" },
                { title: "Pearland, TX", link: "https://care-nest-teal.vercel.app/location/Pearland-TX" },
              ]} 
            />
          )}
        </div>
        
        {/* Quick Links */}
        <div className="min-w-[200px]">
          <FooterLink title="Quick Links" links={link[0]["Quick Links"]} />
        </div>
      </div>

      {/* Proud Partners Section */}
      <div className="my-8 flex flex-col items-center">
        <div className="w-full flex flex-col items-center">
          <h3 className="text-2xl font-medium mb-6 text-white text-center">Proud Partners</h3>
          <div className="flex flex-col lg:flex-row lg:flex-wrap justify-center items-center gap-6 lg:gap-12 w-full max-w-6xl">
            {/* First row - single wide image */}
            <div className="flex justify-center w-full lg:w-auto">
              <Image 
                src="/veterans-care.png" 
                alt="Veterans Care Coordination" 
                width={220} 
                height={60} 
                className="object-contain h-12 lg:h-16 w-auto" 
              />
            </div>
            {/* Second row - three images */}
            <div className="flex flex-row flex-nowrap lg:flex-wrap justify-center items-center gap-4 lg:gap-12 w-full lg:w-auto">
              <Image 
                src="/caring-com.png" 
                alt="Caring.com" 
                width={100} 
                height={100} 
                className="object-contain h-13 lg:h-16 w-auto flex-shrink-0" 
              />
              <Image 
                src="/a-place-for-mom.png" 
                alt="A Place for Mom" 
                width={220} 
                height={60} 
                className="object-contain h-12 lg:h-16 w-auto flex-shrink-0" 
              />
              <Image 
                src="/carescout.png" 
                alt="Carescout Qualtiy network" 
                width={100} 
                height={100} 
                className="object-contain h-13 lg:h-16 w-auto flex-shrink-0" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* CAREWORKS branding */}
      <div className="my-8 flex items-center justify-center">
        <div>
          <h1 className="font-bold text-5xl sm:text-6xl md:text-7xl lg:text-[80px] xl:text-[135px] text-gray-400/30 tracking-widest">
            CAREWORKS
          </h1>
        </div>
      </div>

      <hr className="border-0 h-px bg-white/20 my-6" />

      <div className="flex flex-col sm:flex-row flex-wrap gap-y-4 items-center justify-between">
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
            © 2026 Copyright | All rights reserved
          </p>
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
      <p className="font-semibold mb-4 text-xl">{title}</p>
      <ul className="flex flex-col gap-3">
        {links.map((item, index) => (
          <li key={index}>
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lg font-light text-gray-300 hover:text-white transition-colors hover:underline"
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