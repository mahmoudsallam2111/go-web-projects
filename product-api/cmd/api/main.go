package main

import (
	"log"
	"os"
	"product-api/internal/category"
	"product-api/internal/database"
	"product-api/internal/domain"
	"product-api/internal/product"
	"product-api/routes"

	"github.com/joho/godotenv"
)

// @title Product API
// @version 1.0
// @description This is a sample CRUD API for products.
// @host localhost:8080
// @BasePath /api
func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// 1. Initialize Database
	db := database.Connect()

	// 2. Run Migrations here (Keeping the database package pure!)
	err := db.AutoMigrate(&domain.Category{}, &domain.Product{})
	if err != nil {
		log.Fatal("Migration failed:", err)
	}

	// 3. Product Feature Dependency Injection
	productRepo := product.NewRepository(db)
	productService := product.NewService(productRepo)
	productHandler := product.NewHandler(productService)
	// 4. Category Feature Dependency Injection
	categoryRepo := category.NewRepository(db)
	categoryService := category.NewService(categoryRepo)
	categoryHandler := category.NewHandler(categoryService)

	// 5. Pass handlers to the router
	router := routes.SetupRouter(productHandler, categoryHandler)

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server is running on http://localhost:%s", port)
	router.Run(":" + port)
}
