package models

import (
	"errors"
	"log"

	"codecrafted/portfolio/config"

	"golang.org/x/crypto/bcrypt"
)

var ErrNotFound = errors.New("record not found")

type User struct {
	ID           int    `json:"id"`
	Username     string `json:"username"`
	PasswordHash string `json:"-"`
}

type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func FindUserByUsername(username string) (*User, error) {
	var u User
	err := config.DB.QueryRow(
		"SELECT id, username, password_hash FROM admin_users WHERE username = $1",
		username).Scan(&u.ID, &u.Username, &u.PasswordHash)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
	return err == nil
}

func CreateDefaultAdmin() {
	var count int
	err := config.DB.QueryRow("SELECT COUNT(*) FROM admin_users").Scan(&count)
	if err != nil {
		log.Printf("Failed to check admin users: %v", err)
		return
	}

	if count > 0 {
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Failed to hash password: %v", err)
		return
	}

	_, err = config.DB.Exec(
		"INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)",
		"admin", string(hash))
	if err != nil {
		log.Printf("Failed to create default admin: %v", err)
		return
	}

	log.Println("Default admin user created (admin/admin123)")
}
