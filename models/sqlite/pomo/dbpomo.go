package pomo

import (
	"database/sql"

	"github.com/And1x/GoReact-Todo/models"
)

type PomoModel struct {
	DB *sql.DB
}

func (pm *PomoModel) GetAll() ([]*models.Pomo, error) {
	stmt := `SELECT * FROM pomo;`
	rows, err := pm.DB.Query(stmt)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	pomos := []*models.Pomo{}
	for rows.Next() {
		p := &models.Pomo{}
		err := rows.Scan(&p.Id, &p.Task, &p.Duration, &p.Started, &p.Finished, &p.TodoId)
		if err != nil {
			return nil, err
		}
		pomos = append(pomos, p)
	}
	return pomos, nil
}

// func (pm *PomoModel) New(p Pomo) error         {}
