package fr.electronicstar.repository;

import fr.electronicstar.model.CrawlerRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CrawlerRunRepository extends JpaRepository<CrawlerRun, UUID> {
    List<CrawlerRun> findTop10ByStoreOrderByStartedAtDesc(String store);
}
