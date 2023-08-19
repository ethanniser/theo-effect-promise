"use client";

// async function waitFor(i: number) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(i);
//     }, 1000 * i);
//   });
// }

async function waitForABORTABLE(i: number, abortSignal: AbortSignal) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.log("waitFor: resolved:", i);
      resolve(i);
    }, 1000 * i);

    abortSignal.addEventListener("abort", () => {
      clearTimeout(timeout);
      console.log("waitFor: aborted", i);
      reject("waitFor: aborted");
    });
  });
}

// async function WORK(i: number) {
//   console.log("WORK: running for:", i);

//   if (i === 4) {
//     throw "WORK: 4 sucks tbh";
//   }

//   await waitFor(i);
//   // * THESE NEVER STOP
//   console.log("WORK: resolved:", i);

//   return i ** 2;
// }

const WORK_ABORTABLE = async (i: number, signal: AbortSignal) => {
  console.log("WORK: running for:", i);

  if (i === 4) {
    throw "WORK: 4 sucks tbh";
  }

  await waitForABORTABLE(i, signal);
  console.log("WORK: resolved:", i);

  return i ** 2;
};

const MAIN = async () => {
  const abortController = new AbortController();
  const { signal } = abortController;

  try {
    console.log("MAIN: running");
    const promises = [1, 2, 3, 4, 5].map((i) => WORK_ABORTABLE(i, signal));
    const results = await Promise.all(promises);

    console.log("MAIN: We got results:", results);
  } catch (e) {
    console.log("MAIN: failed for reason: ", e);
    abortController.abort();
    return e;
  }
};

export default function Home() {
  return (
    <button
      className="text-4xl font-bold cursor-pointer hover:underline"
      onClick={MAIN}
    >
      Run With Traditional Interruption
    </button>
  );
}
