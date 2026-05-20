package fr.electronicstar.service;

import fr.electronicstar.dto.PriceDTO;
import fr.electronicstar.dto.PriceHistoryDTO;
import fr.electronicstar.repository.PriceHistoryRepository;
import fr.electronicstar.repository.PriceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PriceService {

    private final PriceRepository priceRepository;
    private final PriceHistoryRepository priceHistoryRepository;

    public List<PriceDTO> getPricesForProduct(UUID productId) {
        return priceRepository.findByProductIdOrderByPriceAsc(productId)
            .stream()
            .map(PriceDTO::from)
            .toList();
    }

    public List<PriceHistoryDTO> getPriceHistory(UUID productId, int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        return priceHistoryRepository.findByProductIdSince(productId, since)
            .stream()
            .map(PriceHistoryDTO::from)
            .toList();
    }
}
