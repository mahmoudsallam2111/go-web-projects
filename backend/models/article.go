package models

import (
	"time"

	"codecrafted/portfolio/config"

	"github.com/lib/pq"
)

type Article struct {
	ID          int            `json:"id"`
	Title       string         `json:"title"`
	Content     string         `json:"content"`
	Excerpt     string         `json:"excerpt"`
	Tags        pq.StringArray `json:"tags"`
	PublishDate time.Time      `json:"publish_date"`
	ReadTime    int            `json:"read_time"`
}

type ArticleInput struct {
	Title    string   `json:"title" binding:"required"`
	Content  string   `json:"content" binding:"required"`
	Excerpt  string   `json:"excerpt"`
	Tags     []string `json:"tags"`
	ReadTime int      `json:"read_time"`
}

func GetAllArticles() ([]Article, error) {
	rows, err := config.DB.Query(
		`SELECT id, title, content, excerpt, tags, publish_date, read_time 
		 FROM articles ORDER BY publish_date DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var articles []Article
	for rows.Next() {
		var a Article
		err := rows.Scan(&a.ID, &a.Title, &a.Content, &a.Excerpt, &a.Tags, &a.PublishDate, &a.ReadTime)
		if err != nil {
			return nil, err
		}
		articles = append(articles, a)
	}

	if articles == nil {
		articles = []Article{}
	}

	return articles, nil
}

func GetArticleByID(id int) (*Article, error) {
	var a Article
	err := config.DB.QueryRow(
		`SELECT id, title, content, excerpt, tags, publish_date, read_time 
		 FROM articles WHERE id = $1`, id).
		Scan(&a.ID, &a.Title, &a.Content, &a.Excerpt, &a.Tags, &a.PublishDate, &a.ReadTime)
	if err != nil {
		return nil, err
	}
	return &a, nil
}

func CreateArticle(input ArticleInput) (*Article, error) {
	var a Article
	readTime := input.ReadTime
	if readTime == 0 {
		readTime = 5
	}
	tags := input.Tags
	if tags == nil {
		tags = []string{}
	}

	err := config.DB.QueryRow(
		`INSERT INTO articles (title, content, excerpt, tags, read_time, publish_date) 
		 VALUES ($1, $2, $3, $4, $5, NOW()) 
		 RETURNING id, title, content, excerpt, tags, publish_date, read_time`,
		input.Title, input.Content, input.Excerpt, pq.Array(tags), readTime).
		Scan(&a.ID, &a.Title, &a.Content, &a.Excerpt, &a.Tags, &a.PublishDate, &a.ReadTime)
	if err != nil {
		return nil, err
	}
	return &a, nil
}

func UpdateArticle(id int, input ArticleInput) (*Article, error) {
	var a Article
	readTime := input.ReadTime
	if readTime == 0 {
		readTime = 5
	}
	tags := input.Tags
	if tags == nil {
		tags = []string{}
	}

	err := config.DB.QueryRow(
		`UPDATE articles SET title=$1, content=$2, excerpt=$3, tags=$4, read_time=$5 
		 WHERE id=$6 
		 RETURNING id, title, content, excerpt, tags, publish_date, read_time`,
		input.Title, input.Content, input.Excerpt, pq.Array(tags), readTime, id).
		Scan(&a.ID, &a.Title, &a.Content, &a.Excerpt, &a.Tags, &a.PublishDate, &a.ReadTime)
	if err != nil {
		return nil, err
	}
	return &a, nil
}

func DeleteArticle(id int) error {
	result, err := config.DB.Exec("DELETE FROM articles WHERE id = $1", id)
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
