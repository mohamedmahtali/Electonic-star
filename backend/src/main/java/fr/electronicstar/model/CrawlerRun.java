package fr.electronicstar.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "crawler_runs")
@Getter
@Setter
public class CrawlerRun {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String store;

    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;
    private Integer productsChecked = 0;
    private Integer productsUpdated = 0;
    private Integer errors = 0;

    @Column(nullable = false)
    private String status = "running";
}
