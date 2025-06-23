"use client";
import React, { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { MdArrowForwardIos as ArrowIcon } from "react-icons/md";
import { RiFileList3Line as MenuIcon } from "react-icons/ri";

import CustomDrawer from "./CustomDrawer";
import { sidebarItemType } from "@/lib/interface-types";
import { CustomPieChart } from "./CustomPieChart";
import data from "@/lib/dummy_data/profile.json";

interface Props {
  items: sidebarItemType[]
  ViewProfile: boolean;
}
function SidebarMenu({ items,ViewProfile }: Props) {
  const [openMenu, setOpenMenu] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const lastIndex = items?.length - 1;
  const handleViewProfileClick = () => {
    router.push('/my-profile');
  };
  const handleOpenMenu = () => {
    setOpenMenu((prev) => !prev);
  };

  const handleItemClick = ({
    path,
    handleClick,
  }: {
    path?: string;
    handleClick?: () => void;
  }) => {
    if (path) router.push(path);
    else if (handleClick) handleClick();
  };

  const basicDetails = data?.basicDetails;

  const content = (
    <div className="min-h-[20rem] w-full min-w-[20rem] px-4 py-6 bg-[#fff] rounded-lg shadow-2xl">
      <div className="flex items-center gap-4">
        <CustomPieChart percentage={80}>
          <div className="relative rounded-full w-16 h-16 m-3">
            <Image
              src="/profile-pic.png"
              alt="profile pic"
              fill
              className="object-cover"
            />
          </div>
        </CustomPieChart>
        <div className="flex flex-col ">
          <div className="text-[1.7rem] font-semibold">{basicDetails.name}</div>
          <div className="text-sm text-[#667085]">{basicDetails.email}</div>
          {ViewProfile===true ?  
               <div> 
            <button 
              onClick={handleViewProfileClick}
              className="text-[#F2A307] border-1 border-[#F2A307] font-medium rounded-full bg-[#F2A3071A] px-2 py-1 m-2 hover:bg-[#F2A307]/40"
            >
              View Profile
            </button>
          </div>:null }
      
        </div>
      </div>

      <div className=" w-full border-t-1 border-[#33333333] my-2"></div>

      <div className="flex flex-col gap-2 mt-3 ">
        {items?.map((item, index) => {
          const isCurrentPage = pathname === item.path;
          const lastItem = lastIndex === index;

          return (
            <div
              className={`flex justify-between border-cool-gray py-3 px-4 font-medium hover:cursor-pointer hover:opacity-90 transition-all  w-full ${
                isCurrentPage ? "bg-primary rounded-full" : "#fff"
              } ${!lastItem ? "border-b" : ""}`}
              key={item.id}
              onClick={() =>
                handleItemClick({
                  path: item?.path,
                  handleClick: item?.handleClick,
                })
              }
            >
              <div>{item.text}</div>
              <button>
                <ArrowIcon size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
  return (
    <>
      <div className="lg:block hidden">{content}</div>

      <button onClick={handleOpenMenu} className="lg:hidden">
        <MenuIcon size={30} />
      </button>

      <CustomDrawer
        className="lg-hidden w-max h-max my-auto mx-auto rounded-lg"
        open={openMenu}
        handleOpen={handleOpenMenu}
        direction="left"
      >
        {content}
      </CustomDrawer>
    </>
  );
}

export default SidebarMenu;
