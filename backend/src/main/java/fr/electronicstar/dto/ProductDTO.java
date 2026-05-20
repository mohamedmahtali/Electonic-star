package fr.electronicstar.dto;

import fr.electronicstar.model.Product;

import java.util.List;
import java.util.UUID;

public record ProductDTO(
    UUID id,
    String slug,
    String name,
    String status,
    String ean,
    String mpn,
    String asin,
    BrandDTO brand,
    CategoryDTO category,
    ProductDescriptionDTO description,
    List<String> images,
    List<PriceDTO> prices,
    List<String> tags
) {
    public static ProductDTO from(Product product) {
        return new ProductDTO(
            product.getId(),
            product.getSlug(),
            product.getName(),
            product.getStatus(),
            product.getEan(),
            product.getMpn(),
            product.getAsin(),
            product.getBrand() != null ? BrandDTO.from(product.getBrand()) : null,
            product.getCategory() != null ? CategoryDTO.fromFlat(product.getCategory()) : null,
            product.getDescription() != null ? ProductDescriptionDTO.from(product.getDescription()) : null,
            product.getImages() == null ? List.of() :
                product.getImages().stream().map(img -> img.getUrl()).toList(),
            product.getPrices() == null ? List.of() :
                product.getPrices().stream().map(PriceDTO::from).toList(),
            product.getTags() == null ? List.of() :
                product.getTags().stream().map(t -> t.getSlug()).toList()
        );
    }
}
