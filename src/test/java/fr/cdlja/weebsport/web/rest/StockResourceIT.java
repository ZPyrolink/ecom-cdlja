package fr.cdlja.weebsport.web.rest;

import static fr.cdlja.weebsport.domain.StockAsserts.*;
import static fr.cdlja.weebsport.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.cdlja.weebsport.IntegrationTest;
import fr.cdlja.weebsport.domain.Stock;
import fr.cdlja.weebsport.domain.enumeration.Color;
import fr.cdlja.weebsport.domain.enumeration.Size;
import fr.cdlja.weebsport.repository.StockRepository;
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
 * Integration tests for the {@link StockResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StockResourceIT {

    private static final Color DEFAULT_COLOR = Color.GREEN;
    private static final Color UPDATED_COLOR = Color.BLACK;

    private static final Size DEFAULT_SIZE = Size.XXS;
    private static final Size UPDATED_SIZE = Size.XS;

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final String ENTITY_API_URL = "/api/stocks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStockMockMvc;

    private Stock stock;

    private Stock insertedStock;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stock createEntity() {
        return new Stock().color(DEFAULT_COLOR).size(DEFAULT_SIZE).quantity(DEFAULT_QUANTITY);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stock createUpdatedEntity() {
        return new Stock().color(UPDATED_COLOR).size(UPDATED_SIZE).quantity(UPDATED_QUANTITY);
    }

    @BeforeEach
    public void initTest() {
        stock = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedStock != null) {
            stockRepository.delete(insertedStock);
            insertedStock = null;
        }
    }

    @Test
    @Transactional
    void createStock() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Stock
        var returnedStock = om.readValue(
            restStockMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(stock)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Stock.class
        );

        // Validate the Stock in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertStockUpdatableFieldsEquals(returnedStock, getPersistedStock(returnedStock));

        insertedStock = returnedStock;
    }

    @Test
    @Transactional
    void createStockWithExistingId() throws Exception {
        // Create the Stock with an existing ID
        stock.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStockMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(stock)))
            .andExpect(status().isBadRequest());

        // Validate the Stock in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllStocks() throws Exception {
        // Initialize the database
        insertedStock = stockRepository.saveAndFlush(stock);

        // Get all the stockList
        restStockMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stock.getId().intValue())))
            .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR.toString())))
            .andExpect(jsonPath("$.[*].size").value(hasItem(DEFAULT_SIZE.toString())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)));
    }

    @Test
    @Transactional
    void getStock() throws Exception {
        // Initialize the database
        insertedStock = stockRepository.saveAndFlush(stock);

        // Get the stock
        restStockMockMvc
            .perform(get(ENTITY_API_URL_ID, stock.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(stock.getId().intValue()))
            .andExpect(jsonPath("$.color").value(DEFAULT_COLOR.toString()))
            .andExpect(jsonPath("$.size").value(DEFAULT_SIZE.toString()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY));
    }

    @Test
    @Transactional
    void getNonExistingStock() throws Exception {
        // Get the stock
        restStockMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStock() throws Exception {
        // Initialize the database
        insertedStock = stockRepository.saveAndFlush(stock);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the stock
        Stock updatedStock = stockRepository.findById(stock.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedStock are not directly saved in db
        em.detach(updatedStock);
        updatedStock.color(UPDATED_COLOR).size(UPDATED_SIZE).quantity(UPDATED_QUANTITY);

        restStockMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStock.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedStock))
            )
            .andExpect(status().isOk());

        // Validate the Stock in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedStockToMatchAllProperties(updatedStock);
    }

    @Test
    @Transactional
    void putNonExistingStock() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        stock.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStockMockMvc
            .perform(put(ENTITY_API_URL_ID, stock.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(stock)))
            .andExpect(status().isBadRequest());

        // Validate the Stock in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStock() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        stock.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStockMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(stock))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stock in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStock() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        stock.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStockMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(stock)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Stock in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStockWithPatch() throws Exception {
        // Initialize the database
        insertedStock = stockRepository.saveAndFlush(stock);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the stock using partial update
        Stock partialUpdatedStock = new Stock();
        partialUpdatedStock.setId(stock.getId());

        partialUpdatedStock.quantity(UPDATED_QUANTITY);

        restStockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStock.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedStock))
            )
            .andExpect(status().isOk());

        // Validate the Stock in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertStockUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedStock, stock), getPersistedStock(stock));
    }

    @Test
    @Transactional
    void fullUpdateStockWithPatch() throws Exception {
        // Initialize the database
        insertedStock = stockRepository.saveAndFlush(stock);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the stock using partial update
        Stock partialUpdatedStock = new Stock();
        partialUpdatedStock.setId(stock.getId());

        partialUpdatedStock.color(UPDATED_COLOR).size(UPDATED_SIZE).quantity(UPDATED_QUANTITY);

        restStockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStock.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedStock))
            )
            .andExpect(status().isOk());

        // Validate the Stock in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertStockUpdatableFieldsEquals(partialUpdatedStock, getPersistedStock(partialUpdatedStock));
    }

    @Test
    @Transactional
    void patchNonExistingStock() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        stock.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, stock.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(stock))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stock in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStock() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        stock.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(stock))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stock in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStock() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        stock.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStockMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(stock)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Stock in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStock() throws Exception {
        // Initialize the database
        insertedStock = stockRepository.saveAndFlush(stock);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the stock
        restStockMockMvc
            .perform(delete(ENTITY_API_URL_ID, stock.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return stockRepository.count();
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

    protected Stock getPersistedStock(Stock stock) {
        return stockRepository.findById(stock.getId()).orElseThrow();
    }

    protected void assertPersistedStockToMatchAllProperties(Stock expectedStock) {
        assertStockAllPropertiesEquals(expectedStock, getPersistedStock(expectedStock));
    }

    protected void assertPersistedStockToMatchUpdatableProperties(Stock expectedStock) {
        assertStockAllUpdatablePropertiesEquals(expectedStock, getPersistedStock(expectedStock));
    }
}
