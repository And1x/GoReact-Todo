package main

import (
	"encoding/json"
	"io"
)

type Todo struct {
	Id      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Done    bool   `json:"done"`
	Due     string `json:"due"`
}

// getTodoList returns a TodoList from whatever has io.Reader interface eg. file, DB or HTTP Respond
func getTodoList(r io.Reader) ([]Todo, error) {

	todos, err := io.ReadAll(r)
	if err != nil {
		return nil, err
	}

	var tl []Todo
	err = json.Unmarshal(todos, &tl)
	if err != nil {
		return nil, err
	}
	return tl, nil
}
