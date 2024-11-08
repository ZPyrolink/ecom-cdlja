package fr.cdlja.weebsport.web.rest;

import static fr.cdlja.weebsport.domain.SubscribedClientsAsserts.*;
import static fr.cdlja.weebsport.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.cdlja.weebsport.IntegrationTest;
import fr.cdlja.weebsport.domain.SubscribedClients;
import fr.cdlja.weebsport.repository.SubscribedClientsRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SubscribedClientsResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class SubscribedClientsResourceIT {

    private static final String DEFAULT_LASTNAME = "AAAAAAAAAA";
    private static final String UPDATED_LASTNAME = "BBBBBBBBBB";

    private static final String DEFAULT_FIRSTNAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRSTNAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_BIRTHDAY = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_BIRTHDAY = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PASSWORLD = "AAAAAAAAAA";
    private static final String UPDATED_PASSWORLD = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_BANCK_CARD = "AAAAAAAAAA";
    private static final String UPDATED_BANCK_CARD = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final Integer DEFAULT_POINTS = 1;
    private static final Integer UPDATED_POINTS = 2;

    private static final String ENTITY_API_URL = "/api/subscribed-clients";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private SubscribedClientsRepository subscribedClientsRepository;

    @Mock
    private SubscribedClientsRepository subscribedClientsRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSubscribedClientsMockMvc;

    private SubscribedClients subscribedClients;

    private SubscribedClients insertedSubscribedClients;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SubscribedClients createEntity() {
        return new SubscribedClients()
            .lastname(DEFAULT_LASTNAME)
            .firstname(DEFAULT_FIRSTNAME)
            .birthday(DEFAULT_BIRTHDAY)
            .email(DEFAULT_EMAIL)
            .passworld(DEFAULT_PASSWORLD)
            .address(DEFAULT_ADDRESS)
            .banckCard(DEFAULT_BANCK_CARD)
            .phone(DEFAULT_PHONE)
            .points(DEFAULT_POINTS);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SubscribedClients createUpdatedEntity() {
        return new SubscribedClients()
            .lastname(UPDATED_LASTNAME)
            .firstname(UPDATED_FIRSTNAME)
            .birthday(UPDATED_BIRTHDAY)
            .email(UPDATED_EMAIL)
            .passworld(UPDATED_PASSWORLD)
            .address(UPDATED_ADDRESS)
            .banckCard(UPDATED_BANCK_CARD)
            .phone(UPDATED_PHONE)
            .points(UPDATED_POINTS);
    }

    @BeforeEach
    public void initTest() {
        subscribedClients = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedSubscribedClients != null) {
            subscribedClientsRepository.delete(insertedSubscribedClients);
            insertedSubscribedClients = null;
        }
    }

    @Test
    @Transactional
    void createSubscribedClients() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the SubscribedClients
        var returnedSubscribedClients = om.readValue(
            restSubscribedClientsMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(subscribedClients)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            SubscribedClients.class
        );

        // Validate the SubscribedClients in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertSubscribedClientsUpdatableFieldsEquals(returnedSubscribedClients, getPersistedSubscribedClients(returnedSubscribedClients));

        insertedSubscribedClients = returnedSubscribedClients;
    }

    @Test
    @Transactional
    void createSubscribedClientsWithExistingId() throws Exception {
        // Create the SubscribedClients with an existing ID
        subscribedClients.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSubscribedClientsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(subscribedClients)))
            .andExpect(status().isBadRequest());

        // Validate the SubscribedClients in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSubscribedClients() throws Exception {
        // Initialize the database
        insertedSubscribedClients = subscribedClientsRepository.saveAndFlush(subscribedClients);

        // Get all the subscribedClientsList
        restSubscribedClientsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(subscribedClients.getId().intValue())))
            .andExpect(jsonPath("$.[*].lastname").value(hasItem(DEFAULT_LASTNAME)))
            .andExpect(jsonPath("$.[*].firstname").value(hasItem(DEFAULT_FIRSTNAME)))
            .andExpect(jsonPath("$.[*].birthday").value(hasItem(DEFAULT_BIRTHDAY.toString())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].passworld").value(hasItem(DEFAULT_PASSWORLD)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].banckCard").value(hasItem(DEFAULT_BANCK_CARD)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSubscribedClientsWithEagerRelationshipsIsEnabled() throws Exception {
        when(subscribedClientsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSubscribedClientsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(subscribedClientsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSubscribedClientsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(subscribedClientsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSubscribedClientsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(subscribedClientsRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getSubscribedClients() throws Exception {
        // Initialize the database
        insertedSubscribedClients = subscribedClientsRepository.saveAndFlush(subscribedClients);

        // Get the subscribedClients
        restSubscribedClientsMockMvc
            .perform(get(ENTITY_API_URL_ID, subscribedClients.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(subscribedClients.getId().intValue()))
            .andExpect(jsonPath("$.lastname").value(DEFAULT_LASTNAME))
            .andExpect(jsonPath("$.firstname").value(DEFAULT_FIRSTNAME))
            .andExpect(jsonPath("$.birthday").value(DEFAULT_BIRTHDAY.toString()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.passworld").value(DEFAULT_PASSWORLD))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.banckCard").value(DEFAULT_BANCK_CARD))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE))
            .andExpect(jsonPath("$.points").value(DEFAULT_POINTS));
    }

    @Test
    @Transactional
    void getNonExistingSubscribedClients() throws Exception {
        // Get the subscribedClients
        restSubscribedClientsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSubscribedClients() throws Exception {
        // Initialize the database
        insertedSubscribedClients = subscribedClientsRepository.saveAndFlush(subscribedClients);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the subscribedClients
        SubscribedClients updatedSubscribedClients = subscribedClientsRepository.findById(subscribedClients.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedSubscribedClients are not directly saved in db
        em.detach(updatedSubscribedClients);
        updatedSubscribedClients
            .lastname(UPDATED_LASTNAME)
            .firstname(UPDATED_FIRSTNAME)
            .birthday(UPDATED_BIRTHDAY)
            .email(UPDATED_EMAIL)
            .passworld(UPDATED_PASSWORLD)
            .address(UPDATED_ADDRESS)
            .banckCard(UPDATED_BANCK_CARD)
            .phone(UPDATED_PHONE)
            .points(UPDATED_POINTS);

        restSubscribedClientsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSubscribedClients.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedSubscribedClients))
            )
            .andExpect(status().isOk());

        // Validate the SubscribedClients in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedSubscribedClientsToMatchAllProperties(updatedSubscribedClients);
    }

    @Test
    @Transactional
    void putNonExistingSubscribedClients() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        subscribedClients.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSubscribedClientsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, subscribedClients.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(subscribedClients))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubscribedClients in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSubscribedClients() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        subscribedClients.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubscribedClientsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(subscribedClients))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubscribedClients in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSubscribedClients() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        subscribedClients.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubscribedClientsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(subscribedClients)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SubscribedClients in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSubscribedClientsWithPatch() throws Exception {
        // Initialize the database
        insertedSubscribedClients = subscribedClientsRepository.saveAndFlush(subscribedClients);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the subscribedClients using partial update
        SubscribedClients partialUpdatedSubscribedClients = new SubscribedClients();
        partialUpdatedSubscribedClients.setId(subscribedClients.getId());

        partialUpdatedSubscribedClients
            .lastname(UPDATED_LASTNAME)
            .firstname(UPDATED_FIRSTNAME)
            .birthday(UPDATED_BIRTHDAY)
            .phone(UPDATED_PHONE)
            .points(UPDATED_POINTS);

        restSubscribedClientsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSubscribedClients.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSubscribedClients))
            )
            .andExpect(status().isOk());

        // Validate the SubscribedClients in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSubscribedClientsUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedSubscribedClients, subscribedClients),
            getPersistedSubscribedClients(subscribedClients)
        );
    }

    @Test
    @Transactional
    void fullUpdateSubscribedClientsWithPatch() throws Exception {
        // Initialize the database
        insertedSubscribedClients = subscribedClientsRepository.saveAndFlush(subscribedClients);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the subscribedClients using partial update
        SubscribedClients partialUpdatedSubscribedClients = new SubscribedClients();
        partialUpdatedSubscribedClients.setId(subscribedClients.getId());

        partialUpdatedSubscribedClients
            .lastname(UPDATED_LASTNAME)
            .firstname(UPDATED_FIRSTNAME)
            .birthday(UPDATED_BIRTHDAY)
            .email(UPDATED_EMAIL)
            .passworld(UPDATED_PASSWORLD)
            .address(UPDATED_ADDRESS)
            .banckCard(UPDATED_BANCK_CARD)
            .phone(UPDATED_PHONE)
            .points(UPDATED_POINTS);

        restSubscribedClientsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSubscribedClients.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSubscribedClients))
            )
            .andExpect(status().isOk());

        // Validate the SubscribedClients in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSubscribedClientsUpdatableFieldsEquals(
            partialUpdatedSubscribedClients,
            getPersistedSubscribedClients(partialUpdatedSubscribedClients)
        );
    }

    @Test
    @Transactional
    void patchNonExistingSubscribedClients() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        subscribedClients.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSubscribedClientsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, subscribedClients.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(subscribedClients))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubscribedClients in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSubscribedClients() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        subscribedClients.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubscribedClientsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(subscribedClients))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubscribedClients in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSubscribedClients() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        subscribedClients.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubscribedClientsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(subscribedClients)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SubscribedClients in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSubscribedClients() throws Exception {
        // Initialize the database
        insertedSubscribedClients = subscribedClientsRepository.saveAndFlush(subscribedClients);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the subscribedClients
        restSubscribedClientsMockMvc
            .perform(delete(ENTITY_API_URL_ID, subscribedClients.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return subscribedClientsRepository.count();
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

    protected SubscribedClients getPersistedSubscribedClients(SubscribedClients subscribedClients) {
        return subscribedClientsRepository.findById(subscribedClients.getId()).orElseThrow();
    }

    protected void assertPersistedSubscribedClientsToMatchAllProperties(SubscribedClients expectedSubscribedClients) {
        assertSubscribedClientsAllPropertiesEquals(expectedSubscribedClients, getPersistedSubscribedClients(expectedSubscribedClients));
    }

    protected void assertPersistedSubscribedClientsToMatchUpdatableProperties(SubscribedClients expectedSubscribedClients) {
        assertSubscribedClientsAllUpdatablePropertiesEquals(
            expectedSubscribedClients,
            getPersistedSubscribedClients(expectedSubscribedClients)
        );
    }
}
