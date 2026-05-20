package fr.electronicstar.service;

import fr.electronicstar.dto.CompareResponseDTO;
import fr.electronicstar.dto.ProductDTO;
import fr.electronicstar.model.Product;
import fr.electronicstar.model.ProductDescription;
import fr.electronicstar.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompareService {

    private final ProductRepository productRepository;

    public CompareResponseDTO compare(List<UUID> ids) {
        if (ids == null || ids.size() < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Au moins 2 produits requis pour comparer");
        }

        List<Product> products = productRepository.findAllByIdIn(ids);

        if (products.size() != ids.size()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Un ou plusieurs produits introuvables");
        }

        List<ProductDTO> productDTOs = products.stream().map(ProductDTO::from).toList();
        CompareResponseDTO.ComparisonDTO comparison = buildComparison(products);

        return new CompareResponseDTO(productDTOs, comparison);
    }

    private CompareResponseDTO.ComparisonDTO buildComparison(List<Product> products) {
        List<CompareResponseDTO.SpecComparisonDTO> specs = new ArrayList<>();
        Map<UUID, Integer> scoreMap = new HashMap<>();

        products.forEach(p -> scoreMap.put(p.getId(), 0));

        Set<String> allKeys = new LinkedHashSet<>();
        products.forEach(p -> {
            ProductDescription desc = p.getDescription();
            if (desc != null && desc.getTypeDetails() != null) {
                allKeys.addAll(desc.getTypeDetails().keySet());
            }
        });

        for (String key : allKeys) {
            Map<UUID, Object> values = new LinkedHashMap<>();
            for (Product p : products) {
                ProductDescription desc = p.getDescription();
                if (desc != null && desc.getTypeDetails() != null) {
                    Object val = desc.getTypeDetails().get(key);
                    if (val != null) values.put(p.getId(), val);
                }
            }
            if (values.isEmpty()) continue;

            String winner = determineWinner(key, values, products, scoreMap);
            specs.add(new CompareResponseDTO.SpecComparisonDTO(
                formatKey(key), detectUnit(key), values, winner
            ));
        }

        specs.add(buildPriceComparison(products, scoreMap));

        String winnerOverall = scoreMap.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(e -> e.getKey().toString())
            .orElse("draw");

        return new CompareResponseDTO.ComparisonDTO(winnerOverall, specs);
    }

    private String determineWinner(String key, Map<UUID, Object> values, List<Product> products, Map<UUID, Integer> scoreMap) {
        boolean higherIsBetter = !key.contains("tdp") && !key.contains("noise") && !key.contains("weight");

        UUID best = null;
        double bestVal = higherIsBetter ? Double.MIN_VALUE : Double.MAX_VALUE;
        boolean isDraw = false;

        for (Map.Entry<UUID, Object> entry : values.entrySet()) {
            double val = toDouble(entry.getValue());
            if (higherIsBetter ? val > bestVal : val < bestVal) {
                bestVal = val;
                best = entry.getKey();
                isDraw = false;
            } else if (val == bestVal && best != null) {
                isDraw = true;
            }
        }

        if (isDraw) return "draw";
        if (best != null) scoreMap.merge(best, 1, Integer::sum);
        return best != null ? best.toString() : "draw";
    }

    private CompareResponseDTO.SpecComparisonDTO buildPriceComparison(List<Product> products, Map<UUID, Integer> scoreMap) {
        Map<UUID, Object> priceValues = new LinkedHashMap<>();
        UUID cheapest = null;
        BigDecimal lowestPrice = null;

        for (Product p : products) {
            if (p.getPrices() != null) {
                p.getPrices().stream()
                    .filter(pr -> Boolean.TRUE.equals(pr.getInStock()))
                    .min(Comparator.comparing(pr -> pr.getPrice()))
                    .ifPresent(pr -> {
                        priceValues.put(p.getId(), pr.getPrice());
                    });
            }
        }

        for (Map.Entry<UUID, Object> e : priceValues.entrySet()) {
            BigDecimal val = (BigDecimal) e.getValue();
            if (lowestPrice == null || val.compareTo(lowestPrice) < 0) {
                lowestPrice = val;
                cheapest = e.getKey();
            }
        }

        if (cheapest != null) scoreMap.merge(cheapest, 1, Integer::sum);

        return new CompareResponseDTO.SpecComparisonDTO(
            "Prix", "€", priceValues, cheapest != null ? cheapest.toString() : "draw"
        );
    }

    private double toDouble(Object val) {
        if (val instanceof Number n) return n.doubleValue();
        try { return Double.parseDouble(val.toString()); } catch (Exception e) { return 0; }
    }

    private String formatKey(String key) {
        return key.replace("_", " ").substring(0, 1).toUpperCase() + key.replace("_", " ").substring(1);
    }

    private String detectUnit(String key) {
        if (key.contains("_ghz") || key.equals("base_freq_ghz") || key.equals("boost_freq_ghz")) return "GHz";
        if (key.contains("_w") || key.equals("tdp_w")) return "W";
        if (key.contains("_gb") || key.equals("capacity_gb") || key.equals("cache_mb")) return "Go";
        if (key.contains("_mm")) return "mm";
        if (key.contains("_mbs")) return "Mo/s";
        if (key.contains("_mhz")) return "MHz";
        return "";
    }
}
