package fr.electronicstar.controller;

import fr.electronicstar.dto.ProductSummaryDTO;
import fr.electronicstar.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000"})
public class SearchController {

    private final ProductService productService;

    @GetMapping
    public Page<ProductSummaryDTO> search(
        @RequestParam String q,
        @PageableDefault(size = 24) Pageable pageable
    ) {
        return productService.search(q, pageable);
    }
}
