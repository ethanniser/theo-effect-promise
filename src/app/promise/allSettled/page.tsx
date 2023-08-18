"use client";

async function waitFor(i: number) {
  return new Promise((resolve) => {
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

async function MAIN_SETTLED() {
  try {
    console.log("MAIN_SETTLED: running");
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
  return (
    <button
      className="text-4xl font-bold cursor-pointer hover:underline"
      onClick={MAIN_SETTLED}
    >
      Run With Promise.allSettled (collects errors)
    </button>
  );
}
