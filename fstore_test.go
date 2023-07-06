package main

import (
	"os"
	"testing"
)

// utils
func NewTodoFileStorage() *TodosFileStorage {
	return &TodosFileStorage{dirName: "folder", fileName: "testData", fileType: ".json"}
}

func TestGetFilePath(t *testing.T) {

	tf := NewTodoFileStorage()
	got := tf.getFilePath()
	want := tf.dirName + "/" + tf.fileName + tf.fileType

	if got != want {
		t.Errorf("want %v; got %v", want, got)
	}
}

func TestLoadFile(t *testing.T) {

	tf := NewTodoFileStorage()

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
