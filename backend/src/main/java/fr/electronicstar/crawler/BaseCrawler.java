package fr.electronicstar.crawler;

import fr.electronicstar.model.Price;
import fr.electronicstar.model.PriceHistory;
import fr.electronicstar.model.Product;
import fr.electronicstar.repository.CrawlerRunRepository;
import fr.electronicstar.repository.PriceHistoryRepository;
import fr.electronicstar.repository.PriceRepository;
import fr.electronicstar.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public abstract class BaseCrawler {

    protected final ProductRepository productRepository;
    protected final PriceRepository priceRepository;
    protected final PriceHistoryRepository priceHistoryRepository;
    protected final CrawlerRunRepository crawlerRunRepository;

    protected abstract String getStoreName();
    protected abstract void crawlProduct(Product product) throws Exception;

    public void crawlAll() {
        var run = new fr.electronicstar.model.CrawlerRun();
        run.setStore(getStoreName());
        run.setStartedAt(LocalDateTime.now());
        crawlerRunRepository.save(run);

        List<Product> products = productRepository.findAll();
        int updated = 0;
        int errors = 0;

        for (Product product : products) {
            try {
                Thread.sleep(3000 + (long)(Math.random() * 2000));
                crawlProduct(product);
                updated++;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            } catch (Exception e) {
                log.warn("[{}] Erreur sur {} : {}", getStoreName(), product.getSlug(), e.getMessage());
                errors++;
            }
        }

        run.setFinishedAt(LocalDateTime.now());
        run.setProductsChecked(products.size());
        run.setProductsUpdated(updated);
        run.setErrors(errors);
        run.setStatus(errors == 0 ? "success" : errors < products.size() ? "partial" : "failed");
        crawlerRunRepository.save(run);

        log.info("[{}] Terminé : {}/{} produits mis à jour, {} erreurs", getStoreName(), updated, products.size(), errors);
    }

    protected void savePrice(Product product, java.math.BigDecimal price, String affiliateUrl, boolean inStock) {
        var existingOpt = priceRepository.findByProductIdAndStore(product.getId(), getStoreName());

        Price priceEntity = existingOpt.orElseGet(() -> {
            var p = new Price();
            p.setProduct(product);
            p.setStore(getStoreName());
            p.setCurrency("EUR");
            return p;
        });

        priceEntity.setPrice(price);
        priceEntity.setAffiliateUrl(affiliateUrl);
        priceEntity.setInStock(inStock);
        priceEntity.setLastCheckedAt(LocalDateTime.now());
        priceRepository.save(priceEntity);

        var history = new PriceHistory();
        history.setProduct(product);
        history.setStore(getStoreName());
        history.setPrice(price);
        history.setInStock(inStock);
        history.setRecordedAt(LocalDateTime.now());
        priceHistoryRepository.save(history);
    }

    protected Document fetchPage(String url) throws IOException {
        return Jsoup.connect(url)
            .userAgent("ElectronicStar-Bot/1.0 (+https://electronic-star.fr/bot)")
            .timeout(15_000)
            .get();
    }
}
