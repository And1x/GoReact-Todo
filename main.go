package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"path"

	"github.com/go-chi/chi/v5"
)

//go:embed _ui/dist
var UI embed.FS

var uiFS fs.FS

type Server struct {
	ListenAddr string
	Router     *chi.Mux
}

const PORT = ":7900"
const DATADIR = "data"
const DATAFILE = "todoData.json"

var TODOLISTFILEPATH = path.Join(DATADIR, DATAFILE)

func init() {
	var err error
	uiFS, err = fs.Sub(UI, path.Join("_ui", "dist"))
	if err != nil {
		log.Fatal("failed to get ui fs", err)
	}
}

func NewServer(listenAddr string) *Server {
	s := &Server{}
	s.Router = chi.NewRouter()
	s.ListenAddr = listenAddr
	return s
}

func (s *Server) MountHandlers() {
	// embedded react UI
	s.Router.Get("/*", staticHandler)

	// api consumed by _ui
	s.Router.Get("/show", getTodosHandler)
	s.Router.Get("/edit", editTodoDoneHandler)
	s.Router.Put("/edit", editTodoHandler)
	s.Router.Delete("/todo", deleteTodoHandler)
	s.Router.Post("/new", newTodoHandler)
}

func main() {
	s := NewServer(PORT)
	s.MountHandlers()
	fmt.Printf("Visit: http://localhost%v\n", PORT)
	log.Fatal(http.ListenAndServe(s.ListenAddr, s.Router))
}
