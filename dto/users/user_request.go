package usersdto

type CreateUserRequest struct {
	IdToken string `json:"idToken" form:"idToken" validate:"required"`
	// Name   string `json:"name" form:"name" validate:"required"`
	// Email  string `json:"email" form:"email" validate:"required"`
	// Avatar string `json:"avatar" form:"avatar"`
	// Role   string `json:"role" form:"role"`
}
