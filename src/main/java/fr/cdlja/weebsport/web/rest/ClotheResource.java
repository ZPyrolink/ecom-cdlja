package fr.cdlja.weebsport.web.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.cdlja.weebsport.domain.Clothe;
import fr.cdlja.weebsport.domain.Stock;
import fr.cdlja.weebsport.domain.enumeration.*;
import fr.cdlja.weebsport.repository.ClotheRepository;
import fr.cdlja.weebsport.repository.StockRepository;
import fr.cdlja.weebsport.service.ClotheService;
import fr.cdlja.weebsport.service.StockService;
import fr.cdlja.weebsport.service.dto.*;
import fr.cdlja.weebsport.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link Clothe}.
 */
@RestController
@RequestMapping("/api/clothes")
@Transactional
public class ClotheResource {

    private static final Logger LOG = LoggerFactory.getLogger(ClotheResource.class);

    private static final String ENTITY_NAME = "clothe";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClotheRepository clotheRepository;
    private final StockRepository stockRepository;
    private final ClotheService clotheService;
    private final StockService stockService;

    public ClotheResource(
        ClotheRepository clotheRepository,
        StockRepository stockRepository,
        ClotheService clotheService,
        StockService stockService
    ) {
        this.clotheRepository = clotheRepository;
        this.stockRepository = stockRepository;
        this.clotheService = clotheService;
        this.stockService = stockService;
    }

