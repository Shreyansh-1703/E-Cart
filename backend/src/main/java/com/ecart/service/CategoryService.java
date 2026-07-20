package com.ecart.service;

import com.ecart.entity.Category;
import com.ecart.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllActive() {
        return categoryRepository.findByActiveTrue();
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Transactional
    public Category create(Category category) {
        if (category == null) {
            throw new IllegalArgumentException("Category cannot be null");
        }
        return categoryRepository.save(category);
    }

    @Transactional
    public Category update(Long id, Category updated) {
        if (id == null || updated == null) {
            throw new IllegalArgumentException("ID and updated Category are required");
        }
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found: " + id));
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setIcon(updated.getIcon());
        existing.setActive(updated.isActive());
        return categoryRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        }
        categoryRepository.deleteById(id);
    }
}
