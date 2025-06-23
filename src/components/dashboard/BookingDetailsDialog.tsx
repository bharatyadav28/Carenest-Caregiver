"use client";
import React from "react";
import { IoMdClose } from "react-icons/io";
import { FiPhone, FiMail } from "react-icons/fi";
import bookingData from "@/lib/dummy_data/booking-details.json";
import {
arrow,message
} from "@/lib/svg_icons";
interface BookingDetailsDialogProps {
  onClose: () => void;
}

interface BookingData {
  booking: {
    avatar: string;
    name: string;
    address: string;
    id: string;
    bookedOn: string;
    careType: string;
    bookingDate: string;
    duration: string;
    phone: string;
    email: string;
  };
}

export default function BookingDetailsDialog({ onClose }: BookingDetailsDialogProps) {
  const data: BookingData = bookingData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="relative w-[496px] h-[600px] bg-[#F9FAFB] rounded-[24px] p-[24px] shadow-xl">
        {/* Close Button */}
        <button className="absolute top-6 right-6 text-[#1B2A37]" onClick={onClose}>
          <IoMdClose size={24} />
        </button>

        {/* Avatar + Info */}
        <div className="flex items-start gap-4 mb-6">
          <img src={data.booking.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
          <div>
            <h2 className="text-[20px] font-semibold text-[#1B2A37] leading-[24px] mb-2">{data.booking.name}</h2>
            <p className="text-[16px] leading-[20px] text-[#7A8B9B] mt-[4px] flex ">

             {arrow} {data.booking.address}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mb-8">
          <button className="flex-1 bg-[#FFA629] hover:bg-[#e2941f] text-black rounded-full text-[14px]  py-[10px] flex justify-center gap-2">
          {message}  Message
          </button>
          <button className="flex-1 border border-[#FF5C5C] text-[#FF5C5C] rounded-full text-[14px] font-medium py-[10px]">
            Request to cancel
          </button>
        </div>

        {/* Booking Details */}
        <div className="mb-6">
          <h3 className="text-[16px] font-semibold text-[#1B2A37] mb-3">Booking Details</h3>
          <div className="text-[14px] leading-[20px] text-[#1B2A37] space-y-3">
            <div className="flex justify-between">
              <span>Booking ID:</span>
              <span className="text-[#7A8B9B]">#{data.booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Booked On:</span>
              <span className="text-[#7A8B9B]">{data.booking.bookedOn}</span>
            </div>
            <div className="flex justify-between">
              <span>Care Type:</span>
              <span className="text-[#7A8B9B]">{data.booking.careType}</span>
            </div>
            <div className="flex justify-between">
              <span>Booking Date:</span>
              <span className="text-[#7A8B9B]">{data.booking.bookingDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="text-[#7A8B9B]">{data.booking.duration}</span>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div>
          <h3 className="text-[16px] font-semibold text-[#1B2A37] mb-3">Contact Details</h3>
          <div className="bg-white rounded-[16px] px-4 py-3 flex items-center gap-3 text-[14px] text-[#1B2A37] mb-3 ">

            <div className="flex gap-2 align-center justify-center">
            <FiPhone className="text-white bg-black text-[30px] rounded-full p-2 mt-2" />
            <div>
            <div className="mb-1">Phone number</div>
            <span className="text-[#7A8B9B]">{data.booking.phone}</span>
            </div>
            </div>
          </div>
          <div className="bg-white rounded-[16px] px-4 py-3 flex items-center gap-3 text-[14px] text-[#1B2A37] ">
              <div className="flex gap-2 align-center justify-center">
            <FiMail className="text-white bg-black text-[30px] rounded-full p-2 mt-2" />
            <div>
            <div className="mb-1">Email ID</div>
            <span className="text-[#7A8B9B]">{data.booking.email}</span>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
