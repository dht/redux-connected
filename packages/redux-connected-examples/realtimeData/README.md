# redux-connected

## local actions

Verbs without remote side effects

| nodeType   | verb     |
| ---------- | -------- |
| single     | setAll   |
| queue      | setAll   |
| queue      | pushMany |
| collection | setAll   |
| collection | setMany  |
| collection | set      |

## API actions

Verbs with remote side effects

| nodeType   | verb   | onResponse |
| ---------- | ------ | ---------- |
| single     | get    | set        |
| single     | patch  | =          |
| queue      | get    | pushMany   |
| queue      | push   | =          |
| queue      | pop    | =          |
| queue      | clear  | =          |
| collection | get    | setMany    |
| collection | add    | set        |
| collection | patch  | =          |
| collection | delete | =          |
