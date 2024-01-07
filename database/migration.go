package database

import (
	"github.com/Nakano-Nino/Trivia-Game/models"
	"github.com/Nakano-Nino/Trivia-Game/pkg/postgres"
	"fmt"
)

func RunMigration() {
	err := postgres.DB.AutoMigrate(&models.User{})

	if err != nil {
		fmt.Println(err)
		panic("Migration Failed")
	}

	fmt.Println("Migration Success")
}