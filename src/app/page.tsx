"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-10 min-h-screen">
      <Link href="/original/all">
        <p className="text-2xl font-bold">Original - All</p>
      </Link>
      <Link href="/original/allSettled">
        <p className="text-2xl font-bold">Original - AllSettled</p>
      </Link>
      <Link href="/effect/all">
        <p className="text-2xl font-bold">Effect - All</p>
      </Link>
    </div>
  );
}
