package product

import "product-api/internal/domain"

type Service interface {
	CreateProduct(req *CreateProductRequest) (*domain.Product, error)
	GetAllProducts() ([]domain.Product, error)
	GetProductByID(id string) (domain.Product, error)
	UpdateProduct(id string, req *UpdateProductRequest) (*domain.Product, error)
	DeleteProduct(id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateProduct(req *CreateProductRequest) (*domain.Product, error) {
	// Map DTO to Entity
	product := domain.Product{
		Name:        req.Name,
		Description: req.Description,
		Price:       req.Price,
		Stock:       req.Stock,
		CategoryID:  req.CategoryID,
	}
	// Call the repository
	if err := s.repo.Create(&product); err != nil {
		return nil, err
	}
	return &product, nil
}

func (s *service) GetAllProducts() ([]domain.Product, error) {
	products, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}
	return products, nil
}

func (s *service) GetProductByID(id string) (domain.Product, error) {
	product, err := s.repo.GetByID(id)
	if err != nil {
		return domain.Product{}, err
	}
	return product, nil
}

func (s *service) UpdateProduct(id string, req *UpdateProductRequest) (*domain.Product, error) {
	// 1. Fetch existing product from DB
	product, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	// 2. Apply updates
	if req.Name != nil {
		product.Name = *req.Name
	}
	if req.Description != nil {
		product.Description = *req.Description
	}
	if req.Price != nil {
		product.Price = *req.Price
	}
	if req.Stock != nil {
		product.Stock = *req.Stock
	}
	if req.CategoryID != nil {
		product.CategoryID = req.CategoryID
	}
	// 3. Save to DB
	if err := s.repo.Update(&product); err != nil {
		return nil, err
	}
	return &product, nil
}

func (s *service) DeleteProduct(id string) error {
	product, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	return s.repo.Delete(&product)
}
