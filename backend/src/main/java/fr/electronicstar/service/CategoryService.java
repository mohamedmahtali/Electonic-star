package fr.electronicstar.service;

import fr.electronicstar.dto.CategoryDTO;
import fr.electronicstar.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Cacheable("categories")
    public List<CategoryDTO> getAllWithChildren() {
        return categoryRepository.findAllRootWithChildren()
            .stream()
            .map(CategoryDTO::from)
            .toList();
    }

    @Cacheable(value = "category", key = "#slug")
    public CategoryDTO getBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
            .map(CategoryDTO::from)
            .orElseThrow(() -> new RuntimeException("Catégorie introuvable : " + slug));
    }
}
