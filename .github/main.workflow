workflow "Tests" {
  on = "push"
  resolves = ["test"]
}

action "test" {
  uses = "denolib/deno-action@0.17.0"
  args = "test"
}
