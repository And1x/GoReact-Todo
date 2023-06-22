package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
)

type Todo struct {
	Id      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Done    bool   `json:"done"`
}

type TodoList []Todo

const TODOLISTFILEPATH = "./data/dummyData.json"

// getTodos returns all Todos from from FS in JSON
func getTodos() ([]byte, error) {
	content, err := os.ReadFile(TODOLISTFILEPATH)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	if !json.Valid(content) {
		log.Println(err)
		return nil, fmt.Errorf("received invalid JSON from File")
	}
	return content, nil
}

// edit_done
// editDoneTodo edit the state of the todo in file and returns the edited todo
func editDoneTodo(id int) ([]byte, error) {
	var todo Todo

	content, err := os.ReadFile(TODOLISTFILEPATH)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	var todoList TodoList
	err = json.Unmarshal(content, &todoList)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	for i := 0; i < len(todoList); i++ {
		if todoList[i].Id == id {
			todoList[i].Done = !todoList[i].Done
			todo = todoList[i]
		}
	}

	todosJson, err := json.Marshal(todoList)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	os.WriteFile(TODOLISTFILEPATH, todosJson, 0644)

	todoJson, err := json.Marshal(todo)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return todoJson, nil
}

// create
// edit_content
// delete
