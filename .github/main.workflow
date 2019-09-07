workflow "Test" {
  on = "push"
  resolves = ["run test.ts"]
}

action "run test.ts" {
  uses = "denolib/deno-action@0.17.0"
  args = "run test.ts"
}
