package fr.electronicstar.dto;

import fr.electronicstar.model.Brand;

import java.util.UUID;

public record BrandDTO(
    UUID id,
    String name,
    String slug,
    String logoUrl,
    String country,
    String websiteUrl
) {
    public static BrandDTO from(Brand brand) {
        return new BrandDTO(
            brand.getId(),
            brand.getName(),
            brand.getSlug(),
            brand.getLogoUrl(),
            brand.getCountry(),
            brand.getWebsiteUrl()
        );
    }
}
