"use client";

import Link from "next/link";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center space-y-10">
        <Link href="/">
          <h1 className="text-4xl font-bold mb-2">Home</h1>
        </Link>
        <div className="grid grid-cols-2 gap-6 text-center">
          <div className="bg-blue-100 p-6 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">Promise</div>
            <Link href="/promise/all">
              <p className="text-xl cursor-pointer hover:text-blue-500">All</p>
            </Link>
            <Link href="/promise/allSettled">
              <p className="text-xl cursor-pointer hover:text-blue-500">
                AllSettled
              </p>
            </Link>
          </div>
          <div className="bg-green-100 p-6 rounded-lg">
            <div className="text-2xl font-bold text-green-700">Effect</div>
            <Link href="/effect/all">
              <p className="text-xl cursor-pointer hover:text-green-500">All</p>
            </Link>
            <Link href="/effect/either">
              <p className="text-xl cursor-pointer hover:text-green-500">
                Either
              </p>
            </Link>
            <div className="text-xl font-semibold text-green-700">
              Interruption
            </div>
            <Link href="/effect/interruption/problem">
              <p className="text-lg cursor-pointer hover:text-green-500">
                Problem
              </p>
            </Link>
            <Link href="/effect/interruption/solution">
              <p className="text-lg cursor-pointer hover:text-green-500">
                Solution
              </p>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex-grow flex flex-col space-y-5 items-center justify-center ">
        {children}
      </div>
    </div>
  );
}