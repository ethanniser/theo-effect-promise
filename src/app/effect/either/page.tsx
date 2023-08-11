"use client";

import { Effect, Either, pipe } from "effect";

async function waitFor(i: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
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

// const MAIN_EFFECT = Effect.gen(function* (_) {
//   const effects = [1, 2, 3, 4, 5].map((x) => WORK_EFFECT(x));
//   const results = yield* _(Effect.all(effects, { concurrency: "unbounded" }));

//   yield* _(Effect.log(`We got results: ${results}`));
// });

const MAIN_EFFECT_EITHER = Effect.gen(function* (_) {
  const effects = [1, 2, 3, 4, 5].map((x) => WORK_EFFECT(x));
  const eithers = effects.map((x) => Effect.either(x));
  const results = yield* _(Effect.all(eithers, { concurrency: "unbounded" }));

  const errors = results.filter(Either.isLeft).map((x) => x.left);
  const successes = results.filter(Either.isRight).map((x) => x.right);

  yield* _(Effect.sync(() => console.log("We got successes:", successes)));
  yield* _(Effect.sync(() => console.log("We got errors:", errors)));
});

const MAIN = () => Effect.runPromise(MAIN_EFFECT_EITHER);

export default function Home() {
  return (
    <button className="text-4xl font-bold" onClick={MAIN}>
      Run With Effect.all + Effect.either (collects errors)
    </button>
  );
}
