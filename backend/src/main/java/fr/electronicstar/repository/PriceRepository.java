package fr.electronicstar.repository;

import fr.electronicstar.model.Price;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PriceRepository extends JpaRepository<Price, UUID> {

    List<Price> findByProductIdOrderByPriceAsc(UUID productId);

    Optional<Price> findByProductIdAndStore(UUID productId, String store);

    @Query("SELECT p FROM Price p WHERE p.product.id = :productId AND p.inStock = true ORDER BY p.price ASC")
    List<Price> findBestPricesForProduct(@Param("productId") UUID productId);

    @Query("SELECT p FROM Price p WHERE p.product.id IN :productIds ORDER BY p.price ASC")
    List<Price> findAllByProductIds(@Param("productIds") List<UUID> productIds);
}
