package fr.cdlja.weebsport.web.rest;

import static fr.cdlja.weebsport.domain.ClotheAsserts.*;
import static fr.cdlja.weebsport.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.cdlja.weebsport.IntegrationTest;
import fr.cdlja.weebsport.domain.Clothe;
import fr.cdlja.weebsport.domain.enumeration.Gender;
import fr.cdlja.weebsport.domain.enumeration.Type;
import fr.cdlja.weebsport.repository.ClotheRepository;
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
 * Integration tests for the {@link ClotheResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ClotheResourceIT {

    private static final Type DEFAULT_TYPE = Type.JOGGER;
    private static final Type UPDATED_TYPE = Type.TEESHIRT;

    private static final String DEFAULT_THEME = "AAAAAAAAAA";
    private static final String UPDATED_THEME = "BBBBBBBBBB";

    private static final Gender DEFAULT_GENDER = Gender.MAN;
    private static final Gender UPDATED_GENDER = Gender.WOMAN;

    private static final Float DEFAULT_PRICE = 1F;
    private static final Float UPDATED_PRICE = 2F;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/clothes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ClotheRepository clotheRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClotheMockMvc;

    private Clothe clothe;

    private Clothe insertedClothe;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Clothe createEntity() {
        return new Clothe()
            .type(DEFAULT_TYPE)
            .theme(DEFAULT_THEME)
            .gender(DEFAULT_GENDER)
            .price(DEFAULT_PRICE)
            .description(DEFAULT_DESCRIPTION);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Clothe createUpdatedEntity() {
        return new Clothe()
            .type(UPDATED_TYPE)
            .theme(UPDATED_THEME)
            .gender(UPDATED_GENDER)
            .price(UPDATED_PRICE)
            .description(UPDATED_DESCRIPTION);
    }

    @BeforeEach
    public void initTest() {
        clothe = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedClothe != null) {
            clotheRepository.delete(insertedClothe);
            insertedClothe = null;
        }
    }

    @Test
    @Transactional
    void createClothe() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Clothe
        var returnedClothe = om.readValue(
            restClotheMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clothe)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Clothe.class
        );

        // Validate the Clothe in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertClotheUpdatableFieldsEquals(returnedClothe, getPersistedClothe(returnedClothe));

        insertedClothe = returnedClothe;
    }

    @Test
    @Transactional
    void createClotheWithExistingId() throws Exception {
        // Create the Clothe with an existing ID
        clothe.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClotheMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clothe)))
            .andExpect(status().isBadRequest());

        // Validate the Clothe in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllClothes() throws Exception {
        // Initialize the database
        insertedClothe = clotheRepository.saveAndFlush(clothe);

        // Get all the clotheList
        restClotheMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(clothe.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].theme").value(hasItem(DEFAULT_THEME)))
            .andExpect(jsonPath("$.[*].gender").value(hasItem(DEFAULT_GENDER.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getClothe() throws Exception {
        // Initialize the database
        insertedClothe = clotheRepository.saveAndFlush(clothe);

        // Get the clothe
        restClotheMockMvc
            .perform(get(ENTITY_API_URL_ID, clothe.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(clothe.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.theme").value(DEFAULT_THEME))
            .andExpect(jsonPath("$.gender").value(DEFAULT_GENDER.toString()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingClothe() throws Exception {
        // Get the clothe
        restClotheMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingClothe() throws Exception {
        // Initialize the database
        insertedClothe = clotheRepository.saveAndFlush(clothe);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the clothe
        Clothe updatedClothe = clotheRepository.findById(clothe.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedClothe are not directly saved in db
        em.detach(updatedClothe);
        updatedClothe.type(UPDATED_TYPE).theme(UPDATED_THEME).gender(UPDATED_GENDER).price(UPDATED_PRICE).description(UPDATED_DESCRIPTION);

        restClotheMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClothe.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedClothe))
            )
            .andExpect(status().isOk());

        // Validate the Clothe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedClotheToMatchAllProperties(updatedClothe);
    }

    @Test
    @Transactional
    void putNonExistingClothe() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clothe.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClotheMockMvc
            .perform(put(ENTITY_API_URL_ID, clothe.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clothe)))
            .andExpect(status().isBadRequest());

        // Validate the Clothe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClothe() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clothe.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClotheMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(clothe))
            )
            .andExpect(status().isBadRequest());

        // Validate the Clothe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClothe() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clothe.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClotheMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clothe)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Clothe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClotheWithPatch() throws Exception {
        // Initialize the database
        insertedClothe = clotheRepository.saveAndFlush(clothe);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the clothe using partial update
        Clothe partialUpdatedClothe = new Clothe();
        partialUpdatedClothe.setId(clothe.getId());

        partialUpdatedClothe.theme(UPDATED_THEME).price(UPDATED_PRICE).description(UPDATED_DESCRIPTION);

        restClotheMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClothe.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedClothe))
            )
            .andExpect(status().isOk());

        // Validate the Clothe in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertClotheUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedClothe, clothe), getPersistedClothe(clothe));
    }

    @Test
    @Transactional
    void fullUpdateClotheWithPatch() throws Exception {
        // Initialize the database
        insertedClothe = clotheRepository.saveAndFlush(clothe);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the clothe using partial update
        Clothe partialUpdatedClothe = new Clothe();
        partialUpdatedClothe.setId(clothe.getId());

        partialUpdatedClothe
            .type(UPDATED_TYPE)
            .theme(UPDATED_THEME)
            .gender(UPDATED_GENDER)
            .price(UPDATED_PRICE)
            .description(UPDATED_DESCRIPTION);

        restClotheMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClothe.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedClothe))
            )
            .andExpect(status().isOk());

        // Validate the Clothe in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertClotheUpdatableFieldsEquals(partialUpdatedClothe, getPersistedClothe(partialUpdatedClothe));
    }

    @Test
    @Transactional
    void patchNonExistingClothe() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clothe.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClotheMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, clothe.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(clothe))
            )
            .andExpect(status().isBadRequest());

        // Validate the Clothe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClothe() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clothe.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClotheMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(clothe))
            )
            .andExpect(status().isBadRequest());

        // Validate the Clothe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClothe() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clothe.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClotheMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(clothe)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Clothe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClothe() throws Exception {
        // Initialize the database
        insertedClothe = clotheRepository.saveAndFlush(clothe);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the clothe
        restClotheMockMvc
            .perform(delete(ENTITY_API_URL_ID, clothe.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return clotheRepository.count();
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

    protected Clothe getPersistedClothe(Clothe clothe) {
        return clotheRepository.findById(clothe.getId()).orElseThrow();
    }

    protected void assertPersistedClotheToMatchAllProperties(Clothe expectedClothe) {
        assertClotheAllPropertiesEquals(expectedClothe, getPersistedClothe(expectedClothe));
    }

    protected void assertPersistedClotheToMatchUpdatableProperties(Clothe expectedClothe) {
        assertClotheAllUpdatablePropertiesEquals(expectedClothe, getPersistedClothe(expectedClothe));
    }
}
