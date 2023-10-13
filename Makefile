build:
	npm --prefix "./_ui/" run build
	go build

# NOTE: REACT UI gets build -> no double render to detect side effects 
# just run the UI in "/_ui" with 'npm run dev' 
dev:
	npm --prefix "./_ui/" run build
	go run .