    /**
     * {@code POST  /clothes} : Create a new clothe.
     *
     * @param clothe the clothe to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new clothe, or with status {@code 400 (Bad Request)} if the clothe has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Clothe> createClothe(@RequestBody Clothe clothe) throws URISyntaxException {
        LOG.debug("REST request to save Clothe : {}", clothe);
        if (clothe.getId() != null) {
            throw new BadRequestAlertException("A new clothe cannot already have an ID", ENTITY_NAME, "idexists");
        }
        clothe = clotheRepository.save(clothe);
        return ResponseEntity.created(new URI("/api/clothes/" + clothe.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, clothe.getId().toString()))
            .body(clothe);
    }

    /**
     * {@code PUT  /clothes/:id} : Updates an existing clothe.
     *
     * @param id the id of the clothe to save.
     * @param clothe the clothe to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clothe,
     * or with status {@code 400 (Bad Request)} if the clothe is not valid,
     * or with status {@code 500 (Internal Server Error)} if the clothe couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Clothe> updateClothe(@PathVariable(value = "id", required = false) final Long id, @RequestBody Clothe clothe)
        throws URISyntaxException {
        LOG.debug("REST request to update Clothe : {}, {}", id, clothe);
        if (clothe.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clothe.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clotheRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        clothe = clotheRepository.save(clothe);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, clothe.getId().toString()))
            .body(clothe);
    }

    /**
     * {@code PATCH  /clothes/:id} : Partial updates given fields of an existing clothe, field will ignore if it is null
     *
     * @param id the id of the clothe to save.
     * @param clothe the clothe to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clothe,
     * or with status {@code 400 (Bad Request)} if the clothe is not valid,
     * or with status {@code 404 (Not Found)} if the clothe is not found,
     * or with status {@code 500 (Internal Server Error)} if the clothe couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Clothe> partialUpdateClothe(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Clothe clothe
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Clothe partially : {}, {}", id, clothe);
        if (clothe.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clothe.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clotheRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Clothe> result = clotheRepository
            .findById(clothe.getId())
            .map(existingClothe -> {
                if (clothe.getType() != null) {
                    existingClothe.setType(clothe.getType());
                }
                if (clothe.getTheme() != null) {
                    existingClothe.setTheme(clothe.getTheme());
                }
                if (clothe.getGender() != null) {
                    existingClothe.setGender(clothe.getGender());
                }
                if (clothe.getPrice() != null) {
                    existingClothe.setPrice(clothe.getPrice());
                }
                if (clothe.getDescription() != null) {
                    existingClothe.setDescription(clothe.getDescription());
                }

                return existingClothe;
            })
            .map(clotheRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, clothe.getId().toString())
        );
    }

    /**
     * {@code GET  /clothes} : get all the clothes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of clothes in body.
     */
    @GetMapping("")
    public ResponseEntity<Page<Clothe>> getAllClothes(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "15") int size,
        @RequestParam(defaultValue = "id") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        Page<Clothe> rawResults = clotheRepository.findClotheWithQuantityGreaterThanZero(pageable);
        //        List<Clothe> clothes = rawResults
        //            .getContent()
        //            .stream()
        //            .map(result -> (Clothe) result[0]) // Récupère l'entité Clothe du tableau Object[]
        //            .distinct() // Remove duplicates
        //            .collect(Collectors.toList());
        //        try {
        //            LOG.debug(jacksonObjectMapper.writeValueAsString(rawResults));
        //            LOG.debug(jacksonObjectMapper.writeValueAsString(clothes));
        //        } catch (JsonProcessingException e) {
        //            throw new RuntimeException(e);
        //        }
        //        Page<Clothe> clothePage = new PageImpl<>(clothes, pageable, rawResults.getTotalElements());
        return ResponseEntity.ok(rawResults);
    }

    @GetMapping("/size/{id}/{color}")
    public ResponseEntity<List<Size>> getClotheSize(@PathVariable Long id, @PathVariable Color color) {
        List<Size> availableSizes = stockRepository.findAvailableSizesByClotheIdAndColorId(id, color);
        return ResponseEntity.ok(availableSizes);
    }

    @GetMapping("/color/{id}")
    public ResponseEntity<List<Color>> getClotheColor(@PathVariable Long id) {
        // recupère toute couleur dispo pour un vetement
        List<Color> availablesColor = stockRepository.findAvailableColorsByClotheId(id);
        return ResponseEntity.ok(availablesColor);
    }

    @GetMapping("/category/videogame")
    public ResponseEntity<List<String>> getThemesVideogame() {
        List<String> themes = clotheRepository.findAllThemes(Category.VIDEOGAME);
        return ResponseEntity.ok(themes);
    }

    @GetMapping("/category/anime")
    public ResponseEntity<List<String>> getThemesAnime() {
        List<String> themes = clotheRepository.findAllThemes(Category.ANIME);
        return ResponseEntity.ok(themes);
    }

    @GetMapping("/category/search")
    public ResponseEntity<ThemeDTO> getThemesSearch(@ModelAttribute SearchDTO searchDTO) {
        ThemeDTO themeDTO = new ThemeDTO();
        String theme = searchDTO.getSearch();
        List<String> animethemes = clotheService.getThemesByCategoryAndSearch(Category.ANIME, theme);
        List<String> videogamethemes = clotheService.getThemesByCategoryAndSearch(Category.VIDEOGAME, theme);
        themeDTO.setAnimeThemes(animethemes);
        themeDTO.setVideogameThemes(videogamethemes);
        return ResponseEntity.ok(themeDTO);
    }

    @PostMapping("/filters")
    public ResponseEntity<Page<ClotheDTO>> getClothesFiltered(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "15") int size,
        @RequestParam(defaultValue = "clothe.price") String sortBy,
        @RequestBody FilterSortDTO filtersSort
    ) {
        if (filtersSort == null) {
            throw new RuntimeException("Problems with the body. Maybe it is empty");
        }
        FilterDTO filters = filtersSort.getFilters();
        String keyword = filtersSort.getSearch();
        String keyWord = (keyword != null && (!keyword.isEmpty())) ? keyword.toUpperCase() : null;
        String sortR = filtersSort.getSort();
        String sort = (sortR != null && (!sortR.isEmpty())) ? sortR : null;

        Pageable pageable = null;

        Sort sortCriteria = null;
        if (sort != null) {
            sort = sort.toLowerCase();
            if (!"clothe.price".equals(sortBy)) {
                throw new RuntimeException("The sort has to be by clothe.price");
            } else {
                if (Objects.equals(sort, "asc")) {
                    sortCriteria = Sort.by(Sort.Order.asc(sortBy), Sort.Order.asc("id"));
                } else if (Objects.equals(sort, "desc")) {
                    sortCriteria = Sort.by(Sort.Order.desc(sortBy), Sort.Order.desc("id"));
                } else {
                    throw new RuntimeException("The value of sort has to be ASC or DESC");
                }
            }
            pageable = PageRequest.of(page, size, sortCriteria);
        } else {
            pageable = PageRequest.of(page, size, Sort.by("id"));
        }

        List<Size> sizes = (filters == null || (filters.getSizes() != null && filters.getSizes().isEmpty())) ? null : filters.getSizes();
        List<Color> colors = (filters == null || (filters.getColors() != null && filters.getColors().isEmpty()))
            ? null
            : filters.getColors();
        Float minPrice = (filters == null ||
                filters.getPrices() == null ||
                (filters.getPrices() != null && filters.getPrices().getMin() == null) ||
                (filters.getPrices() != null && filters.getPrices().getMin() != null && filters.getPrices().getMin() == -1))
            ? null
            : filters.getPrices().getMin();
        Float maxPrice = (filters == null ||
                filters.getPrices() == null ||
                (filters.getPrices() != null && filters.getPrices().getMax() == null) ||
                (filters.getPrices() != null && filters.getPrices().getMax() != null && filters.getPrices().getMax() == -1))
            ? null
            : filters.getPrices().getMax();
        List<Gender> genders = (filters == null || (filters.getGenders() != null && filters.getGenders().isEmpty()))
            ? null
            : filters.getGenders();
        List<Type> types = (filters == null || (filters.getTypes() != null && filters.getTypes().isEmpty())) ? null : filters.getTypes();
        List<String> themeMin = (filters == null || (filters.getThemes() != null && filters.getThemes().isEmpty()))
            ? null
            : filters.getThemes();
        List<String> theme = (themeMin == null) ? null : themeMin.stream().map(String::toUpperCase).collect(Collectors.toList());

        List<Stock> stocks = stockRepository.getStocksByFiltersAndSearch(
            sizes,
            colors,
            minPrice,
            maxPrice,
            genders,
            types,
            theme,
            keyWord,
            sortCriteria
        );
        Set<Long> addedClotheIds = new HashSet<>();

        // Filtrer et mapper les stocks en ClotheDTO uniquement si l'identifiant n'est pas encore dans la liste
        List<ClotheDTO> filteredClothes = new ArrayList<>();
        for (Stock stock : stocks) {
            Long clotheId = stock.getClothe().getId(); // Assurez-vous que l'ID est de type Long
            if (!addedClotheIds.contains(clotheId)) {
                filteredClothes.add(new ClotheDTO(stock.getClothe()));
                addedClotheIds.add(clotheId);
            }
        }

        // Convertir la liste filtrÃ©e en Page en utilisant Pageable
        Page<ClotheDTO> clothesPage = new PageImpl<>(filteredClothes, pageable, filteredClothes.size());
        return ResponseEntity.ok(clothesPage);
    }

    /**
     * {@code GET  /clothes/:id} : get the "id" clothe.
     *
     * @param id the id of the clothe to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the clothe, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Clothe> getClothe(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Clothe : {}", id);
        Optional<Clothe> clothe = clotheRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(clothe);
    }

    /**
     * {@code DELETE  /clothes/:id} : delete the "id" clothe.
     *
     * @param id the id of the clothe to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClothe(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Clothe : {}", id);
        clotheRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
