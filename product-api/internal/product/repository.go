package product

import (
	"product-api/internal/domain"

	"gorm.io/gorm"
)

type Repository interface {
	Create(product *domain.Product) error
	GetAll() ([]domain.Product, error)
	GetByID(id string) (domain.Product, error)
	Update(product *domain.Product) error
	Delete(product *domain.Product) error
}

type repository struct {
	db *gorm.DB
}

// 3. The Constructor (This is how we do Dependency Injection in Go)
func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

// 4. Implementations (Attaching functions to the struct)
func (r *repository) Create(product *domain.Product) error {
	return r.db.Create(product).Error
}

func (r *repository) GetAll() ([]domain.Product, error) {
	var products []domain.Product
	err := r.db.Preload("Category").Find(&products).Error
	return products, err
}

func (r *repository) GetByID(id string) (domain.Product, error) {
	var product domain.Product
	err := r.db.Preload("Category").First(&product, id).Error
	return product, err
}

func (r *repository) Update(product *domain.Product) error {
	return r.db.Save(product).Error
}

func (r *repository) Delete(product *domain.Product) error {
	return r.db.Delete(product).Error
}
