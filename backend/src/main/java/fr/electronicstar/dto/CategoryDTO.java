package fr.electronicstar.dto;

import fr.electronicstar.model.Category;

import java.util.List;
import java.util.UUID;

public record CategoryDTO(
    UUID id,
    String slug,
    String name,
    String icon,
    String description,
    Integer level,
    Integer position,
    List<CategoryDTO> children
) {
    public static CategoryDTO from(Category category) {
        return new CategoryDTO(
            category.getId(),
            category.getSlug(),
            category.getName(),
            category.getIcon(),
            category.getDescription(),
            category.getLevel(),
            category.getPosition(),
            category.getChildren() == null ? List.of() :
                category.getChildren().stream().map(CategoryDTO::from).toList()
        );
    }

    public static CategoryDTO fromFlat(Category category) {
        return new CategoryDTO(
            category.getId(),
            category.getSlug(),
            category.getName(),
            category.getIcon(),
            category.getDescription(),
            category.getLevel(),
            category.getPosition(),
            List.of()
        );
    }
}
