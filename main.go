package main

import (
	"database/sql"
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
)

//go:embed _ui/dist
var UI embed.FS

var uiFS fs.FS

type app struct {
	todos interface {
		GetAll() ([]*Todo, error)
		EditState(id int) (*Todo, error)
		Edit(todo Todo) (*Todo, error)
		Delete(id int) error
		New(todo Todo) (*Todo, error)
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
		todos: &TodoModel{DB: db},
	}
	s := &http.Server{
		Addr:    port,
		Handler: app.routes(),
	}

	log.Printf("Visit: %v%v\n", os.Getenv("VITE_SERVER_ADDR"), port)
	log.Fatal(s.ListenAndServe())
}

func openDB(dbName string) (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "./data/"+dbName)
	if err != nil {
		return nil, err
	}
	// create tables if they don't exists
	if err = createTables(db); err != nil {
		return nil, err
	}
	return db, nil
}
