"use client";

import dynamic from "next/dynamic";

const IncidentFormClient = dynamic(() => import("./IncidentFormClient"), {
  ssr: false,
});

export default function IncidentFormPage() {
  return <IncidentFormClient />;
}
