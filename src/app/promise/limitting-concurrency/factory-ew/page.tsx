"use client";

import { useState } from "react";

async function waitFor(i: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(i);
    }, 1000 * i);
  });
}

async function WORK(i: number) {
  console.log("WORK: running for:", i);

  if (i === 4) {
    throw "WORK: 4 sucks tbh";
  }

  await waitFor(i);
  console.log("WORK: resolved:", i);

  return i ** 2;
}

// async function MAIN() {
//   try {
//     console.log("MAIN: running");
//     const promises = [1, 2, 3, 4, 5].map((i) => WORK(i));
//     const results = await Promise.all(promises);

//     console.log("MAIN: We got results:", results);
//   } catch (e) {
//     console.log("MAIN: failed for reason: ", e);
//     return e;
//   }
// }

async function MAIN_SETTLED(limit: number) {
  try {
    console.log(`MAIN_EFFECT: running - (with concurrency limit: ${limit})`);
    const promises = [1, 2, 3, 4, 5].map((i) => WORK(i));
    const results = await Promise.allSettled(promises);

    const errors = results
      .filter((r): r is PromiseRejectedResult => r.status === "rejected")
      .map((r) => r.reason);
    const successes = results
      .filter(
        (r): r is PromiseFulfilledResult<number> => r.status === "fulfilled"
      )
      .map((r) => r.value);

    console.log("MAIN_SETTLED: We got successes:", successes);
    console.log("MAIN_SETTLED: We got errors:", errors);
  } catch (e) {
    console.log("MAIN_SETTLED: failed for reason: ", e);
    return e;
  }
}

export default function Home() {
  const [limit, setLimit] = useState(2);

  return (
    <>
      <button
        className="text-4xl font-bold"
        onClick={() => MAIN_SETTLED(limit)}
      >
        Run With Promise.allSettled (collects errors)
      </button>
      <h3 className="text-2xl font-bold underline">
        With Concurrency Limit: {limit}
      </h3>
      <input
        type="range"
        min="1"
        max="5"
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
      />
    </>
  );
}
