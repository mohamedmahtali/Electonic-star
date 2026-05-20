package fr.electronicstar.controller;

import fr.electronicstar.dto.CompareResponseDTO;
import fr.electronicstar.service.CompareService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/compare")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000"})
public class CompareController {

    private final CompareService compareService;

    @GetMapping
    public CompareResponseDTO compare(@RequestParam String ids) {
        List<UUID> productIds = Arrays.stream(ids.split(","))
            .map(String::trim)
            .map(UUID::fromString)
            .toList();
        return compareService.compare(productIds);
    }
}
