package product

import (
	"net/http"
	"product-api/internal/product/dtos"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

type CreateProductRequest struct {
	Name        string  `json:"name" binding:"required"`
	Description string  `json:"description"`
	Price       float64 `json:"price" binding:"required,gt=0"`
	Stock       int     `json:"stock" binding:"required,gte=0"`
	CategoryID  *uint   `json:"category_id"`
}

// @Summary Create a new product
// @Description Adds a new product to the database
// @Accept json
// @Produce json
// @Param product body CreateProductRequest true "Product information"
// @Success 201 {object} domain.Product
// @Router /products [post]
func (h *Handler) CreateProduct(c *gin.Context) {
	var req CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	product, err := h.service.CreateProduct(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, product)
}

// @Summary Get all products
// @Description Fetches all products from the database
// @Produce json
// @Success 200 {array} domain.Product
// @Router /products [get]
func (h *Handler) GetProducts(c *gin.Context) {
	products, err := h.service.GetAllProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}

// @Summary Get a product by ID
// @Description Fetches a single product by its ID
// @Produce json
// @Param id path string true "Product ID"
// @Success 200 {object} ProductResponse
// @Router /products/{id} [get]
func (h *Handler) GetProductByID(c *gin.Context) {
	id := c.Param("id")

	product, err := h.service.GetProductByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	response := dtos.ProductResponse{
		ID:          product.ID, // gorm.Model provides the ID
		Name:        product.Name,
		Description: product.Description,
		Price:       product.Price,
		Stock:       product.Stock,
	}

	if product.Category != nil {
		response.CategoryName = &product.Category.Name
	}

	c.JSON(http.StatusOK, response)
}

type UpdateProductRequest struct {
	Name        *string  `json:"name"`
	Description *string  `json:"description"`
	Price       *float64 `json:"price" binding:"omitempty,gt=0"`
	Stock       *int     `json:"stock" binding:"omitempty,gte=0"`
	CategoryID  *uint    `json:"category_id"`
}

// @Summary Update a product
// @Description Partially updates a product's fields by its ID
// @Accept json
// @Produce json
// @Param id path string true "Product ID"
// @Param product body UpdateProductRequest true "Updated fields"
// @Success 200 {object} domain.Product
// @Router /products/{id} [put]
func (h *Handler) UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var req UpdateProductRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	product, err := h.service.UpdateProduct(id, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, product)
}

// @Summary Delete a product
// @Description Soft deletes a product from the database
// @Produce json
// @Param id path string true "Product ID"
// @Success 200 {object} map[string]string "Success message"
// @Router /products/{id} [delete]
func (h *Handler) DeleteProduct(c *gin.Context) {
	id := c.Param("id")

	if err := h.service.DeleteProduct(id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}
