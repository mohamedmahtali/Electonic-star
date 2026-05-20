package fr.electronicstar.crawler;

import fr.electronicstar.model.Product;
import fr.electronicstar.repository.CrawlerRunRepository;
import fr.electronicstar.repository.PriceHistoryRepository;
import fr.electronicstar.repository.PriceRepository;
import fr.electronicstar.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Slf4j
@Component
public class BoulangerCrawler extends BaseCrawler {

    public BoulangerCrawler(
        ProductRepository productRepository,
        PriceRepository priceRepository,
        PriceHistoryRepository priceHistoryRepository,
        CrawlerRunRepository crawlerRunRepository
    ) {
        super(productRepository, priceRepository, priceHistoryRepository, crawlerRunRepository);
    }

    @Override
    protected String getStoreName() {
        return "boulanger";
    }

    @Override
    protected void crawlProduct(Product product) throws Exception {
        if (product.getMpn() == null) return;

        String searchUrl = "https://www.boulanger.com/result?tr=" + product.getMpn();
        Document doc = fetchPage(searchUrl);

        Element priceEl = doc.selectFirst(".price__main");
        Element stockEl = doc.selectFirst(".availability--available");
        Element linkEl = doc.selectFirst("a.product-thumb__image-link");

        if (priceEl == null) return;

        String priceText = priceEl.text().replaceAll("[^0-9,]", "").replace(",", ".");
        BigDecimal price = new BigDecimal(priceText);
        boolean inStock = stockEl != null;
        String url = linkEl != null ? "https://www.boulanger.com" + linkEl.attr("href") : searchUrl;

        savePrice(product, price, url, inStock);
    }
}
