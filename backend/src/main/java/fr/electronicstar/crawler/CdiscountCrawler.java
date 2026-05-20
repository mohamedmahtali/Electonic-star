package fr.electronicstar.crawler;

import fr.electronicstar.model.Product;
import fr.electronicstar.repository.CrawlerRunRepository;
import fr.electronicstar.repository.PriceHistoryRepository;
import fr.electronicstar.repository.PriceRepository;
import fr.electronicstar.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Utilise l'API partenaire Cdiscount (programme affilié).
 * Docs: https://dev.cdiscount.com/
 */
@Slf4j
@Component
public class CdiscountCrawler extends BaseCrawler {

    @Value("${crawler.cdiscount.app-key:}")
    private String appKey;

    @Value("${crawler.cdiscount.login:}")
    private String login;

    @Value("${crawler.cdiscount.password:}")
    private String password;

    public CdiscountCrawler(
        ProductRepository productRepository,
        PriceRepository priceRepository,
        PriceHistoryRepository priceHistoryRepository,
        CrawlerRunRepository crawlerRunRepository
    ) {
        super(productRepository, priceRepository, priceHistoryRepository, crawlerRunRepository);
    }

    @Override
    protected String getStoreName() {
        return "cdiscount";
    }

    @Override
    protected void crawlProduct(Product product) throws Exception {
        if (product.getEan() == null || appKey.isBlank()) {
            log.debug("[Cdiscount] EAN manquant ou clé API non configurée pour {}", product.getSlug());
            return;
        }

        // API partenaire Cdiscount — recherche par EAN
        // Endpoint: https://api.cdiscount.com/catalog/v1/products?ean={ean}
        log.info("[Cdiscount] Crawl EAN {} pour {}", product.getEan(), product.getSlug());

        BigDecimal price = fetchCdiscountPrice(product.getEan());
        if (price == null) return;

        String affiliateUrl = buildAffiliateUrl(product.getEan());
        savePrice(product, price, affiliateUrl, true);
    }

    private BigDecimal fetchCdiscountPrice(String ean) {
        // TODO: implémenter l'appel API partenaire Cdiscount
        return null;
    }

    private String buildAffiliateUrl(String ean) {
        return "https://www.cdiscount.com/search/#f=" + ean;
    }
}
