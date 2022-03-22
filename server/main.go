package main

import (
	"fmt"
	"net/http"
)


func Generate(writer http.ResponseWriter, request* http.Request) {
	fmt.Fprintf(writer, "Test")
}

func main() {
	fmt.Println("Started")
	http.HandleFunc("/api/generate", Generate)
	http.ListenAndServe(":8000", nil)
}