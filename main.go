package main

import (
	"database/sql"
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path"

	"github.com/And1x/GoReact-Todo/models"
	"github.com/And1x/GoReact-Todo/models/sqlite/pomo"
	"github.com/And1x/GoReact-Todo/models/sqlite/todo"
	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
)

//go:embed _ui/dist
var UI embed.FS

var uiFS fs.FS

type app struct {
	todos interface {
		GetAll() ([]*models.Todo, error)
		EditState(id int) (*models.Todo, error)
		Edit(todo models.Todo) (*models.Todo, error)
		Delete(id int) error
		New(todo models.Todo) (*models.Todo, error)
	}
	pomos interface {
		Get(filter []string) ([]*models.Pomo, error)
		New(pomo *models.Pomo) error
	}
}

func init() {
	var err error
	uiFS, err = fs.Sub(UI, path.Join("_ui", "dist"))
	if err != nil {
		log.Fatal("failed to get ui fs", err)
	}

	// load .env variables
	if err := godotenv.Load("_ui/.env"); err != nil {
		log.Fatal("Error loading .env file")
	}
}

func (app *app) routes() http.Handler {
	mux := chi.NewRouter()

	// embedded react UI
	mux.Get("/*", app.staticHandler)

	// api consumed by _ui
	mux.Get("/show", app.getTodosHandler)
	mux.Get("/edit", app.editTodoDoneHandler)
	mux.Put("/edit", app.editTodoHandler)
	mux.Delete("/todo", app.deleteTodoHandler)
	mux.Post("/new", app.newTodoHandler)

	mux.Route("/pomos", func(mux chi.Router) {
		mux.Post("/", app.newPomoHandler)
		mux.Get("/", app.getPomosHandler) // uses filter queries like eg. '.../pomos?from=today'
		// daily:  ?from='today'
		// month:  ?from='month
		// year:   ?from='2023'
		// all:    ?from='all'
		// custom: ?from='YYYY-MM-DD'&to='YYYY-MM-DD' /about DATES see: ISO 8601
	})

	return mux
}

func main() {

	port := os.Getenv("VITE_SERVER_PORT")

	db, err := openDB("database.db")
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Sqlite running")

	app := &app{
		todos: &todo.TodoModel{DB: db},
		pomos: &pomo.PomoModel{DB: db},
	}
	s := &http.Server{
		Addr:    port,
		Handler: app.routes(),
	}

	log.Printf("Visit: %v%v\n", os.Getenv("VITE_SERVER_ADDR"), port)
	log.Fatal(s.ListenAndServe())
}

func openDB(dbName string) (*sql.DB, error) {
	dsn := "?_foreign_keys=true"
	db, err := sql.Open("sqlite3", "./data/"+dbName+dsn)
	if err != nil {
		return nil, err
	}
	// create tables if they don't exists
	if err = models.CreateTodoTable(db); err != nil {
		return nil, err
	}
	if err = models.CreatePomoTable(db); err != nil {
		return nil, err
	}
	return db, nil
}
