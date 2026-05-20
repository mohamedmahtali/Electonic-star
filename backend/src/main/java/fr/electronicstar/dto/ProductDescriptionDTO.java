package fr.electronicstar.dto;

import fr.electronicstar.model.ProductDescription;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record ProductDescriptionDTO(
    String productType,
    String shortDescription,
    String longDescription,
    String technicalSummary,
    List<String> keyFeatures,
    List<String> useCases,
    List<String> inTheBox,
    List<String> awards,
    String targetAudience,
    LocalDate releaseDate,
    LocalDate endOfLife,
    String manufacturerUrl,
    Map<String, Object> typeDetails
) {
    public static ProductDescriptionDTO from(ProductDescription desc) {
        if (desc == null) return null;
        return new ProductDescriptionDTO(
            desc.getProductType(),
            desc.getShortDescription(),
            desc.getLongDescription(),
            desc.getTechnicalSummary(),
            desc.getKeyFeatures(),
            desc.getUseCases(),
            desc.getInTheBox(),
            desc.getAwards(),
            desc.getTargetAudience(),
            desc.getReleaseDate(),
            desc.getEndOfLife(),
            desc.getManufacturerUrl(),
            desc.getTypeDetails()
        );
    }
}
