workflow "Tests" {
  resolves = ["test all"]
  on = "push"
}

action "test all" {
  uses = "denolib/deno-action@0.18.0"
  args = "-A test *_test.ts"
}
