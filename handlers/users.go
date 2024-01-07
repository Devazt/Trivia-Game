package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"fmt"

	dto "github.com/Nakano-Nino/Trivia-Game/dto/result"
	usersdto "github.com/Nakano-Nino/Trivia-Game/dto/users"
	"github.com/Nakano-Nino/Trivia-Game/models"
	jwtToken "github.com/Nakano-Nino/Trivia-Game/pkg/jwt"
	"github.com/Nakano-Nino/Trivia-Game/repositories"
	// "github.com/futurenda/google-auth-id-token-verifier"
	"github.com/go-playground/validator"
	"github.com/golang-jwt/jwt/v5"
	// "github.com/gorilla/mux"
)

const aud = "499994503524-88e2rd415lra144ho7hb6ibsao3rpqro.apps.googleusercontent.com"

type handler struct {
	UserRepository repositories.UserRepository
}

func Handleuser(UserRepository repositories.UserRepository) *handler {
	return &handler{UserRepository}
}

func (h *handler) GetUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	request := new(usersdto.GetUserRequest)

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

	user, err := h.UserRepository.GetUser(request.Email)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
			json.NewEncoder(w).Encode(response)
			return
		}

		claims := jwt.MapClaims{}
		claims["id"] = user.ID
		claims["name"] = user.Name
		claims["avatar"] = user.Avatar

		token, errGenerateToken := jwtToken.GenerateToken(&claims)
		if errGenerateToken != nil {
			log.Println(errGenerateToken)
			fmt.Println("Unauthorize")
			return
		}

		Resp := usersdto.Resp{
			Name:   user.Name,
			Avatar: user.Avatar,
			Role:   user.Role,
			Token:  token,
		}

		w.WriteHeader(http.StatusOK)
		response := dto.SuccessResult{Code: http.StatusOK, Data: Resp}
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

	fmt.Println(request)

	user := models.User{
		Name:   request.Name,
		Email:  request.Email,
		Avatar: request.Avatar,
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

	// v := googleAuthIDTokenVerifier.Verifier{}
	// // aud := "499994503524-88e2rd415lra144ho7hb6ibsao3rpqro.apps.googleusercontent.com"
	// err = v.VerifyIDToken(request.IdToken, []string{aud})
	// if err == nil {
	// 	claimSet, err := googleAuthIDTokenVerifier.Decode(request.IdToken)
	// 	user := models.User{
	// 		Name:   claimSet.Name,
	// 		Email:  claimSet.Email,
	// 		Avatar: claimSet.Picture,
	// 		Role:   "user",
	// 	}

	// 	data, err := h.UserRepository.CreateUser(user)
	// 	if err != nil {
	// 		w.WriteHeader(http.StatusInternalServerError)
	// 		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
	// 		json.NewEncoder(w).Encode(response)
	// 	}

	// 	w.WriteHeader(http.StatusOK)
	// 	response := dto.SuccessResult{Code: http.StatusOK, Data: ConvertResponse(data)}
	// 	json.NewEncoder(w).Encode(response)
	// }
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
