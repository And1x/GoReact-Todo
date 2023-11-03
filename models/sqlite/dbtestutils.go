package sqlite

import (
	"database/sql"
	"os"
	"testing"

	"github.com/And1x/GoReact-Todo/models"
	_ "github.com/mattn/go-sqlite3"
)

// generate a TEST-DB
func NewTestDB(t *testing.T) (*sql.DB, func()) {
	tstDBLocation := "../../../data/TEST_DB.db"
	dsn := "?_foreign_keys=true"
	db, err := sql.Open("sqlite3", tstDBLocation+dsn)
	if err != nil {
		t.Fatal(err)
	}
	if err = models.CreateTodoTable(db); err != nil {
		t.Fatal(err)
	}
	if _, err := db.Exec(`INSERT INTO todo(title, content, done, due) VALUES('tsttitle','c',false,'2024-10-25');`); err != nil {
		t.Fatal(err)
	}
	if err = models.CreatePomoTable(db); err != nil {
		t.Fatal(err)
	}
	if _, err := db.Exec(`INSERT INTO pomo(task, duration, started, finished) VALUES("Let's code", 50,1699017393274, 1699020213990 );`); err != nil {
		t.Fatal(err)
	}

	return db, func() {
		db.Close()
		os.Remove(tstDBLocation)
	}
}
