package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

type Todo struct {
	Id      int
	Title   string
	Content string
}

type TodoList []Todo

// note: THIS IS FOR DEVMODE ONLY
func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
}

func showTodos(w http.ResponseWriter, r *http.Request) {

	// note: this enables CORS for DEVMODE
	enableCors(&w)

	// 1. Load dummyData
	content, err := os.ReadFile("./data/dummyData.json")
	if err != nil {
		log.Println(err)
		http.Error(w, "error opening *.json", http.StatusInternalServerError)
		return
	}

	// 2. Respond it to the UI request
	if json.Valid(content) {
		w.Header().Set("Content-Type", "application/json")
		w.Write(content)
		return
	} else {
		log.Println("error invalid JSON")
		http.Error(w, "invalid json", http.StatusInternalServerError)
		return
	}

}

func newTodo(w http.ResponseWriter, r *http.Request) {

}

func deleteTodo(w http.ResponseWriter, r *http.Request) {

}
func editTodo(w http.ResponseWriter, r *http.Request) {

}
