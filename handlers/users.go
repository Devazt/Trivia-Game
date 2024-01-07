package handlers

import (
	"encoding/json"
	"net/http"

	dto "github.com/Nakano-Nino/Trivia-Game/dto/result"
	usersdto "github.com/Nakano-Nino/Trivia-Game/dto/users"
	"github.com/Nakano-Nino/Trivia-Game/models"
	"github.com/Nakano-Nino/Trivia-Game/repositories"
	"github.com/futurenda/google-auth-id-token-verifier"
	"github.com/go-playground/validator"

	"github.com/gorilla/mux"
)

type handler struct {
	UserRepository repositories.UserRepository
}

func Handleuser(UserRepository repositories.UserRepository) *handler {
	return &handler{UserRepository}
}

func (h *handler) GetUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	email := mux.Vars(r)["email"]

	user, err := h.UserRepository.GetUser(email)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: ConvertResponse(user)}
	json.NewEncoder(w).Encode(response)
}

func (h *handler) CreateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	request := new(usersdto.CreateUserRequest)
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	v := googleAuthIDTokenVerifier.Verifier{}
	aud := "499994503524-88e2rd415lra144ho7hb6ibsao3rpqro.apps.googleusercontent.com"
	err = v.VerifyIDToken(request.IdToken, []string{aud})
	if err == nil {
		claimSet, err := googleAuthIDTokenVerifier.Decode(request.IdToken)
		user := models.User{
			Name:   claimSet.Name,
			Email:  claimSet.Email,
			Avatar: claimSet.Picture,
			Role:   "user",
		}

		data, err := h.UserRepository.CreateUser(user)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
			json.NewEncoder(w).Encode(response)
		}

		w.WriteHeader(http.StatusOK)
		response := dto.SuccessResult{Code: http.StatusOK, Data: ConvertResponse(data)}
		json.NewEncoder(w).Encode(response)
	}
}

func ConvertResponse(u models.User) usersdto.UserResponse {
	return usersdto.UserResponse{
		ID:     u.ID,
		Name:   u.Name,
		Email:  u.Email,
		Avatar: u.Avatar,
		Role:   u.Role,
	}
}
