package category

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type Handler struct {
	service Service
}

func NewHandler(s Service) *Handler {
	return &Handler{service: s}
}

type CreateCategoryRequest struct {
	Name string `json:"name" binding:"required"`
}

// @Summary Create a new category
// @Description Adds a new category to the database
// @Accept json
// @Produce json
// @Param category body CreateCategoryRequest true "Category information"
// @Success 201 {object} domain.Category
// @Router /categories [post]
func (h *Handler) CreateCategory(c *gin.Context) {
	var req CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	category, err := h.service.CreateCategory(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, category)
}

// @Summary Get all categories
// @Description Fetches all categories and preloads their products
// @Produce json
// @Success 200 {array} domain.Category
// @Router /categories [get]
func (h *Handler) GetCategories(c *gin.Context) {
	categories, err := h.service.GetAllCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, categories)
}

// @Summary Get a category by ID
// @Description Fetches a single category by its ID
// @Produce json
// @Param id path string true "Category ID"
// @Success 200 {object} domain.Category
// @Router /categories/{id} [get]
func (h *Handler) GetCategoryByID(c *gin.Context) {
	id := c.Param("id")
	category, err := h.service.GetCategoryByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}
	c.JSON(http.StatusOK, category)
}

type UpdateCategoryRequest struct {
	Name *string `json:"name"`
}

// @Summary Update a category
// @Description Updates a category's name
// @Accept json
// @Produce json
// @Param id path string true "Category ID"
// @Param category body UpdateCategoryRequest true "Updated fields"
// @Success 200 {object} domain.Category
// @Router /categories/{id} [put]
func (h *Handler) UpdateCategory(c *gin.Context) {
	id := c.Param("id")
	var req UpdateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	category, err := h.service.UpdateCategory(id, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, category)
}

// @Summary Delete a category
// @Description Soft deletes a category from the database
// @Produce json
// @Param id path string true "Category ID"
// @Success 200 {object} map[string]string "Success message"
// @Router /categories/{id} [delete]
func (h *Handler) DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	if err := h.service.DeleteCategory(id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Category deleted successfully"})
}
