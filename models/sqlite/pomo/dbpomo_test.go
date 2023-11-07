package pomo

import (
	"reflect"
	"strings"
	"testing"

	"github.com/And1x/GoReact-Todo/models"
	"github.com/And1x/GoReact-Todo/models/sqlite"
	"github.com/mattn/go-sqlite3"
)

func TestGetAll(t *testing.T) {

	if testing.Short() {
		t.Skip("sqlite: skipping integration test - GetAll()")
	}

	t.Run("Get All Rows of pomo", func(t *testing.T) {
		db, dbRemove := sqlite.NewTestDB(t)
		defer dbRemove()

		m := PomoModel{db}

		f := []string{"all"}
		pomos, err := m.Get(f)
		if err != nil {
			t.Errorf("failed calling GetAll()\n err: %v", err)
		}
		wantPomos := []*models.Pomo{{Id: 1, Task: "Let's code", Duration: 50, Started: 1699017393274, Finished: 1699020213990, TodoId: 0}}
		if !reflect.DeepEqual(pomos, wantPomos) {
			t.Errorf("want %v, got %v", *wantPomos[0], *pomos[0]) // only one row is there so look at em
		}

		wrongPomos := []*models.Pomo{{Id: 21, Task: "none", Duration: 50, Started: 0, Finished: 0 + (50 * 60 * 1000)}}
		if reflect.DeepEqual(pomos, wrongPomos) {
			t.Errorf("want %v, not to be %v", *wrongPomos[0], *pomos[0])
		}
	})
}

func TestNew(t *testing.T) {

	if testing.Short() {
		t.Skip("sqlite: skipping integration test - New()")
	}

	tests := []struct {
		name      string
		addPomo   *models.Pomo
		wantError error
	}{
		{
			name:      "Valid Pomo - without todoid",
			addPomo:   &models.Pomo{Task: "Lets do it", Duration: 50, Started: 1699017393274, Finished: 1699020213990},
			wantError: nil,
		},
		{
			name:      "Valid Pomo - with todoid",
			addPomo:   &models.Pomo{Task: "With todid", Duration: 50, Started: 1699017393274, Finished: 1699020213990, TodoId: 1},
			wantError: nil,
		},
		{
			name:      "Valid - Empty Pomo ",
			addPomo:   &models.Pomo{},
			wantError: nil,
		},
		{
			name:      "Invalid Pomo - todoid not in todo_table",
			addPomo:   &models.Pomo{Task: "Invalid todoid", Duration: 50, Started: 1699017393274, Finished: 1699020213990, TodoId: 966},
			wantError: sqlite3.ErrConstraintForeignKey, // see error.go from github.com/mattn/go-sqlite3
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			db, dbRemove := sqlite.NewTestDB(t)
			defer dbRemove()

			m := PomoModel{db}

			err := m.New(tt.addPomo)
			if err != tt.wantError {
				if !strings.Contains(err.Error(), tt.wantError.Error()) {
					t.Errorf("want Error: %v, got Error: %v", tt.wantError, err)
				}
			}
		})
	}
}
