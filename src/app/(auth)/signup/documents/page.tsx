import DocumentsUpload from "@/components/auth/DocumentsUpload";
import React from "react";

function page() {
  return (
    <div className="h-full overflow-y-auto hide-scrollbar">
      <div className="font-semibold text-2xl mt-4">
        Complete Your Profile with Required Documents
      </div>
      <div className="mt-2 font-medium">
        To proceed as a caregiver, please upload the necessary documents. This
        helps us verify your identity and maintain a trusted community.
      </div>

      <DocumentsUpload />
    </div>
  );
}

export default page;
