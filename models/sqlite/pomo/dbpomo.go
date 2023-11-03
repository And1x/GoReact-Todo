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
		var mayNull sql.NullInt16 // refernce todoid may be SQL value of NULL -> Go's Int does not support it
		err := rows.Scan(&p.Id, &p.Task, &p.Duration, &p.Started, &p.Finished, &mayNull)
		if err != nil {
			return nil, err
		}
		p.TodoId = int(mayNull.Int16)
		pomos = append(pomos, p)
	}
	return pomos, nil
}

func (pm *PomoModel) New(pomo *models.Pomo) error {
	var stmt string
	if pomo.TodoId == 0 {
		stmt = `
			INSERT INTO pomo(task, duration, started, finished)
			VALUES(?, ?, ?, ?);`
		if _, err := pm.DB.Exec(stmt, pomo.Task, pomo.Duration, pomo.Started, pomo.Finished); err != nil {
			return err
		}
	} else {
		stmt = `
			INSERT INTO pomo(task, duration, started, finished, todoid)
			VALUES(?, ?, ?, ?, ?);`
		if _, err := pm.DB.Exec(stmt, pomo.Task, pomo.Duration, pomo.Started, pomo.Finished, pomo.TodoId); err != nil {
			return err
		}
	}
	return nil
}
