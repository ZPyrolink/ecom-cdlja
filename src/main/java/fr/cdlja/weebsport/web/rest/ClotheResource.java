package fr.cdlja.weebsport.web.rest;

import fr.cdlja.weebsport.domain.Clothe;
import fr.cdlja.weebsport.repository.ClotheRepository;
import fr.cdlja.weebsport.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link fr.cdlja.weebsport.domain.Clothe}.
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

    public ClotheResource(ClotheRepository clotheRepository) {
        this.clotheRepository = clotheRepository;
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
    public List<Clothe> getAllClothes() {
        LOG.debug("REST request to get all Clothes");
        return clotheRepository.findAll();
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
