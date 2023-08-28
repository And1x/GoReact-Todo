package main

import (
	"embed"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
)

//go:embed _ui/dist
var UI embed.FS

var uiFS fs.FS

type app struct {
	todos interface {
		GetAll() ([]byte, error)
		EditState(id int) ([]byte, error)
		Edit(todo Todo) ([]byte, error)
		Delete(id int) error
		New(todo Todo) ([]byte, error)
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
	dirName := flag.String("dir", "data", "Directory of stored Todos")
	fName := flag.String("f", "todoData", "File Name of stored Todos")
	flag.Parse()

	app := &app{
		todos: &TodosFileStorage{dirName: *dirName, fileName: *fName, fileType: ".json"},
	}
	s := &http.Server{
		Addr:    port,
		Handler: app.routes(),
	}

	fmt.Printf("Visit: %v%v\n", os.Getenv("VITE_SERVER_ADDR"), port)
	log.Fatal(s.ListenAndServe())
}
