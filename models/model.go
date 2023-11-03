package models

import (
	"database/sql"
	"log"
)

type Todo struct {
	Id      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Done    bool   `json:"done"`
	Due     string `json:"due"`
}

type Pomo struct {
	Id       int    `json:"id"`
	Task     string `json:"task"`
	Duration int    `json:"duration"`
	Started  int    `json:"started"`
	Finished int    `json:"finished"`
	TodoId   int    `json:"todoid"`
}

func CreateTodoTable(db *sql.DB) error {
	stmt := `
	CREATE TABLE IF NOT EXISTS todo(
		id INTEGER NOT NULL PRIMARY KEY, 
		title TEXT NOT NULL, 
		content TEXT, 
		done BOOL, 
		due TEXT);`
	if _, err := db.Exec(stmt); err != nil {
		log.Printf("%q: %s\n", err, stmt)
		return err
	}
	return nil
}

func CreatePomoTable(db *sql.DB) error {
	stmt := `
	CREATE TABLE IF NOT EXISTS pomo(
		id INTEGER NOT NULL PRIMARY KEY,
		task TEXT, 
		duration INTEGER NOT NULL, 
		started INTEGER, 
		finished INTEGER,
		todoid INTEGER,
		FOREIGN KEY(todoid) REFERENCES todo(id) 
		);`
	if _, err := db.Exec(stmt); err != nil {
		log.Printf("%q: %s\n", err, stmt)
		return err
	}
	return nil
}
