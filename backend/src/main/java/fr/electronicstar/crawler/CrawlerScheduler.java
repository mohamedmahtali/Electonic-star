package fr.electronicstar.crawler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CrawlerScheduler {

    private final AmazonCrawler amazonCrawler;
    private final CdiscountCrawler cdiscountCrawler;
    private final LdlcCrawler ldlcCrawler;
    private final FnacCrawler fnacCrawler;
    private final BoulangerCrawler boulangerCrawler;

    @Scheduled(fixedRate = 3_600_000)
    public void runHourlyCrawlers() {
        log.info("=== Démarrage du cycle de crawl horaire ===");
        runSafe("Amazon", amazonCrawler::crawlAll);
        runSafe("Cdiscount", cdiscountCrawler::crawlAll);
        runSafe("LDLC", ldlcCrawler::crawlAll);
        runSafe("Fnac", fnacCrawler::crawlAll);
        log.info("=== Cycle horaire terminé ===");
    }

    @Scheduled(fixedRate = 7_200_000)
    public void runBiHourlyCrawlers() {
        log.info("=== Démarrage du cycle biheure — Boulanger ===");
        runSafe("Boulanger", boulangerCrawler::crawlAll);
        log.info("=== Cycle biheure terminé ===");
    }

    private void runSafe(String name, Runnable task) {
        try {
            log.info("[Scheduler] Lancement du crawler {}", name);
            task.run();
        } catch (Exception e) {
            log.error("[Scheduler] Erreur crawler {} : {}", name, e.getMessage(), e);
        }
    }
}
