package sqlite

import (
	"database/sql"
	"os"
	"testing"

	"github.com/And1x/GoReact-Todo/models"
)

// generate a TEST-DB
func NewTestDB(t *testing.T) (*sql.DB, func()) {
	tstDBLocation := "./data/TEST_DB.db"
	db, err := sql.Open("sqlite3", tstDBLocation)
	if err != nil {
		t.Fatal(err)
	}
	if err = models.CreateTodoTable(db); err != nil {
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
