package fr.electronicstar.dto;

import fr.electronicstar.model.Price;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PriceDTO(
    UUID id,
    String store,
    BigDecimal price,
    BigDecimal originalPrice,
    String currency,
    String affiliateUrl,
    Boolean inStock,
    LocalDateTime lastCheckedAt
) {
    public static PriceDTO from(Price price) {
        return new PriceDTO(
            price.getId(),
            price.getStore(),
            price.getPrice(),
            price.getOriginalPrice(),
            price.getCurrency(),
            price.getAffiliateUrl(),
            price.getInStock(),
            price.getLastCheckedAt()
        );
    }
}
