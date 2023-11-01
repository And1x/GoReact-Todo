package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime"
	"net/http"
	"os"
	"path"
	"strconv"
	"strings"
)

// note: THIS IS FOR DEVMODE ONLY
func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
}

// handleStatic handles the whole UI by embeding _ui
func (app *app) staticHandler(w http.ResponseWriter, r *http.Request) {

	p := path.Clean(r.URL.Path)
	if p == "/" { // Add other paths that you route on the UI side here
		p = "index.html"
	}

	p = strings.TrimPrefix(p, "/")

	file, err := uiFS.Open(p)
	if err != nil {
		if os.IsNotExist(err) {
			log.Println("file", p, "not found:", err)
			http.NotFound(w, r)
			return
		}
		log.Println("file", p, "cannot be read:", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	contentType := mime.TypeByExtension(path.Ext(p))
	w.Header().Set("Content-Type", contentType)
	if strings.HasPrefix(p, "static/") {
		w.Header().Set("Cache-Control", "public, max-age=31536000")
	}
	stat, err := file.Stat()
	if err == nil && stat.Size() > 0 {
		w.Header().Set("Content-Length", fmt.Sprintf("%d", stat.Size()))
	}

	n, _ := io.Copy(w, file)
	log.Println("file", p, "copied", n, "bytes")
}

func (app *app) getTodosHandler(w http.ResponseWriter, r *http.Request) {

	// note: this enables CORS for DEVMODE
	enableCors(&w)

	todos, err := app.todos.GetAll()
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
	todoJSON, err := json.Marshal(todos)
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(todoJSON)
}

func (app *app) editTodoDoneHandler(w http.ResponseWriter, r *http.Request) {

	// note: this enables CORS for DEVMODE
	enableCors(&w)

	id, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		log.Printf("err parse URL ID_field: %v", err)
		http.Error(w, "invalid url", http.StatusBadRequest)
		return
	}

	todo, err := app.todos.EditState(id)
	if err != nil {
		log.Println(err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
	todoJSON, err := json.Marshal(todo)
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(todoJSON)
}

func (app *app) editTodoHandler(w http.ResponseWriter, r *http.Request) {

	// note: this enables CORS for DEVMODE
	enableCors(&w)

	decodeReq := json.NewDecoder(r.Body)
	var todo Todo
	err := decodeReq.Decode(&todo)
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	storedTodo, err := app.todos.Edit(todo)
	if err != nil {
		log.Println(err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
	todoJSON, err := json.Marshal(storedTodo)
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(todoJSON)
}

func (app *app) deleteTodoHandler(w http.ResponseWriter, r *http.Request) {

	id, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}
	err = app.todos.Delete(id)
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusAccepted)
}

func (app *app) newTodoHandler(w http.ResponseWriter, r *http.Request) {

	decodeReq := json.NewDecoder(r.Body)
	var todo Todo
	err := decodeReq.Decode(&todo)
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	storedTodo, err := app.todos.New(todo)
	if err != nil {
		log.Println(err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
	todoJSON, err := json.Marshal(storedTodo)
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(todoJSON)
}
