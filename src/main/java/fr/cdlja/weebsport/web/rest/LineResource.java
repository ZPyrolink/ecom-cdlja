package fr.cdlja.weebsport.web.rest;

import fr.cdlja.weebsport.domain.Line;
import fr.cdlja.weebsport.repository.LineRepository;
import fr.cdlja.weebsport.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
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
 * REST controller for managing {@link fr.cdlja.weebsport.domain.Line}.
 */
@RestController
@RequestMapping("/api/lines")
@Transactional
public class LineResource {

    private static final Logger LOG = LoggerFactory.getLogger(LineResource.class);

    private static final String ENTITY_NAME = "line";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LineRepository lineRepository;

    public LineResource(LineRepository lineRepository) {
        this.lineRepository = lineRepository;
    }

    /**
     * {@code POST  /lines} : Create a new line.
     *
     * @param line the line to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new line, or with status {@code 400 (Bad Request)} if the line has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Line> createLine(@RequestBody Line line) throws URISyntaxException {
        LOG.debug("REST request to save Line : {}", line);
        if (line.getId() != null) {
            throw new BadRequestAlertException("A new line cannot already have an ID", ENTITY_NAME, "idexists");
        }
        line = lineRepository.save(line);
        return ResponseEntity.created(new URI("/api/lines/" + line.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, line.getId().toString()))
            .body(line);
    }

    /**
     * {@code PUT  /lines/:id} : Updates an existing line.
     *
     * @param id   the id of the line to save.
     * @param line the line to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated line,
     * or with status {@code 400 (Bad Request)} if the line is not valid,
     * or with status {@code 500 (Internal Server Error)} if the line couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Line> updateLine(@PathVariable(value = "id", required = false) final Long id, @RequestBody Line line)
        throws URISyntaxException {
        LOG.debug("REST request to update Line : {}, {}", id, line);
        if (line.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, line.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        line = lineRepository.save(line);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, line.getId().toString()))
            .body(line);
    }

    /**
     * {@code PATCH  /lines/:id} : Partial updates given fields of an existing line, field will ignore if it is null
     *
     * @param id   the id of the line to save.
     * @param line the line to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated line,
     * or with status {@code 400 (Bad Request)} if the line is not valid,
     * or with status {@code 404 (Not Found)} if the line is not found,
     * or with status {@code 500 (Internal Server Error)} if the line couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Line> partialUpdateLine(@PathVariable(value = "id", required = false) final Long id, @RequestBody Line line)
        throws URISyntaxException {
        LOG.debug("REST request to partial update Line partially : {}, {}", id, line);
        if (line.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, line.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Line> result = lineRepository
            .findById(line.getId())
            .map(existingLine -> {
                if (line.getContent() != null) {
                    existingLine.setContent(line.getContent());
                }

                return existingLine;
            })
            .map(lineRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, line.getId().toString())
        );
    }

    /**
     * {@code GET  /lines} : get all the lines.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lines in body.
     */
    @GetMapping("")
    public List<Line> getAllLines(@RequestParam Optional<Integer> noteId) {
        final List<Line> result = new ArrayList<>();

        noteId.ifPresentOrElse(
            id -> {
                LOG.debug("REST request to get Lines of the Note " + id);
                result.addAll(lineRepository.ofNote(id));
            },
            () -> {
                LOG.debug("REST request to get all Lines");
                result.addAll(lineRepository.findAll());
            }
        );

        return result;
    }

    /**
     * {@code GET  /lines/:id} : get the "id" line.
     *
     * @param id the id of the line to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the line, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Line> getLine(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Line : {}", id);
        Optional<Line> line = lineRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(line);
    }

    /**
     * {@code DELETE  /lines/:id} : delete the "id" line.
     *
     * @param id the id of the line to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLine(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Line : {}", id);
        lineRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
