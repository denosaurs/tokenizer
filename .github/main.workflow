workflow "Tests" {
  on = "push"
  resolves = ["test all"]
}

action "test all" {
  uses = "denolib/deno-action@0.17.0"
  args = "test *_test.ts -A"
}
