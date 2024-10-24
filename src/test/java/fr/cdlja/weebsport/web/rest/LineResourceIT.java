package fr.cdlja.weebsport.web.rest;

import static fr.cdlja.weebsport.domain.LineAsserts.*;
import static fr.cdlja.weebsport.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.cdlja.weebsport.IntegrationTest;
import fr.cdlja.weebsport.domain.Line;
import fr.cdlja.weebsport.repository.LineRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LineResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LineResourceIT {

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/lines";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private LineRepository lineRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLineMockMvc;

    private Line line;

    private Line insertedLine;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Line createEntity() {
        return new Line().content(DEFAULT_CONTENT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Line createUpdatedEntity() {
        return new Line().content(UPDATED_CONTENT);
    }

    @BeforeEach
    public void initTest() {
        line = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedLine != null) {
            lineRepository.delete(insertedLine);
            insertedLine = null;
        }
    }

    @Test
    @Transactional
    void createLine() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Line
        var returnedLine = om.readValue(
            restLineMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(line)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Line.class
        );

        // Validate the Line in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertLineUpdatableFieldsEquals(returnedLine, getPersistedLine(returnedLine));

        insertedLine = returnedLine;
    }

    @Test
    @Transactional
    void createLineWithExistingId() throws Exception {
        // Create the Line with an existing ID
        line.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(line)))
            .andExpect(status().isBadRequest());

        // Validate the Line in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLines() throws Exception {
        // Initialize the database
        insertedLine = lineRepository.saveAndFlush(line);

        // Get all the lineList
        restLineMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(line.getId().intValue())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)));
    }

    @Test
    @Transactional
    void getLine() throws Exception {
        // Initialize the database
        insertedLine = lineRepository.saveAndFlush(line);

        // Get the line
        restLineMockMvc
            .perform(get(ENTITY_API_URL_ID, line.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(line.getId().intValue()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT));
    }

    @Test
    @Transactional
    void getNonExistingLine() throws Exception {
        // Get the line
        restLineMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLine() throws Exception {
        // Initialize the database
        insertedLine = lineRepository.saveAndFlush(line);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the line
        Line updatedLine = lineRepository.findById(line.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedLine are not directly saved in db
        em.detach(updatedLine);
        updatedLine.content(UPDATED_CONTENT);

        restLineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLine.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedLine))
            )
            .andExpect(status().isOk());

        // Validate the Line in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedLineToMatchAllProperties(updatedLine);
    }

    @Test
    @Transactional
    void putNonExistingLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        line.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLineMockMvc
            .perform(put(ENTITY_API_URL_ID, line.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(line)))
            .andExpect(status().isBadRequest());

        // Validate the Line in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        line.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(line))
            )
            .andExpect(status().isBadRequest());

        // Validate the Line in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        line.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLineMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(line)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Line in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLineWithPatch() throws Exception {
        // Initialize the database
        insertedLine = lineRepository.saveAndFlush(line);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the line using partial update
        Line partialUpdatedLine = new Line();
        partialUpdatedLine.setId(line.getId());

        restLineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLine.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLine))
            )
            .andExpect(status().isOk());

        // Validate the Line in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLineUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedLine, line), getPersistedLine(line));
    }

    @Test
    @Transactional
    void fullUpdateLineWithPatch() throws Exception {
        // Initialize the database
        insertedLine = lineRepository.saveAndFlush(line);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the line using partial update
        Line partialUpdatedLine = new Line();
        partialUpdatedLine.setId(line.getId());

        partialUpdatedLine.content(UPDATED_CONTENT);

        restLineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLine.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLine))
            )
            .andExpect(status().isOk());

        // Validate the Line in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLineUpdatableFieldsEquals(partialUpdatedLine, getPersistedLine(partialUpdatedLine));
    }

    @Test
    @Transactional
    void patchNonExistingLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        line.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLineMockMvc
            .perform(patch(ENTITY_API_URL_ID, line.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(line)))
            .andExpect(status().isBadRequest());

        // Validate the Line in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        line.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(line))
            )
            .andExpect(status().isBadRequest());

        // Validate the Line in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        line.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLineMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(line)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Line in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLine() throws Exception {
        // Initialize the database
        insertedLine = lineRepository.saveAndFlush(line);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the line
        restLineMockMvc
            .perform(delete(ENTITY_API_URL_ID, line.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return lineRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Line getPersistedLine(Line line) {
        return lineRepository.findById(line.getId()).orElseThrow();
    }

    protected void assertPersistedLineToMatchAllProperties(Line expectedLine) {
        assertLineAllPropertiesEquals(expectedLine, getPersistedLine(expectedLine));
    }

    protected void assertPersistedLineToMatchUpdatableProperties(Line expectedLine) {
        assertLineAllUpdatablePropertiesEquals(expectedLine, getPersistedLine(expectedLine));
    }
}
