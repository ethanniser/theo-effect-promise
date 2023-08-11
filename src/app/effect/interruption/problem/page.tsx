"use client";

import { Effect, Either, pipe } from "effect";

async function waitFor(i: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("waitFor: resolved:", i);
      resolve(i);
    }, 1000 * i);
  });
}

class FourError {
  readonly _tag = "FourError";
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

function WORK_EFFECT(i: number) {
  return Effect.gen(function* (_) {
    yield* _(Effect.log(`WORK_EFFECT: running for: ${i}`));

    if (i === 4) {
      return yield* _(Effect.fail(new FourError()));
    }

    yield* _(Effect.promise(() => waitFor(i)));
    yield* _(Effect.log(`WORK_EFFECT: resolved: ${i}`));

    return i ** 2;
  });
}

const MAIN_EFFECT = Effect.gen(function* (_) {
  const effects = [1, 2, 3, 4, 5].map((x) => WORK_EFFECT(x));
  const results = yield* _(Effect.all(effects, { concurrency: "unbounded" }));

  yield* _(Effect.log(`We got results: ${results}`));
});

const MAIN = () =>
  Effect.runPromise(
    MAIN_EFFECT.pipe(
      Effect.catchAll((error) => Effect.log(`We got error: ${error._tag}`))
    )
  );

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="p-10 flex flex-col gap-2 test-2xl font-bold">
        <button onClick={MAIN}>{"Run With Effect.all (short curcuit)"}</button>
      </div>
    </main>
  );
}
