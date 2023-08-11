"use client";

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

async function MAIN() {
  try {
    console.log("MAIN: running");
    const promises = [1, 2, 3, 4, 5].map((i) => WORK(i));
    const results = await Promise.all(promises);

    console.log("MAIN: We got results:", results);
  } catch (e) {
    console.log("MAIN: failed for reason: ", e);
    return e;
  }
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="p-10 flex flex-col gap-2 test-2xl font-bold">
        <button onClick={MAIN}>Run With Promise.all</button>
      </div>
    </main>
  );
}
