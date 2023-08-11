"use client";

import { Effect, Either, pipe } from "effect";

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

class FourError {
  readonly _tag = "FourError";
}

class WaitForError {
  readonly _tag = "WaitForError";
}

function WORK_EFFECT(i: number) {
  return Effect.gen(function* (_) {
    yield* _(Effect.log(`WORK_EFFECT: running for: ${i}`));

    if (i === 4) {
      return yield* _(Effect.fail(new FourError()));
    }

    yield* _(
      Effect.tryPromise({
        try: (signal) => waitForABORTABLE(i, signal),
        catch: (_error) => new WaitForError(),
      })
    );
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
    <button className="text-4xl font-bold" onClick={MAIN}>
      Run With Effectful Interruption
    </button>
  );
}
