package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path"
	"time"
)

type TodosFileStorage struct {
	dirName  string
	fileName string
	fileType string
}

func (t *TodosFileStorage) getFilePath() string {
	return path.Join(t.dirName, t.fileName+t.fileType)
}

// loadFile loads TodoList file - creates data folder and file if it not exists
func (t *TodosFileStorage) loadFile() (*os.File, error) {

	f, err := os.Open(t.getFilePath())
	if errors.Is(err, os.ErrNotExist) {
		err := os.Mkdir(t.dirName, os.ModePerm)
		if err != nil && !errors.Is(err, os.ErrExist) {
			return nil, err
		}
		err = os.WriteFile(t.getFilePath(), []byte("[]"), 0644)
		if err != nil {
			return nil, err
		}
	} else if err != nil {
		return nil, err
	}
	return f, nil
}

func (t *TodosFileStorage) writeFile(tl []Todo) error {

	tlj, err := json.Marshal(tl)
	if err != nil {
		return err
	}

	if err := os.WriteFile(t.getFilePath(), tlj, 0644); err != nil {
		return err
	}

	return nil
}

// getTodos returns all Todos from from FS in JSON
func (t *TodosFileStorage) GetAll() ([]byte, error) {

	f, err := t.loadFile()
	if err != nil {
		return nil, err
	}
	defer f.Close()

	todoList, err := getTodoList(f)
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
func (t *TodosFileStorage) EditState(id int) ([]byte, error) {
	var todo Todo

	f, err := t.loadFile()
	if err != nil {
		return nil, err
	}
	defer f.Close()

	todoList, err := getTodoList(f)
	if err != nil {
		return nil, err
	}

	for i := 0; i < len(todoList); i++ {
		if todoList[i].Id == id {
			todoList[i].Done = !todoList[i].Done
			todo = todoList[i]
		}
	}

	if err := t.writeFile(todoList); err != nil {
		return nil, err
	}
	fmt.Println("what??", todoList)
	return json.Marshal(todo)
}

// edit_content
func (t *TodosFileStorage) Edit(todo Todo) ([]byte, error) {

	f, err := t.loadFile()
	if err != nil {
		return nil, err
	}
	defer f.Close()

	todoList, err := getTodoList(f)
	if err != nil {
		return nil, err
	}

	for i := 0; i < len(todoList); i++ {
		if todoList[i].Id == todo.Id {
			todoList[i] = todo
		}
	}

	if err := t.writeFile(todoList); err != nil {
		return nil, err
	}
	return json.Marshal(todo)
}

// delete
func (t *TodosFileStorage) Delete(id int) error {

	f, err := t.loadFile()
	if err != nil {
		return err
	}
	defer f.Close()

	todoList, err := getTodoList(f)
	if err != nil {
		return err
	}

	for i := 0; i < len(todoList); i++ {
		if todoList[i].Id == id {
			// remove the item from the []todolist
			todoList = append(todoList[:i], todoList[i+1:]...)
		}
	}

	if err := t.writeFile(todoList); err != nil {
		return err
	}
	return nil
}

// create
func (t *TodosFileStorage) New(todo Todo) ([]byte, error) {

	f, err := t.loadFile()
	if err != nil {
		return nil, err
	}
	defer f.Close()

	todoList, err := getTodoList(f)
	if err != nil {
		return nil, err
	}

	id := time.Now()
	id.Unix()
	todo.Id = int(id.Unix())
	todoList = append(todoList, todo)

	if err := t.writeFile(todoList); err != nil {
		return nil, err
	}
	return json.Marshal(todoList)
}
