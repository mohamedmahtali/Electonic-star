package fr.electronicstar.dto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public record CompareResponseDTO(
    List<ProductDTO> products,
    ComparisonDTO comparison
) {
    public record ComparisonDTO(
        String winnerOverall,
        List<SpecComparisonDTO> specs
    ) {}

    public record SpecComparisonDTO(
        String key,
        String unit,
        Map<UUID, Object> values,
        String winner
    ) {}
}
