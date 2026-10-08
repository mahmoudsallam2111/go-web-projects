package category

import "product-api/internal/domain"

type Service interface {
	CreateCategory(req *CreateCategoryRequest) (*domain.Category, error)
	GetAllCategories() ([]domain.Category, error)
	GetCategoryByID(id string) (domain.Category, error)
	UpdateCategory(id string, req *UpdateCategoryRequest) (*domain.Category, error)
	DeleteCategory(id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateCategory(req *CreateCategoryRequest) (*domain.Category, error) {
	category := &domain.Category{Name: req.Name}
	if err := s.repo.Create(category); err != nil {
		return nil, err
	}
	return category, nil
}

func (s *service) GetAllCategories() ([]domain.Category, error) {
	return s.repo.GetAll()
}

func (s *service) GetCategoryByID(id string) (domain.Category, error) {
	return s.repo.GetByID(id)
}

func (s *service) UpdateCategory(id string, req *UpdateCategoryRequest) (*domain.Category, error) {
	category, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	if req.Name != nil {
		category.Name = *req.Name
	}
	if err := s.repo.Update(&category); err != nil {
		return nil, err
	}
	return &category, nil
}

func (s *service) DeleteCategory(id string) error {
	category, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	return s.repo.Delete(&category)
}
