package main

import (
	"bytes"
	"encoding/json"
	"os"
	"testing"
)

// utils
func NewTodoFileStorageDS() *TodosFileStorage {
	return &TodosFileStorage{dirName: "folder", fileName: "testData", fileType: ".json"}
}

func NewStorageDirFile(tf *TodosFileStorage, content []byte) error {

	tempDir, err := os.MkdirTemp("", tf.dirName)
	if err != nil {
		return err
	}
	tf.dirName = tempDir

	if err := os.WriteFile(tf.getFilePath(), content, 0644); err != nil {
		return err
	}
	return nil
}

func TestGetFilePath(t *testing.T) {

	tf := NewTodoFileStorageDS()
	got := tf.getFilePath()
	want := tf.dirName + "/" + tf.fileName + tf.fileType

	if got != want {
		t.Errorf("want %v; got %v", want, got)
	}
}

func TestLoadFile(t *testing.T) {

	tf := NewTodoFileStorageDS()

	t.Run("should return file and create data folder+file - folder does not exits", func(t *testing.T) {

		f, err := tf.loadFile()
		if err != nil {
			t.Fatal(err)
		}
		defer f.Close()
		defer os.RemoveAll(tf.dirName)

		// check if folder and file got created
		_, err = os.Stat(tf.getFilePath())
		if os.IsNotExist(err) {
			t.Errorf("file does not exits")
		}
	})

	t.Run("should return file - when folder and file already exist", func(t *testing.T) {
		tempDir, err := os.MkdirTemp("", tf.dirName)
		if err != nil {
			t.Fatal(err)
		}
		defer os.RemoveAll(tempDir)

		tf.dirName = tempDir

		_, err = os.Create(tf.getFilePath())
		if err != nil {
			t.Fatal(err)
		}

		// check if folder and file got created
		_, err = os.Stat(tf.getFilePath())
		if os.IsNotExist(err) {
			t.Errorf("file does not exits")
		}

	})
}

func TestWriteFile(t *testing.T) {

	tf := NewTodoFileStorageDS()
	testTodos := []Todo{{Id: 1, Title: "test", Content: "no one", Done: false}, {Id: 2, Title: "test 2", Content: "no two", Done: false}}

	tempDir, err := os.MkdirTemp("", tf.dirName)
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tempDir)

	tf.dirName = tempDir

	// create a temp file
	_, err = os.Create(tf.getFilePath())
	if err != nil {
		t.Fatal(err)
	}

	// use writeFile
	if err = tf.writeFile(testTodos); err != nil {
		t.Fatalf("should write Todos to Tempfile: %v", err)
	}

	// check if todos got correctly written
	got, err := os.ReadFile(tf.getFilePath())
	if err != nil {
		t.Fatal(err)
	}
	want, err := json.Marshal(testTodos)
	if err != nil {
		t.Fatal(err)
	}

	if !bytes.Equal(got, want) {
		t.Errorf("want: %s, got: %s", want, got)
	}
}

func TestGetAll(t *testing.T) {

	tf := NewTodoFileStorageDS()
	testTodos := []Todo{{Id: 1, Title: "test", Content: "no one", Done: false}, {Id: 2, Title: "test 2", Content: "no two", Done: false}}
	c, err := json.Marshal(testTodos)
	if err != nil {
		t.Fatal(err)
	}
	if err := NewStorageDirFile(tf, c); err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tf.dirName)

	got, err := tf.GetAll()
	if err != nil {
		t.Fatal(err)
	}
	want := c

	if !bytes.Equal(got, want) {
		t.Errorf("want: %s, got: %s", want, got)
	}
}

func TestEditState(t *testing.T) {

	tests := map[string]struct {
		toTestTodos []Todo
		toTestId    int
		want        Todo
	}{
		"happy path":   {toTestTodos: []Todo{{Id: 1, Title: "test", Content: "no one", Done: false}, {Id: 2, Title: "test 2", Content: "no two", Done: false}}, toTestId: 1, want: Todo{Id: 1, Title: "test", Content: "no one", Done: true}},
		"happy path 2": {toTestTodos: []Todo{{Id: 1, Title: "test", Content: "no one", Done: true}, {Id: 2, Title: "test 2", Content: "no two", Done: false}}, toTestId: 1, want: Todo{Id: 1, Title: "test", Content: "no one", Done: false}},
		"bad ID":       {toTestTodos: []Todo{{Id: 1, Title: "test", Content: "no one", Done: false}, {Id: 2, Title: "test 2", Content: "no two", Done: false}}, toTestId: 765, want: Todo{}},
	}

	for tname, tc := range tests {
		t.Run(tname, func(t *testing.T) {

			tf := NewTodoFileStorageDS()
			c, err := json.Marshal(tc.toTestTodos)
			if err != nil {
				t.Fatal(err)
			}
			if err := NewStorageDirFile(tf, c); err != nil {
				t.Fatal(err)
			}
			defer os.RemoveAll(tf.dirName)

			result, err := tf.EditState(tc.toTestId)
			if err != nil {
				t.Fatal(err)
			}
			var got Todo
			if err := json.Unmarshal(result, &got); err != nil {
				t.Fatal(err)
			}

			if got != tc.want {
				t.Errorf("got %v, want %v", got, tc.want)
			}
		})
	}
}

