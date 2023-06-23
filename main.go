package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
)

//go:embed _ui/dist
var UI embed.FS

var uiFS fs.FS

func init() {
	var err error
	uiFS, err = fs.Sub(UI, "_ui/dist")
	if err != nil {
		log.Fatal("failed to get ui fs", err)
	}
}

type Server struct {
	ListenAddr string
	Router     *chi.Mux
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
	// s.Router.Delete("/todo?id={id}", deleteTodoHandler)
	s.Router.Delete("/todo", deleteTodoHandler)
	s.Router.Post("/new", newTodoHandler)
}

func main() {
	s := NewServer(":8080")
	s.MountHandlers()
	log.Fatal(http.ListenAndServe(s.ListenAddr, s.Router))
}
