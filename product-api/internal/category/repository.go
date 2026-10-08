package category

import (
	"gorm.io/gorm"
	"product-api/internal/domain"
)

type Repository interface {
	Create(category *domain.Category) error
	GetAll() ([]domain.Category, error)
	GetByID(id string) (domain.Category, error)
	Update(category *domain.Category) error
	Delete(category *domain.Category) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(category *domain.Category) error {
	return r.db.Create(category).Error
}

func (r *repository) GetAll() ([]domain.Category, error) {
	var categories []domain.Category
	err := r.db.Preload("Products").Find(&categories).Error
	return categories, err
}

func (r *repository) GetByID(id string) (domain.Category, error) {
	var category domain.Category
	err := r.db.Preload("Products").First(&category, id).Error
	return category, err
}

func (r *repository) Update(category *domain.Category) error {
	return r.db.Save(category).Error
}

func (r *repository) Delete(category *domain.Category) error {
	return r.db.Delete(category).Error
}
