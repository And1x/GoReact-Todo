package main

import (
	"database/sql"
	"log"
)

type TodoModel struct {
	DB *sql.DB
}

func createTables(db *sql.DB) error {
	sqlStmt := `
	CREATE TABLE IF NOT EXISTS todo(id INTEGER NOT NULL PRIMARY KEY, title TEXT NOT NULL, content TEXT, done BOOL, due TEXT);
	`
	if _, err := db.Exec(sqlStmt); err != nil {
		log.Printf("%q: %s\n", err, sqlStmt)
		return err
	}
	return nil
}

func (tm *TodoModel) GetAll() ([]*Todo, error) {
	stmt := `SELECT * FROM todo;`
	rows, err := tm.DB.Query(stmt)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	todos := []*Todo{}
	for rows.Next() {
		t := &Todo{}
		err := rows.Scan(&t.Id, &t.Title, &t.Content, &t.Done, &t.Due)
		if err != nil {
			return nil, err
		}
		todos = append(todos, t)
	}
	return todos, nil
}

// todo: throw EditState and just use Edit?
func (tm *TodoModel) EditState(id int) (*Todo, error) {

	var prevState bool
	err := tm.DB.QueryRow(`SELECT done FROM todo WHERE id = ?`, id).Scan(&prevState)
	if err != nil {
		return nil, err
	}

	var t Todo
	stmt := `UPDATE todo SET done = ? WHERE id = ? RETURNING *`
	if err := tm.DB.QueryRow(stmt, !prevState, id).Scan(&t.Id, &t.Title, &t.Content, &t.Done, &t.Due); err != nil {
		return nil, err
	}
	return &t, nil
}

func (tm *TodoModel) Edit(todo Todo) (*Todo, error) {

	stmt := `
	UPDATE todo SET title = ?, content = ?, done = ?, due = ? WHERE id = ? RETURNING *
	`
	var t Todo
	if err := tm.DB.QueryRow(stmt, todo.Title, todo.Content, todo.Done, todo.Due, todo.Id).Scan(&t.Id, &t.Title, &t.Content, &t.Done, &t.Due); err != nil {
		return nil, err
	}
	return &t, nil
}

func (tm *TodoModel) New(todo Todo) (*Todo, error) {

	stmt := `
	INSERT INTO todo(title,content,done,due) VALUES( ?, ?, ?, ?) RETURNING *;
	`
	var t Todo
	if err := tm.DB.QueryRow(stmt, todo.Title, todo.Content, todo.Done, todo.Due).Scan(&t.Id, &t.Title, &t.Content, &t.Done, &t.Due); err != nil {
		return nil, err
	}
	return &t, nil
}

func (tm *TodoModel) Delete(id int) error {

	stmt := `DELETE FROM todo WHERE id = ?`
	if _, err := tm.DB.Exec(stmt, id); err != nil {
		return err
	}
	return nil
}
