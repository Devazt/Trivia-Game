package usersdto

import "github.com/google/uuid"

type UserResponse struct {
	ID     uuid.UUID `json:"id"`
	Name   string    `json:"name" form:"name" validate:"required"`
	Email  string    `json:"email" form:"email" validate:"required"`
	Avatar string    `json:"avatar" form:"avatar"`
	Role   string    `json:"role" form:"role"`
}

type Resp struct {
	Name   string `json:"name"`
	Avatar string `json:"avatar"`
	Role   string `json:"role"`
	Token  string `json:"token"`
}
