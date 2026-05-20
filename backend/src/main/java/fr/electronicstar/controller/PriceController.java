package fr.electronicstar.controller;

import fr.electronicstar.dto.PriceDTO;
import fr.electronicstar.dto.PriceHistoryDTO;
import fr.electronicstar.service.PriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products/{productId}")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000"})
public class PriceController {

    private final PriceService priceService;

    @GetMapping("/prices")
    public List<PriceDTO> getPrices(@PathVariable UUID productId) {
        return priceService.getPricesForProduct(productId);
    }

    @GetMapping("/prices/history")
    public List<PriceHistoryDTO> getPriceHistory(
        @PathVariable UUID productId,
        @RequestParam(defaultValue = "30") int days
    ) {
        return priceService.getPriceHistory(productId, days);
    }
}
