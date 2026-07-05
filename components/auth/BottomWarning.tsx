import Link from "next/link";
import React from "react";

interface BottomWarningProps {
  label: string;
  ButtonText: string;
  to: string;
}

function BottomWarning({ label, ButtonText, to }: BottomWarningProps) {
  return (
    <div className="w-full py-3 flex justify-center">
      <span className="text-sm text-purple-300">{label}</span>
      <Link href={to} className="text-sm mx-2 underline text-white">
        {ButtonText}
      </Link>
    </div>
  );
}

export default React.memo(BottomWarning);
