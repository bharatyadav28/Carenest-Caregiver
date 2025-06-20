"use client";
import React, { useState } from "react";

import CurrentPlan from "@/components/profile/subscription/CurrentPlan";
import ViewPlans from "@/components/profile/subscription/ViewPlans";

function Page() {
  const [hasSubscription, setHasSubscription] = useState(false);

  return (
    <div>
      {!hasSubscription && (
        <ViewPlans setHasSubscription={setHasSubscription} />
      )}
      {hasSubscription && <CurrentPlan />}
    </div>
  );
}

export default Page;
