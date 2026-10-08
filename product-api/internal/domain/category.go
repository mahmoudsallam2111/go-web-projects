package domain

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	Name     string    `gorm:"type:varchar(100);not null" json:"name"`
	Products []Product `json:"products,omitempty"`
}
