package fr.electronicstar.crawler;

import fr.electronicstar.model.Product;
import fr.electronicstar.repository.CrawlerRunRepository;
import fr.electronicstar.repository.PriceHistoryRepository;
import fr.electronicstar.repository.PriceRepository;
import fr.electronicstar.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Utilise Amazon Product Advertising API (PA-API 5.0).
 * Nécessite un compte affilié Amazon avec accès à la PA-API.
 * Docs: https://webservices.amazon.com/paapi5/documentation/
 */
@Slf4j
@Component
public class AmazonCrawler extends BaseCrawler {

    @Value("${crawler.amazon.access-key:}")
    private String accessKey;

    @Value("${crawler.amazon.secret-key:}")
    private String secretKey;

    @Value("${crawler.amazon.partner-tag:}")
    private String partnerTag;

    private final RestTemplate restTemplate = new RestTemplate();

    public AmazonCrawler(
        ProductRepository productRepository,
        PriceRepository priceRepository,
        PriceHistoryRepository priceHistoryRepository,
        CrawlerRunRepository crawlerRunRepository
    ) {
        super(productRepository, priceRepository, priceHistoryRepository, crawlerRunRepository);
    }

    @Override
    protected String getStoreName() {
        return "amazon";
    }

    @Override
    protected void crawlProduct(Product product) throws Exception {
        if (product.getAsin() == null || accessKey.isBlank()) {
            log.debug("[Amazon] ASIN manquant ou clé API non configurée pour {}", product.getSlug());
            return;
        }

        // PA-API 5.0 — GetItems endpoint
        // En production: signer la requête avec AWS Signature V4
        // Pour l'instant, stub avec les données de l'ASIN
        log.info("[Amazon] Crawl ASIN {} pour {}", product.getAsin(), product.getSlug());

        // Exemple de réponse simulée — remplacer par appel PA-API réel
        BigDecimal price = fetchAmazonPrice(product.getAsin());
        if (price == null) return;

        String affiliateUrl = "https://www.amazon.fr/dp/" + product.getAsin() + "?tag=" + partnerTag;
        savePrice(product, price, affiliateUrl, true);
    }

    private BigDecimal fetchAmazonPrice(String asin) {
        // TODO: implémenter la signature AWS V4 et l'appel PA-API
        // Endpoint: https://webservices.amazon.fr/paapi5/getitems
        // Body: {"ItemIds": [asin], "Resources": ["Offers.Listings.Price"]}
        return null;
    }
}
