package main

import (
	"log"
	"net/http"

	"github.com/Devazt/Trivia-Game/controllers"
	"github.com/Devazt/Trivia-Game/initializers"
	"github.com/Devazt/Trivia-Game/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var server *gin.Engine

func init() {
	initializers.ConnectDB()

	server = gin.Default()
}

func main() {
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:3000"}
	corsConfig.AllowCredentials = true

	server.Use(cors.New(corsConfig))

	router := server.Group("/api")
	router.GET("/healthchecker", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"status": "success", "message": "Welcome to Trivia Game API"})
	})

	auth_router := router.Group("/auth")
	auth_router.POST("/signup", controllers.SignUpUser)
	auth_router.POST("/login", controllers.SignInUser)
	auth_router.POST("/logout", middleware.DeserializeUser(), controllers.LogoutUser)

	router.GET("/sessions/oauth/google", controllers.GoogleOAuth)
	router.GET("/users/me", middleware.DeserializeUser(), controllers.GetMe)

	router.StaticFS("/images", http.Dir("public"))
	server.NoRoute(func(ctx *gin.Context) {
		ctx.JSON(http.StatusNotFound, gin.H{"status": "fail", "message": "Route not found"})
	})

	log.Fatal(server.Run(":" + "8000"))
}
