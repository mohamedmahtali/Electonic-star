package fr.electronicstar.controller;

import fr.electronicstar.dto.CategoryDTO;
import fr.electronicstar.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000"})
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryDTO> getAllCategories() {
        return categoryService.getAllWithChildren();
    }

    @GetMapping("/{slug}")
    public CategoryDTO getCategory(@PathVariable String slug) {
        return categoryService.getBySlug(slug);
    }
}
