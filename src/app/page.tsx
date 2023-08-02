"use client";
import { Effect, pipe } from "effect";

class IsFourError {
  readonly _tag = "IsFourError";
}

function actualWork(i: number) {
  return Effect.if(i === 4, {
    onTrue: Effect.fail(new IsFourError()),
    onFalse: Effect.promise(() => Promise.resolve(i)),
  });
}

function doSomething() {
  return pipe(
    [1, 2, 3, 4, 5].map(actualWork),
    Effect.all,
    Effect.catchTag("IsFourError", () => Effect.succeed("error caught!")),
    Effect.runPromise
  );
}

function doSomethingTwo() {
  return pipe(
    [1, 2, 3, 4, 5].map(actualWork),
    Effect.allSuccesses,
    Effect.runPromise
  );
}

export default function Home() {
  async function MAIN() {
    console.log(await doSomething());
  }

  async function MAIN2() {
    console.log(await doSomethingTwo());
  }

  return (
    <div>
      <button onClick={MAIN}>Click me</button>
      <button onClick={MAIN2}>Click me 2</button>
    </div>
  );
}