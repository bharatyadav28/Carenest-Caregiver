import React from "react";
import { IoIosArrowRoundBack as BackIcon } from "react-icons/io";

import CustomSheet from "./common/CustomSheet";
import data from "@/lib/dummy_data/notification.json";
import { noNotificationIcon, notificationIcon } from "@/lib/svg_icons";

interface Props {
  open: boolean;
  handleOpen: () => void;
}

function Notification({ open, handleOpen }: Props) {
  const notifications = data?.notifications;

  const noNotifications = notifications?.length === 0;

  return (
    <CustomSheet
      open={open}
      handleOpen={handleOpen}
      className="md:!max-w-[25rem] !w-full rounded-l-3xl px-5 text-[var(--blue-gray] mx-0 ] "
    >
      <div className="mt-12">
        <div className="flex items-center">
          <button
            className="bg-[#233D4D1A] border-0 p-3 rounded-full"
            onClick={handleOpen}
          >
            <BackIcon size={20} />
          </button>

          <div className="ms-[5rem] text-xl font-medium">Notification</div>
        </div>

        <div className="mt-5 flex flex-col px-3 ">
          {noNotifications && (
            <div className="flex flex-col items-center gap-4 mt-10  ml-[3.1rem]">
              <div> {noNotificationIcon}</div>
              <div className="text-medium">
                You have not received any notifications.
              </div>
            </div>
          )}

          {!noNotifications &&
            notifications?.map((notification) => (
              <div
                className="flex gap-x-3 items-center"
                key={notification.title}
              >
                <div className={notification.seen ? "invisible" : "visible"}>
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>

                <div className="flex gap-3 border-b border-[#EBEBEB] py-4 items-center">
                  <div className="bg-[#233D4D1A] rounded-md p-3 h-max">
                    {notificationIcon}
                  </div>
                  <div className="flex flex-col  ">
                    <div className="text-[0.9rem]">{notification.title}</div>
                    <div className="text-[#B9B9B9] text-sm ">
                      {notification.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </CustomSheet>
  );
}

export default Notification;
