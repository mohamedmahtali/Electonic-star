package fr.electronicstar.dto;

import fr.electronicstar.model.Product;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductSummaryDTO(
    UUID id,
    String slug,
    String name,
    String brandName,
    String categorySlug,
    String shortDescription,
    String primaryImage,
    BigDecimal bestPrice,
    String bestPriceStore,
    Boolean inStock
) {
    public static ProductSummaryDTO from(Product product) {
        var bestPrice = product.getPrices() == null ? null :
            product.getPrices().stream()
                .filter(p -> Boolean.TRUE.equals(p.getInStock()))
                .min((a, b) -> a.getPrice().compareTo(b.getPrice()))
                .orElse(null);

        var primaryImage = product.getImages() == null ? null :
            product.getImages().stream()
                .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                .findFirst()
                .map(img -> img.getUrl())
                .orElse(product.getImages().isEmpty() ? null : product.getImages().get(0).getUrl());

        return new ProductSummaryDTO(
            product.getId(),
            product.getSlug(),
            product.getName(),
            product.getBrand() != null ? product.getBrand().getName() : null,
            product.getCategory() != null ? product.getCategory().getSlug() : null,
            product.getDescription() != null ? product.getDescription().getShortDescription() : null,
            primaryImage,
            bestPrice != null ? bestPrice.getPrice() : null,
            bestPrice != null ? bestPrice.getStore() : null,
            bestPrice != null
        );
    }
}
