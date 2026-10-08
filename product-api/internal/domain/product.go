package domain

import "gorm.io/gorm"

type Product struct {
	gorm.Model
	Name        string  `gorm:"type:varchar(100);not null" json:"name"`
	Description string  `gorm:"type:text" json:"description"`
	Price       float64 `gorm:"not null" json:"price"`
	Stock       int     `gorm:"not null;default:0" json:"stock"`

	CategoryID *uint     `json:"category_id"`
	Category   *Category `json:"category,omitempty"`
}
