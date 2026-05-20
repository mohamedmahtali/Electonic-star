package fr.electronicstar.repository;

import fr.electronicstar.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    Optional<Product> findBySlug(String slug);

    Page<Product> findByCategorySlugAndStatus(String categorySlug, String status, Pageable pageable);

    Page<Product> findByBrandSlugAndStatus(String brandSlug, String status, Pageable pageable);

    @Query("""
        SELECT p FROM Product p
        WHERE p.status = 'active'
        AND (
            LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(p.brand.name) LIKE LOWER(CONCAT('%', :query, '%'))
        )
        """)
    Page<Product> searchByNameOrBrand(@Param("query") String query, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.id IN :ids AND p.status = 'active'")
    List<Product> findAllByIdIn(@Param("ids") List<UUID> ids);

    List<Product> findTop8ByCategorySlugAndStatusOrderByCreatedAtDesc(String categorySlug, String status);
}
