"use client";

import { Effect } from "effect";

async function waitFor(i: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // * THESE NEVER STOP
      console.log("waitFor: resolved:", i);
      resolve(i);
    }, 1000 * i);
  });
}

class FourError {
  readonly _tag = "FourError";
}

// async function WORK(i: number) {
//   console.log("WORK: running for:", i);

//   if (i === 4) {
//     throw "WORK: 4 sucks tbh";
//   }

//   await waitFor(i);
//   console.log("WORK: resolved:", i);

//   return i ** 2;
// }

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
  yield* _(Effect.log("MAIN_EFFECT: running"));

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
    <>
      <button
        className="text-4xl font-bold cursor-pointer hover:underline"
        onClick={MAIN}
      >
        Run With Effect.all (short circuits)
      </button>
      <p>
        Even though the result is already short circuited, the timeouts never
        stop
      </p>
    </>
  );
}
