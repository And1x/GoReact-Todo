package main

import (
	"database/sql"
	"os"
	"reflect"
	"testing"
)

// generate a TEST-DB
func newTestDB(t *testing.T) (*sql.DB, func()) {
	tstDBLocation := "./data/TEST_DB.db"
	db, err := sql.Open("sqlite3", tstDBLocation)
	if err != nil {
		t.Fatal(err)
	}
	if err = createTables(db); err != nil {
		t.Fatal(err)
	}
	if _, err := db.Exec("INSERT INTO todo(title, content, done, due) VALUES('tsttitle','c',false,'2024-10-25');"); err != nil {
		t.Fatal(err)
	}

	return db, func() {
		db.Close()
		os.Remove("./data/TEST_DB.db")
	}
}

func TestGetAll(t *testing.T) {

	if testing.Short() {
		t.Skip("sqlite: skipping integration test - GetAll()")
	}

	t.Run("Get All Rows of todo", func(t *testing.T) {
		db, dbRemove := newTestDB(t)
		defer dbRemove()

		m := TodoModel{db}

		todos, err := m.GetAll()
		if err != nil {
			t.Errorf("failed calling GetAll()\n err: %v", err)
		}
		wantTodos := []*Todo{{Id: 1, Title: "tsttitle", Content: "c", Done: false, Due: "2024-10-25"}}
		if !reflect.DeepEqual(todos, wantTodos) {
			t.Errorf("want %v, got %v", *wantTodos[0], *todos[0]) // only one row is there so look at em
		}

		wrongTodos := []*Todo{{Id: 1, Title: "not there", Content: "abc", Done: false, Due: ""}}
		if reflect.DeepEqual(todos, wrongTodos) {
			t.Errorf("want %v, not to be %v", *wrongTodos[0], *todos[0])
		}
	})
}

func TestEditState(t *testing.T) {
	if testing.Short() {
		t.Skip("sqlite: skipping integration test - GetAll()")
	}

	tests := []struct {
		name      string
		todoID    int
		wantTodo  *Todo
		wantError error
	}{
		{
			name:      "Valid ID",
			todoID:    1,
			wantTodo:  &Todo{Id: 1, Title: "tsttitle", Content: "c", Done: true, Due: "2024-10-25"},
			wantError: nil,
		},
		{
			name:      "Invalid ID",
			todoID:    -1,
			wantTodo:  nil,
			wantError: sql.ErrNoRows,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			db, dbRemove := newTestDB(t)
			defer dbRemove()

			m := TodoModel{db}

			getTodo, err := m.EditState(tt.todoID)
			if err != tt.wantError {
				t.Errorf("want: %v, got: %v", tt.wantError, err)
			}
			if !reflect.DeepEqual(getTodo, tt.wantTodo) {
				t.Errorf("want: %v, got: %v", tt.wantTodo, getTodo)
			}

		})
	}
}

func TestEdit(t *testing.T) {
	if testing.Short() {
		t.Skip("sqlite: skipping integration test - GetAll()")
	}

	tests := []struct {
		name        string
		changedTodo *Todo
		wantTodo    *Todo
		wantError   error
	}{
		{
			name:        "Valid Todo",
			changedTodo: &Todo{Id: 1, Title: "This title got an edit", Content: "content too", Done: true, Due: "2024-10-25"},
			wantTodo:    &Todo{Id: 1, Title: "This title got an edit", Content: "content too", Done: true, Due: "2024-10-25"},
			wantError:   nil,
		},
		{
			name:        "Invalid/Non existing Todo",
			changedTodo: &Todo{Id: -103, Title: "tsttitle", Content: "c", Done: true, Due: ""},
			wantTodo:    nil,
			wantError:   sql.ErrNoRows,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			db, dbRemove := newTestDB(t)
			defer dbRemove()

			m := TodoModel{db}

			getTodo, err := m.Edit(*tt.changedTodo)
			if err != tt.wantError {
				t.Errorf("want: %v, got: %v", tt.wantError, err)
			}
			if !reflect.DeepEqual(getTodo, tt.wantTodo) {
				t.Errorf("want: %v, got: %v", tt.wantTodo, getTodo)
			}

		})
	}
}

func TestNew(t *testing.T) {
	if testing.Short() {
		t.Skip("sqlite: skipping integration test - GetAll()")
	}

	tests := []struct {
		name      string
		addTodo   Todo
		wantTodo  *Todo
		wantError error
	}{
		{
			name:      "New Valid Todo",
			addTodo:   Todo{Title: "This title got an edit", Content: "content too", Done: true, Due: "2024-10-25"},
			wantTodo:  &Todo{Id: 2, Title: "This title got an edit", Content: "content too", Done: true, Due: "2024-10-25"},
			wantError: nil,
		},
		{
			name:      "Empty Todo",
			addTodo:   Todo{},
			wantTodo:  &Todo{Id: 2, Title: "", Content: "", Done: false, Due: ""},
			wantError: nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			db, dbRemove := newTestDB(t)
			defer dbRemove()

			m := TodoModel{db}

			getTodo, err := m.New(tt.addTodo)

			if err != tt.wantError {
				t.Errorf("want: %v, got: %v", tt.wantError, err)
			}
			if !reflect.DeepEqual(getTodo, tt.wantTodo) {
				t.Errorf("want: %v, got: %v", tt.wantTodo, getTodo)
			}

		})
	}
}

func TestDelete(t *testing.T) {

	if testing.Short() {
		t.Skip("sqlite: skipping integration test - GetAll()")
	}

	tests := []struct {
		name      string
		id        int
		wantError error
		dbEntries int
	}{
		{
			name:      "Valid ID to Delete",
			id:        1,
			wantError: nil,
			dbEntries: 0,
		},
		{
			name:      "Ivalid ID to Delete",
			id:        1203123,
			wantError: nil, // sqlite throws no error when deleting a non existent entry
			dbEntries: 1,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			db, dbRemove := newTestDB(t)
			defer dbRemove()

			m := TodoModel{db}

			err := m.Delete(tt.id)
			if err != tt.wantError {
				t.Errorf("want: %v, got: %v", tt.wantError, err)
			}

			// lets do a query and check if entry got Deleted
			todos, err := m.GetAll()
			if err != nil {
				t.Fatal(err)
			}
			if len(todos) != tt.dbEntries {
				t.Errorf("want: %v, got: %v", tt.dbEntries, len(todos))
			}

		})
	}
}
