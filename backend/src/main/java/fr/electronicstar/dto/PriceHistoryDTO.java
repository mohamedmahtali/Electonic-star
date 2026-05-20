package fr.electronicstar.dto;

import fr.electronicstar.model.PriceHistory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PriceHistoryDTO(
    String store,
    BigDecimal price,
    Boolean inStock,
    LocalDateTime recordedAt
) {
    public static PriceHistoryDTO from(PriceHistory ph) {
        return new PriceHistoryDTO(
            ph.getStore(),
            ph.getPrice(),
            ph.getInStock(),
            ph.getRecordedAt()
        );
    }
}
