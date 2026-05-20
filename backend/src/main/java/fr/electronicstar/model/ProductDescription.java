package fr.electronicstar.model;

import io.hypersistence.utils.hibernate.type.array.ListArrayType;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "product_descriptions")
@Getter
@Setter
public class ProductDescription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(nullable = false)
    private String productType;

    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String longDescription;

    @Column(columnDefinition = "TEXT")
    private String technicalSummary;

    @Type(ListArrayType.class)
    @Column(columnDefinition = "text[]")
    private List<String> keyFeatures;

    @Type(ListArrayType.class)
    @Column(columnDefinition = "text[]")
    private List<String> inTheBox;

    @Type(ListArrayType.class)
    @Column(columnDefinition = "text[]")
    private List<String> useCases;

    @Type(ListArrayType.class)
    @Column(columnDefinition = "text[]")
    private List<String> awards;

    private String targetAudience;
    private LocalDate releaseDate;
    private LocalDate endOfLife;
    private String manufacturerUrl;

    /**
     * Champs spécifiques au type de produit (GPU, SSD, CPU, RAM, etc.)
     * Structure variable selon productType — voir la doc de l'API pour les schémas.
     */
    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> typeDetails;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
