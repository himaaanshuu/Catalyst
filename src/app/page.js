"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to business dashboard landing page
    router.push("/dashboard/business");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen text-3xl font-bold">
      Loading...
    </div>
  );
}