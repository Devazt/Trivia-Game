package repositories

import (
	"log"

	"github.com/Nakano-Nino/Trivia-Game/models"

	"gorm.io/gorm"
)

type UserRepository interface {
	GetUser(Email string) (models.User, error)
	CreateUser(user models.User) (models.User, error)
}

type repository struct {
	db *gorm.DB
}

func RepositoryUsers(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) GetUser(Email string) (models.User, error) {
	var user models.User
	err := r.db.First(&user, "email = ?", Email).Error

	return user, err
}

func (r *repository) CreateUser(user models.User) (models.User, error) {
	err := r.db.Create(&user).Error
	if err != nil {
		log.Fatal("failed to create user: ", err)
	}
	return user, err
}
