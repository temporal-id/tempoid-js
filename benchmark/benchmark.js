import {Bench} from "tinybench";
import {tempoId} from "../src/tempoId.js";
import {nanoid} from "nanoid";
import {v4 as uuid4} from "uuid";

let bench = new Bench()

bench
  .add('tempoid', () => {
    tempoId()
  })
  .add('nanoid', () => {
    nanoid()
  })
  .add('uuid4', () => {
    uuid4()
  })

await bench.warmup()
await bench.run()

console.table(bench.table());