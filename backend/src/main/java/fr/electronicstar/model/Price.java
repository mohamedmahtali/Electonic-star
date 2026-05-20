package fr.electronicstar.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "prices",
    uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "store"})
)
@Getter
@Setter
public class Price {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private String store;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(length = 3)
    private String currency = "EUR";

    @Column(columnDefinition = "TEXT")
    private String affiliateUrl;

    private Boolean inStock = false;

    private LocalDateTime lastCheckedAt;
}
