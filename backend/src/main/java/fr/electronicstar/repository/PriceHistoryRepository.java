package fr.electronicstar.repository;

import fr.electronicstar.model.PriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, UUID> {

    List<PriceHistory> findByProductIdAndStoreOrderByRecordedAtAsc(UUID productId, String store);

    @Query("""
        SELECT ph FROM PriceHistory ph
        WHERE ph.product.id = :productId
        AND ph.recordedAt >= :since
        ORDER BY ph.recordedAt ASC
        """)
    List<PriceHistory> findByProductIdSince(@Param("productId") UUID productId, @Param("since") LocalDateTime since);
}
