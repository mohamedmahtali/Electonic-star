package fr.electronicstar.controller;

import fr.electronicstar.dto.ProductDTO;
import fr.electronicstar.dto.ProductSummaryDTO;
import fr.electronicstar.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000"})
public class ProductController {

    private final ProductService productService;

    @GetMapping("/{slug}")
    public ProductDTO getProduct(@PathVariable String slug) {
        return productService.getBySlug(slug);
    }

    @GetMapping
    public Page<ProductSummaryDTO> listByCategory(
        @RequestParam String category,
        @PageableDefault(size = 24) Pageable pageable
    ) {
        return productService.getByCategory(category, pageable);
    }
}
