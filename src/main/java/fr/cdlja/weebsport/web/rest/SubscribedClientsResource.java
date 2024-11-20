package fr.cdlja.weebsport.web.rest;

import fr.cdlja.weebsport.domain.SubscribedClients;
import fr.cdlja.weebsport.repository.SubscribedClientsRepository;
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
 * REST controller for managing {@link fr.cdlja.weebsport.domain.SubscribedClients}.
 */
@RestController
@RequestMapping("/api/subscribed-clients")
@Transactional
public class SubscribedClientsResource {

    private static final Logger LOG = LoggerFactory.getLogger(SubscribedClientsResource.class);

    private static final String ENTITY_NAME = "subscribedClients";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SubscribedClientsRepository subscribedClientsRepository;

    public SubscribedClientsResource(SubscribedClientsRepository subscribedClientsRepository) {
        this.subscribedClientsRepository = subscribedClientsRepository;
    }

    /**
     * {@code POST  /subscribed-clients} : Create a new subscribedClients.
     *
     * @param subscribedClients the subscribedClients to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new subscribedClients, or with status {@code 400 (Bad Request)} if the subscribedClients has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<SubscribedClients> createSubscribedClients(@RequestBody SubscribedClients subscribedClients)
        throws URISyntaxException {
        LOG.debug("REST request to save SubscribedClients : {}", subscribedClients);
        if (subscribedClients.getId() != null) {
            throw new BadRequestAlertException("A new subscribedClients cannot already have an ID", ENTITY_NAME, "idexists");
        }
        subscribedClients = subscribedClientsRepository.save(subscribedClients);
        return ResponseEntity.created(new URI("/api/subscribed-clients/" + subscribedClients.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, subscribedClients.getId().toString()))
            .body(subscribedClients);
    }

    /**
     * {@code PUT  /subscribed-clients/:id} : Updates an existing subscribedClients.
     *
     * @param id the id of the subscribedClients to save.
     * @param subscribedClients the subscribedClients to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated subscribedClients,
     * or with status {@code 400 (Bad Request)} if the subscribedClients is not valid,
     * or with status {@code 500 (Internal Server Error)} if the subscribedClients couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<SubscribedClients> updateSubscribedClients(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SubscribedClients subscribedClients
    ) throws URISyntaxException {
        LOG.debug("REST request to update SubscribedClients : {}, {}", id, subscribedClients);
        if (subscribedClients.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, subscribedClients.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!subscribedClientsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        subscribedClients = subscribedClientsRepository.save(subscribedClients);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, subscribedClients.getId().toString()))
            .body(subscribedClients);
    }

    /**
     * {@code PATCH  /subscribed-clients/:id} : Partial updates given fields of an existing subscribedClients, field will ignore if it is null
     *
     * @param id the id of the subscribedClients to save.
     * @param subscribedClients the subscribedClients to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated subscribedClients,
     * or with status {@code 400 (Bad Request)} if the subscribedClients is not valid,
     * or with status {@code 404 (Not Found)} if the subscribedClients is not found,
     * or with status {@code 500 (Internal Server Error)} if the subscribedClients couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SubscribedClients> partialUpdateSubscribedClients(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SubscribedClients subscribedClients
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update SubscribedClients partially : {}, {}", id, subscribedClients);
        if (subscribedClients.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, subscribedClients.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!subscribedClientsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SubscribedClients> result = subscribedClientsRepository
            .findById(subscribedClients.getId())
            .map(existingSubscribedClients -> {
                if (subscribedClients.getBirthday() != null) {
                    existingSubscribedClients.setBirthday(subscribedClients.getBirthday());
                }
                if (subscribedClients.getEmail() != null) {
                    existingSubscribedClients.setEmail(subscribedClients.getEmail());
                }
                if (subscribedClients.getAddress() != null) {
                    existingSubscribedClients.setAddress(subscribedClients.getAddress());
                }
                if (subscribedClients.getBankCard() != null) {
                    existingSubscribedClients.setBankCard(subscribedClients.getBankCard());
                }
                if (subscribedClients.getPhone() != null) {
                    existingSubscribedClients.setPhone(subscribedClients.getPhone());
                }
                if (subscribedClients.getPoints() != null) {
                    existingSubscribedClients.setPoints(subscribedClients.getPoints());
                }

                return existingSubscribedClients;
            })
            .map(subscribedClientsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, subscribedClients.getId().toString())
        );
    }

    /**
     * {@code GET  /subscribed-clients} : get all the subscribedClients.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of subscribedClients in body.
     */
    @GetMapping("")
    public List<SubscribedClients> getAllSubscribedClients(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get all SubscribedClients");
        if (eagerload) {
            return subscribedClientsRepository.findAllWithEagerRelationships();
        } else {
            return subscribedClientsRepository.findAll();
        }
    }

    /**
     * {@code GET  /subscribed-clients/:id} : get the "id" subscribedClients.
     *
     * @param id the id of the subscribedClients to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the subscribedClients, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SubscribedClients> getSubscribedClients(@PathVariable("id") Long id) {
        LOG.debug("REST request to get SubscribedClients : {}", id);
        Optional<SubscribedClients> subscribedClients = subscribedClientsRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(subscribedClients);
    }

    /**
     * {@code DELETE  /subscribed-clients/:id} : delete the "id" subscribedClients.
     *
     * @param id the id of the subscribedClients to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscribedClients(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete SubscribedClients : {}", id);
        subscribedClientsRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
