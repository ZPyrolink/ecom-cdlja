package fr.cdlja.weebsport.web.rest;

import fr.cdlja.weebsport.domain.Stock;
import fr.cdlja.weebsport.domain.enumeration.Color;
import fr.cdlja.weebsport.domain.enumeration.Size;
import fr.cdlja.weebsport.repository.ClotheRepository;
import fr.cdlja.weebsport.repository.StockRepository;
import fr.cdlja.weebsport.service.StockService;
import fr.cdlja.weebsport.service.dto.StockDTO;
import fr.cdlja.weebsport.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link fr.cdlja.weebsport.domain.Stock}.
 */
@RestController
@RequestMapping("/api/stocks")
@Transactional
public class StockResource {

    private static final Logger LOG = LoggerFactory.getLogger(StockResource.class);

    private static final String ENTITY_NAME = "stock";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StockRepository stockRepository;

    private final ClotheRepository clotheRepository;

    private final StockService stockService;

    public StockResource(StockRepository stockRepository, ClotheRepository clotheRepository, StockService stockService) {
        this.stockRepository = stockRepository;
        this.clotheRepository = clotheRepository;
        this.stockService = stockService;
    }

    /**
     * {@code POST  /stocks} : Create a new stock.
     *
     * @param stock the stock to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new stock, or with status {@code 400 (Bad Request)} if the stock has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Stock> createStock(@RequestBody Stock stock) throws URISyntaxException {
        LOG.debug("REST request to save Stock : {}", stock);
        if (stock.getId() != null) {
            throw new BadRequestAlertException("A new stock cannot already have an ID", ENTITY_NAME, "idexists");
        }
        stock = stockRepository.save(stock);
        return ResponseEntity.created(new URI("/api/stocks/" + stock.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, stock.getId().toString()))
            .body(stock);
    }

    /**
     * {@code PUT  /stocks/:id} : Updates an existing stock.
     *
     * @param id the id of the stock to save.
     * @param stock the stock to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stock,
     * or with status {@code 400 (Bad Request)} if the stock is not valid,
     * or with status {@code 500 (Internal Server Error)} if the stock couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Stock> updateStock(@PathVariable(value = "id", required = false) final Long id, @RequestBody Stock stock)
        throws URISyntaxException {
        LOG.debug("REST request to update Stock : {}, {}", id, stock);
        if (stock.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stock.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stockRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        stock = stockRepository.save(stock);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, stock.getId().toString()))
            .body(stock);
    }

    /**
     * {@code PATCH  /stocks/:id} : Partial updates given fields of an existing stock, field will ignore if it is null
     *
     * @param id the id of the stock to save.
     * @param stock the stock to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stock,
     * or with status {@code 400 (Bad Request)} if the stock is not valid,
     * or with status {@code 404 (Not Found)} if the stock is not found,
     * or with status {@code 500 (Internal Server Error)} if the stock couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Stock> partialUpdateStock(@PathVariable(value = "id", required = false) final Long id, @RequestBody Stock stock)
        throws URISyntaxException {
        LOG.debug("REST request to partial update Stock partially : {}, {}", id, stock);
        if (stock.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stock.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stockRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Stock> result = stockRepository
            .findById(stock.getId())
            .map(existingStock -> {
                if (stock.getColor() != null) {
                    existingStock.setColor(stock.getColor());
                }
                if (stock.getSize() != null) {
                    existingStock.setSize(stock.getSize());
                }

                return existingStock;
            })
            .map(stockRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, stock.getId().toString())
        );
    }

    /**
     * {@code GET  /stocks} : get all the stocks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of stocks in body.
     */
    @GetMapping("")
    public ResponseEntity<Page<Stock>> getAllStocks(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "15") int size,
        @RequestParam(defaultValue = "id") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending()); // Création d'un Pageable

        Page<Stock> stocksPage = stockRepository.findAll(pageable); // Récupération de la page de stocks

        return ResponseEntity.ok(stocksPage); // Retour de la page dans la réponse
    }

    @GetMapping("/clothes/{id}")
    public ResponseEntity<List<StockDTO>> getStocksByClotheId(@PathVariable("id") Long id) {
        List<Stock> stocks = stockRepository.findStocksByClotheId(id);
        List<StockDTO> stocksDTO = stocks.stream().map(StockDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(stocksDTO);
    }

    /**
     * {@code GET  /stocks/:id} : get the "id" stock.
     *
     * @param id the id of the stock to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the stock, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Stock> getStock(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Stock : {}", id);
        Optional<Stock> stock = stockRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(stock);
    }

    @GetMapping("/{id}/{color}/{size}")
    public ResponseEntity<StockDTO> getStock(
        @PathVariable("id") Long id,
        @PathVariable("color") Color color,
        @PathVariable("size") Size size
    ) throws Exception {
        Stock s = stockRepository.idStockByColorAndSize(color, size, id);
        if (s == null) {
            throw new Exception("no stock available");
        }
        StockDTO stockDTO = new StockDTO(s);
        return ResponseEntity.ok(stockDTO);
    }

    /**
     * {@code DELETE  /stocks/:id} : delete the "id" stock.
     *
     * @param id the id of the stock to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Stock : {}", id);
        stockRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
