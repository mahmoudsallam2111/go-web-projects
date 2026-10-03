package handlers

import (
	"net/http"
	"strconv"

	"codecrafted/portfolio/models"

	"github.com/gin-gonic/gin"
)

func GetSnippets(c *gin.Context) {
	snippets, err := models.GetAllSnippets()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch snippets"})
		return
	}
	c.JSON(http.StatusOK, snippets)
}

func GetSnippet(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid snippet ID"})
		return
	}

	snippet, err := models.GetSnippetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Snippet not found"})
		return
	}
	c.JSON(http.StatusOK, snippet)
}

func CreateSnippet(c *gin.Context) {
	var input models.SnippetInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	snippet, err := models.CreateSnippet(input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create snippet"})
		return
	}
	c.JSON(http.StatusCreated, snippet)
}

func UpdateSnippet(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid snippet ID"})
		return
	}

	var input models.SnippetInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	snippet, err := models.UpdateSnippet(id, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update snippet"})
		return
	}
	c.JSON(http.StatusOK, snippet)
}

func DeleteSnippet(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid snippet ID"})
		return
	}

	if err := models.DeleteSnippet(id); err != nil {
		if err == models.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Snippet not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete snippet"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Snippet deleted successfully"})
}
