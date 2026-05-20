package fr.electronicstar.service;

import fr.electronicstar.dto.ProductDTO;
import fr.electronicstar.dto.ProductSummaryDTO;
import fr.electronicstar.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    @Cacheable(value = "products", key = "#slug")
    public ProductDTO getBySlug(String slug) {
        return productRepository.findBySlug(slug)
            .map(ProductDTO::from)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produit introuvable : " + slug));
    }

    public Page<ProductSummaryDTO> getByCategory(String categorySlug, Pageable pageable) {
        return productRepository
            .findByCategorySlugAndStatus(categorySlug, "active", pageable)
            .map(ProductSummaryDTO::from);
    }

    public Page<ProductSummaryDTO> search(String query, Pageable pageable) {
        return productRepository
            .searchByNameOrBrand(query, pageable)
            .map(ProductSummaryDTO::from);
    }
}
