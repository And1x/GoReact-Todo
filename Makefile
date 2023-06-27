build:
	npm --prefix "./_ui/" run build
	go build

dev:
	npm --prefix "./_ui/" run build
	go run .