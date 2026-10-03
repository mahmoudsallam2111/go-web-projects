package models

import (
	"time"

	"codecrafted/portfolio/config"
)

type Snippet struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Code        string    `json:"code"`
	Language    string    `json:"language"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

type SnippetInput struct {
	Title       string `json:"title" binding:"required"`
	Code        string `json:"code" binding:"required"`
	Language    string `json:"language" binding:"required"`
	Description string `json:"description"`
}

func GetAllSnippets() ([]Snippet, error) {
	rows, err := config.DB.Query(
		`SELECT id, title, code, language, description, created_at 
		 FROM snippets ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var snippets []Snippet
	for rows.Next() {
		var s Snippet
		err := rows.Scan(&s.ID, &s.Title, &s.Code, &s.Language, &s.Description, &s.CreatedAt)
		if err != nil {
			return nil, err
		}
		snippets = append(snippets, s)
	}

	if snippets == nil {
		snippets = []Snippet{}
	}

	return snippets, nil
}

func GetSnippetByID(id int) (*Snippet, error) {
	var s Snippet
	err := config.DB.QueryRow(
		`SELECT id, title, code, language, description, created_at 
		 FROM snippets WHERE id = $1`, id).
		Scan(&s.ID, &s.Title, &s.Code, &s.Language, &s.Description, &s.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func CreateSnippet(input SnippetInput) (*Snippet, error) {
	var s Snippet
	err := config.DB.QueryRow(
		`INSERT INTO snippets (title, code, language, description, created_at) 
		 VALUES ($1, $2, $3, $4, NOW()) 
		 RETURNING id, title, code, language, description, created_at`,
		input.Title, input.Code, input.Language, input.Description).
		Scan(&s.ID, &s.Title, &s.Code, &s.Language, &s.Description, &s.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func UpdateSnippet(id int, input SnippetInput) (*Snippet, error) {
	var s Snippet
	err := config.DB.QueryRow(
		`UPDATE snippets SET title=$1, code=$2, language=$3, description=$4 
		 WHERE id=$5 
		 RETURNING id, title, code, language, description, created_at`,
		input.Title, input.Code, input.Language, input.Description, id).
		Scan(&s.ID, &s.Title, &s.Code, &s.Language, &s.Description, &s.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func DeleteSnippet(id int) error {
	result, err := config.DB.Exec("DELETE FROM snippets WHERE id = $1", id)
	if err != nil {
		return err
	}
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return ErrNotFound
	}
	return nil
}
