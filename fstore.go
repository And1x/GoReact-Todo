package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path"
	"time"
)

type Todo struct {
	Id      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Done    bool   `json:"done"`
}

type TodosFileStorage struct {
	dirName  string
	fileName string
	dataType string
}

func (tfs *TodosFileStorage) getFilePath() string {
	return path.Join(tfs.dirName, tfs.fileName+tfs.dataType)
}

// helper method
func (tfs *TodosFileStorage) loadFile() ([]Todo, error) {

	fc, err := os.ReadFile(tfs.getFilePath())
	// create folder and file in case it not exists
	if errors.Is(err, os.ErrNotExist) {
		err := os.Mkdir(fmt.Sprintf("./%s", tfs.dirName), os.ModePerm)
		if err != nil && !errors.Is(err, os.ErrExist) {
			return nil, err
		}
		err = os.WriteFile(tfs.getFilePath(), []byte("[]"), 0644)
		if err != nil {
			return nil, err
		}
	} else if err != nil {
		return nil, err
	}

	var tl []Todo
	err = json.Unmarshal(fc, &tl)
	if err != nil {
		return nil, err
	}
	return tl, nil
}

// helper method
func (tfs *TodosFileStorage) writeFile(tl []Todo) error {

	tlj, err := json.Marshal(tl)
	if err != nil {
		return err
	}

	if err := os.WriteFile(tfs.getFilePath(), tlj, 0644); err != nil {
		return err
	}
	return nil
}

// getTodos returns all Todos from from FS in JSON
func (tfs *TodosFileStorage) GetAll() ([]byte, error) {

	todoList, err := tfs.loadFile()
	if err != nil {
		return nil, err
	}

	todoListJson, err := json.Marshal(todoList)
	if err != nil {
		return nil, err
	}
	return todoListJson, nil
}

// editDoneTodo edit the state of the todo in file and returns the edited todo
func (tfs *TodosFileStorage) EditState(id int) ([]byte, error) {
	var todo Todo

	todoList, err := tfs.loadFile()
	if err != nil {
		return nil, err
	}

	for i := 0; i < len(todoList); i++ {
		if todoList[i].Id == id {
			todoList[i].Done = !todoList[i].Done
			todo = todoList[i]
		}
	}

	if err := tfs.writeFile(todoList); err != nil {
		return nil, err
	}

	return json.Marshal(todo)
}

// edit_content
func (tfs *TodosFileStorage) Edit(todo Todo) ([]byte, error) {

	todoList, err := tfs.loadFile()
	if err != nil {
		return nil, err
	}

	for i := 0; i < len(todoList); i++ {
		if todoList[i].Id == todo.Id {
			todoList[i] = todo
		}
	}

	if err := tfs.writeFile(todoList); err != nil {
		return nil, err
	}

	return json.Marshal(todo)
}

// delete
func (tfs *TodosFileStorage) Delete(id int) error {

	todoList, err := tfs.loadFile()
	if err != nil {
		return err
	}

	for i := 0; i < len(todoList); i++ {
		if todoList[i].Id == id {
			// remove the item from the []todolist
			todoList = append(todoList[:i], todoList[i+1:]...)
		}
	}

	if err := tfs.writeFile(todoList); err != nil {
		return err
	}

	return nil
}

// create
func (tfs *TodosFileStorage) New(todo Todo) ([]byte, error) {

	todoList, err := tfs.loadFile()
	if err != nil {
		return nil, err
	}

	id := time.Now()
	id.Unix()
	todo.Id = int(id.Unix())
	todoList = append(todoList, todo)

	if err := tfs.writeFile(todoList); err != nil {
		return nil, err
	}

	return json.Marshal(todoList)
}