func TestEdit(t *testing.T) {

	tests := map[string]struct {
		toTestTodos []Todo
		want        Todo
	}{
		"happy path": {toTestTodos: []Todo{{Id: 1, Title: "test", Content: "no one", Done: false}, {Id: 2, Title: "test 2", Content: "no two", Done: false}}, want: Todo{Id: 1, Title: "got edited", Content: "todo more things", Done: false}},
		"bad ID":     {toTestTodos: []Todo{{Id: 1, Title: "test", Content: "no one", Done: false}, {Id: 2, Title: "test 2", Content: "no two", Done: false}}, want: Todo{}},
	}

	for tname, tc := range tests {
		t.Run(tname, func(t *testing.T) {
			tf := NewTodoFileStorageDS()
			c, err := json.Marshal(tc.toTestTodos)
			if err != nil {
				t.Fatal(err)
			}
			if err := NewStorageDirFile(tf, c); err != nil {
				t.Fatal(err)
			}
			defer os.RemoveAll(tf.dirName)

			result, err := tf.Edit(tc.want)
			if err != nil {
				t.Fatal(err)
			}

			var got Todo
			if err := json.Unmarshal(result, &got); err != nil {
				t.Fatal(err)
			}

			if got != tc.want {
				t.Errorf("got %v, want %v", got, tc.want)
			}
		})
	}
}

func TestDelete(t *testing.T) {

	tests := map[string]struct {
		toTestTodos []Todo
		toDeleteId  int
		want        int
	}{
		"happy path": {toTestTodos: []Todo{{Id: 1, Title: "test", Content: "no one", Done: false}, {Id: 2, Title: "test 2", Content: "no two", Done: false}}, toDeleteId: 1, want: 1},
		"bad ID":     {toTestTodos: []Todo{{Id: 1, Title: "test", Content: "no one", Done: false}, {Id: 2, Title: "test 2", Content: "no two", Done: false}}, toDeleteId: 765, want: 2},
	}

	for tname, tc := range tests {
		t.Run(tname, func(t *testing.T) {
			tf := NewTodoFileStorageDS()
			c, err := json.Marshal(tc.toTestTodos)
			if err != nil {
				t.Fatal(err)
			}
			if err := NewStorageDirFile(tf, c); err != nil {
				t.Fatal(err)
			}
			defer os.RemoveAll(tf.dirName)

			if err := tf.Delete(tc.toDeleteId); err != nil {
				t.Fatal(err)
			}

			// check edited todofile
			fc, err := os.ReadFile(tf.getFilePath())
			if err != nil {
				t.Fatal(err)
			}
			var fileTodos []Todo
			if err := json.Unmarshal(fc, &fileTodos); err != nil {
				t.Fatal(err)
			}

			got := len(fileTodos)

			if got != tc.want {
				t.Errorf("want len %v, got len %v", tc.want, got)
			}
		})
	}
}

func TestNew(t *testing.T) {

	tests := map[string]struct {
		toTestTodos []Todo
		toAdd       Todo
		amntToAdd   int
		want        int
	}{
		"happy path": {toTestTodos: []Todo{{Id: 1, Title: "test", Content: "no one", Done: false}, {Id: 2, Title: "test 2", Content: "no two", Done: false}}, toAdd: Todo{Title: "new add", Content: "some content", Done: false}, amntToAdd: 1, want: 3},
		"add 4":      {toTestTodos: []Todo{}, toAdd: Todo{Title: "new add", Content: "some content", Done: false}, amntToAdd: 4, want: 4},
	}

	for tname, tc := range tests {
		t.Run(tname, func(t *testing.T) {
			tf := NewTodoFileStorageDS()
			c, err := json.Marshal(tc.toTestTodos)
			if err != nil {
				t.Fatal(err)
			}
			if err := NewStorageDirFile(tf, c); err != nil {
				t.Fatal(err)
			}
			defer os.RemoveAll(tf.dirName)

			for i := 0; i < tc.amntToAdd; i++ {
				_, err = tf.New(tc.toAdd)
				if err != nil {
					t.Fatal(err)
				}
			}

			fc, err := os.ReadFile(tf.getFilePath())
			if err != nil {
				t.Fatal(err)
			}
			var fileTodos []Todo
			if err := json.Unmarshal(fc, &fileTodos); err != nil {
				t.Fatal(err)
			}

			got := len(fileTodos)

			if got != tc.want {
				t.Errorf("want len %v, got len %v", tc.want, got)
			}
		})
	}
}
