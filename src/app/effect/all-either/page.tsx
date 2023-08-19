"use client";

import { Effect, Either } from "effect";

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

// async function MAIN_SETTLED() {
//   try {
//     console.log("MAIN_SETTLED: running");
//     const promises = [1, 2, 3, 4, 5].map((i) => WORK(i));
//     const results = await Promise.allSettled(promises);

//     const errors = results
//       .filter((r): r is PromiseRejectedResult => r.status === "rejected")
//       .map((r) => r.reason);
//     const successes = results
//       .filter(
//         (r): r is PromiseFulfilledResult<number> => r.status === "fulfilled"
//       )
//       .map((r) => r.value);

//     console.log("MAIN_SETTLED: We got successes:", successes);
//     console.log("MAIN_SETTLED: We got errors:", errors);
//   } catch (e) {
//     console.log("MAIN_SETTLED: failed for reason: ", e);
//     return e;
//   }
// }

const MAIN_EFFECT_EITHER = Effect.gen(function* (_) {
  yield* _(Effect.log("MAIN_EFFECT: running"));
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
    <button
      className="text-4xl font-bold cursor-pointer hover:underline"
      onClick={MAIN}
    >
      Run With Effect.all + Effect.either (collects errors)
    </button>
  );
}
