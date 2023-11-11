package pomo

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/And1x/GoReact-Todo/models"
)

type PomoModel struct {
	DB *sql.DB
}

func (pm *PomoModel) Get(filter []string) ([]*models.Pomo, error) {
	var stmt string
	switch filter[0] {
	case "today":
		day := time.Now().Day()
		month := time.Now().Month()
		year := time.Now().Year()
		stmt = fmt.Sprintf(`SELECT * FROM pomo WHERE strftime('%%d - %%m - %%Y', DATE(started / 1000, 'unixepoch')) = '%02d - %02d - %d';`, day, month, year)
	case "month":
		month := time.Now().Month()
		year := time.Now().Year()
		stmt = fmt.Sprintf(`SELECT * FROM pomo WHERE strftime('%%m - %%Y', DATE(started / 1000, 'unixepoch')) = '%02d - %d';`, month, year)
	case "year":
		year := time.Now().Year()
		stmt = fmt.Sprintf(`SELECT * FROM pomo WHERE strftime('%%Y', DATE(started / 1000, 'unixepoch')) = '%d';`, year)
	case "all":
		stmt = `SELECT * FROM pomo;`
	case "custom":
		// filter[0] = custom -- filter[1] = from_date -- filter[2] = to_date
		stmt = fmt.Sprintf(`SELECT * FROM pomo WHERE DATE(started / 1000, 'unixepoch') >= '%v' AND DATE(started / 1000, 'unixepoch') <= '%v';`, filter[1], filter[2])
	default:
		return nil, fmt.Errorf("invalid url query format")
	}

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
