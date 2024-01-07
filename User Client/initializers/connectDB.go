package initializers

import (
	"fmt"
	"log"

	"github.com/Devazt/Trivia-Game/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	dsn := "host=localhost user=postgres password=root dbname=celeb-minds port=5432 sslmode=disable TimeZone=Asia/Jakarta"
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("⚡ Failed to connect to the database! \n", err)
	}

	DB.AutoMigrate(&models.User{})
	fmt.Println("🚀 Connected to the database!")
}
