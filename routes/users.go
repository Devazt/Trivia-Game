package routes

import (
	"github.com/Nakano-Nino/Trivia-Game/handlers"
	"github.com/Nakano-Nino/Trivia-Game/pkg/postgres"
	"github.com/Nakano-Nino/Trivia-Game/repositories"

	"github.com/gorilla/mux"
)

func UserRoutes(r *mux.Router) {
	userRepository := repositories.RepositoryUsers(postgres.DB)
	h := handlers.Handleuser(userRepository)

	r.HandleFunc("/user", h.GetUser).Methods("POST")
	r.HandleFunc("/createUser", h.CreateUser).Methods("POST")
}