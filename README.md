## Simple Todo and Pomodoro Application served as binary

- Frontend: TS React
- Backend: Go

### Features:

- CRUD Operations on Todo Items
- Pomodoro Timer
- Todos and Pomodoro sessions are stored in a sqlite Database
- Served as single binary thanks to _go:embed_

---

- Project serves to practice software development

### How to get:

1. Simply download the binary [here](https://github.com/And1x/GoReact-Todo/releases)
2. or build from source:
   - first build UI with : `npm --prefix "./_ui/" run build`
   - then build go binary for your current system with: `go build`

### How to run:

- Execute the binary using the CLI or GUI
- Visit http://localhost:7900 -> HOST can be changed in _\_ui/.env_
- A sqlite database + tables are created the first time it's running.
