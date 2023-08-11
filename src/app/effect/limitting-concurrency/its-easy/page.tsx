"use client";

import { Effect, Either, pipe } from "effect";
import { useState } from "react";

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

const MAIN_EFFECT_EITHER = (limit: number) =>
  Effect.gen(function* (_) {
    yield* _(
      Effect.log(`MAIN_EFFECT: running - (with concurrency limit: ${limit})`)
    );
    const effects = [1, 2, 3, 4, 5].map((x) => WORK_EFFECT(x));
    const eithers = effects.map((x) => Effect.either(x));
    const results = yield* _(Effect.all(eithers, { concurrency: limit }));

    const errors = results.filter(Either.isLeft).map((x) => x.left);
    const successes = results.filter(Either.isRight).map((x) => x.right);

    yield* _(Effect.sync(() => console.log("We got successes:", successes)));
    yield* _(Effect.sync(() => console.log("We got errors:", errors)));
  });

const MAIN = (limit: number) => Effect.runPromise(MAIN_EFFECT_EITHER(limit));

export default function Home() {
  const [limit, setLimit] = useState(2);

  return (
    <>
      <button className="text-4xl font-bold" onClick={() => MAIN(limit)}>
        Run With Effect.all + Effect.either (collects errors)
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
