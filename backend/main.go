package main

import (
	"log"

	"codecrafted/portfolio/config"
	"codecrafted/portfolio/handlers"
	"codecrafted/portfolio/middleware"
	"codecrafted/portfolio/models"
	"codecrafted/portfolio/seed"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize database
	config.InitDB()
	defer config.DB.Close()

	// Create default admin and seed data
	models.CreateDefaultAdmin()
	seed.SeedData()

	// Set up Gin router
	r := gin.Default()

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:4200", "http://localhost:4201"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Public routes
	api := r.Group("/api")
	{
		// Auth
		api.POST("/auth/login", handlers.Login)

		// Articles (public read)
		api.GET("/articles", handlers.GetArticles)
		api.GET("/articles/:id", handlers.GetArticle)

		// Snippets (public read)
		api.GET("/snippets", handlers.GetSnippets)
		api.GET("/snippets/:id", handlers.GetSnippet)
	}

	// Protected routes
	admin := api.Group("/")
	admin.Use(middleware.AuthRequired())
	{
		// Articles (admin CRUD)
		admin.POST("/articles", handlers.CreateArticle)
		admin.PUT("/articles/:id", handlers.UpdateArticle)
		admin.DELETE("/articles/:id", handlers.DeleteArticle)

		// Snippets (admin CRUD)
		admin.POST("/snippets", handlers.CreateSnippet)
		admin.PUT("/snippets/:id", handlers.UpdateSnippet)
		admin.DELETE("/snippets/:id", handlers.DeleteSnippet)
	}

	log.Println("Server starting on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
