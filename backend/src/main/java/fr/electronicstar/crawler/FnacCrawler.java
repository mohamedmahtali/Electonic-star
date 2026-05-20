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
public class FnacCrawler extends BaseCrawler {

    public FnacCrawler(
        ProductRepository productRepository,
        PriceRepository priceRepository,
        PriceHistoryRepository priceHistoryRepository,
        CrawlerRunRepository crawlerRunRepository
    ) {
        super(productRepository, priceRepository, priceHistoryRepository, crawlerRunRepository);
    }

    @Override
    protected String getStoreName() {
        return "fnac";
    }

    @Override
    protected void crawlProduct(Product product) throws Exception {
        if (product.getMpn() == null) return;

        String searchUrl = "https://www.fnac.com/SearchResult/ResultList.aspx?Search=" + product.getMpn();
        Document doc = fetchPage(searchUrl);

        Element priceEl = doc.selectFirst(".Article-prices .f-priceBox-price");
        Element stockEl = doc.selectFirst(".Article-stock--available");
        Element linkEl = doc.selectFirst(".Article-title a");

        if (priceEl == null) return;

        String priceText = priceEl.text().replaceAll("[^0-9,]", "").replace(",", ".");
        BigDecimal price = new BigDecimal(priceText);
        boolean inStock = stockEl != null;
        String url = linkEl != null ? "https://www.fnac.com" + linkEl.attr("href") : searchUrl;

        savePrice(product, price, url, inStock);
    }
}
