package main

import (
	"fmt"
	"io"
	"log"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

// type Todo struct {
// 	Id      int    `json:"id"`
// 	Title   string `json:"title"`
// 	Content string `json:"content"`
// 	Done    bool   `json:"done"`
// }

// type TodoList []Todo

// const TODOLISTFILEPATH = "./data/dummyData.json"

// note: THIS IS FOR DEVMODE ONLY
func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
}

// handleStatic handles the whole UI by embeding _ui
func staticHandler(w http.ResponseWriter, r *http.Request) {

	path := filepath.Clean(r.URL.Path)
	if path == "/" { // Add other paths that you route on the UI side here
		path = "index.html"
	}
	path = strings.TrimPrefix(path, "/")

	file, err := uiFS.Open(path)
	if err != nil {
		if os.IsNotExist(err) {
			log.Println("file", path, "not found:", err)
			http.NotFound(w, r)
			return
		}
		log.Println("file", path, "cannot be read:", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	contentType := mime.TypeByExtension(filepath.Ext(path))
	w.Header().Set("Content-Type", contentType)
	if strings.HasPrefix(path, "static/") {
		w.Header().Set("Cache-Control", "public, max-age=31536000")
	}
	stat, err := file.Stat()
	if err == nil && stat.Size() > 0 {
		w.Header().Set("Content-Length", fmt.Sprintf("%d", stat.Size()))
	}

	n, _ := io.Copy(w, file)
	log.Println("file", path, "copied", n, "bytes")
}

func getTodosHandler(w http.ResponseWriter, r *http.Request) {

	// note: this enables CORS for DEVMODE
	enableCors(&w)

	todos, err := getTodos()
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(todos)
}

func editTodoHandler(w http.ResponseWriter, r *http.Request) {

	// note: this enables CORS for DEVMODE
	enableCors(&w)

	id, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		log.Printf("err parse URL ID_field: %v", err)
		http.Error(w, "invalid url", http.StatusBadRequest)
		return
	}

	// content, err := os.ReadFile(TODOLISTFILEPATH)
	// if err != nil {
	// 	log.Println(err)
	// 	http.Error(w, "error opening *.json", http.StatusInternalServerError)
	// 	return
	// }

	// var todoList TodoList
	// err = json.Unmarshal(content, &todoList)
	// if err != nil {
	// 	log.Println(err)
	// 	http.Error(w, "error unmarshal *.json", http.StatusInternalServerError)
	// 	return
	// }

	// for i := 0; i < len(todoList); i++ {
	// 	if todoList[i].Id == id {
	// 		todoList[i].Done = !todoList[i].Done
	// 	}
	// }
	// cJSON, err := json.Marshal(todoList)
	// if err != nil {
	// 	log.Println(err)
	// 	http.Error(w, "error marshal *.json", http.StatusInternalServerError)
	// 	return
	// }

	// os.WriteFile(TODOLISTFILEPATH, cJSON, 0644)

	todo, err := editDoneTodo(id)
	if err != nil {
		log.Println(err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(todo)
	// w.WriteHeader(http.StatusAccepted)
	fmt.Println("we did it>>>>", todo)

}

func newTodo(w http.ResponseWriter, r *http.Request) {

}

func deleteTodo(w http.ResponseWriter, r *http.Request) {

}
