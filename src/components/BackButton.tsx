"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ChevronDown from "../../public/chevron-down.svg";

// When the site is opened from the home screen it runs without browser UI,
// and iOS gives no swipe-back gesture there, so story and user pages get
// their own back button. In a normal browser tab it stays hidden.
export default function BackButton() {
  const pathname = usePathname();
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    const iosStandalone =
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true;
    setStandalone(
      iosStandalone || window.matchMedia("(display-mode: standalone)").matches
    );
  }, []);

  const onListPage = pathname === "/" || pathname.startsWith("/category");
  if (!standalone || onListPage) return null;

  function goBack() {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/";
  }

  return (
    <button
      onClick={goBack}
      aria-label="Back"
      className="nav-buttons shrink-0 !w-9 !px-0 sm:!w-[2.5em]"
    >
      <span className="w-4 rotate-90">
        <ChevronDown />
      </span>
    </button>
  );
}
