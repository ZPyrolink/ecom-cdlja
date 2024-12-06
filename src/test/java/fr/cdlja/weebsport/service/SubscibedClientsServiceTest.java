package fr.cdlja.weebsport.service;

import static org.junit.jupiter.api.Assertions.*;

import fr.cdlja.weebsport.domain.*;
import fr.cdlja.weebsport.domain.enumeration.Color;
import fr.cdlja.weebsport.domain.enumeration.Size;
import fr.cdlja.weebsport.domain.enumeration.Status;
import fr.cdlja.weebsport.domain.enumeration.Type;
import fr.cdlja.weebsport.repository.OrderLineRepository;
import fr.cdlja.weebsport.repository.StockRepository;
import fr.cdlja.weebsport.repository.SubscribedClientsRepository;
import fr.cdlja.weebsport.service.dto.OrderDTO;
import fr.cdlja.weebsport.service.dto.OrderlineDTO;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

@ExtendWith(MockitoExtension.class)
public class SubscibedClientsServiceTest {

    @Mock
    private SubscribedClientsRepository subscribedClientsRepository;

    @Mock
    private OrderLineRepository orderLineRepository;

    @Mock
    private StockRepository stockRepository;

    @InjectMocks
    private SubscribedClientsService subscribedClientsService;

    @Test
    void shouldReturnBasketWithTwoOrderLines() throws Exception {
        Map<Long, List<OrderLine>> orderToOrderLinesDatabase = new HashMap<>(); // Order → List<OrderLine>
        Map<Long, Stock> orderLineToStockDatabase = new HashMap<>(); // OrderLine → Stock
        Map<Long, Clothe> stockToClotheDatabase = new HashMap<>(); // Stock → Clothe
        // Mock du client et du panier
        SubscribedClients client = new SubscribedClients();
        client.setEmail("test@example.com");
        Order basket = new Order();
        basket.setId(1L);
        basket.setStatus(Status.BASKET);
        basket.setAmount(100.0f);
        client.setBasket(basket);

        Mockito.when(subscribedClientsRepository.findByEmail("test@example.com")).thenReturn(Optional.of(client));

        OrderLine orderLine1 = new OrderLine();
        orderLine1.setId(101L);
        OrderLine orderLine2 = new OrderLine();
        orderLine2.setId(102L);
        orderToOrderLinesDatabase.put(basket.getId(), List.of(orderLine1, orderLine2));

        Stock stock1 = new Stock();
        stock1.setId(201L); // ID du stock
        orderLineToStockDatabase.put(orderLine1.getId(), stock1);

        Stock stock2 = new Stock();
        stock2.setId(202L); // ID du stock
        orderLineToStockDatabase.put(orderLine2.getId(), stock2);

        Clothe clothe1 = new Clothe();
        clothe1.setId(301L); // ID du vêtement
        stock1.setClothe(clothe1);
        orderLine1.setStock(stock1);
        stockToClotheDatabase.put(stock1.getId(), clothe1);

        Clothe clothe2 = new Clothe();
        clothe2.setId(302L); // ID du vêtement
        stock2.setClothe(clothe2);
        orderLine2.setStock(stock2);
        stockToClotheDatabase.put(stock2.getId(), clothe2);

        // Configurer getlines pour retourner les lignes de commande d'une commande
        Mockito.when(orderLineRepository.getlines(Mockito.anyLong(), Mockito.any(Pageable.class))).thenAnswer(invocation -> {
            Long orderId = invocation.getArgument(0);
            Pageable pageable = invocation.getArgument(1);
            List<OrderLine> orderLines = orderToOrderLinesDatabase.get(orderId);
            if (orderLines == null) return Page.empty(pageable);
            return new PageImpl<>(orderLines, pageable, orderLines.size());
        });

        // Configurer getArticle pour retourner le Stock associé à une OrderLine
        Mockito.when(orderLineRepository.getArticle(Mockito.anyLong())).thenAnswer(invocation -> {
            Long orderLineId = invocation.getArgument(0);
            return orderLineToStockDatabase.get(orderLineId);
        });

        // Configurer getClothe pour retourner le Clothe associé à un Stock
        Mockito.when(stockRepository.getClothe(Mockito.anyLong())).thenAnswer(invocation -> {
            Long stockId = invocation.getArgument(0);
            return stockToClotheDatabase.get(stockId);
        });

        // Exécuter la méthode
        OrderDTO basketDTO = subscribedClientsService.getBasket("test@example.com");

        // Vérifier le résultat
        assertNotNull(basketDTO);
        assertEquals(2, basketDTO.getOrderLines().size());
        assertEquals(1L, basketDTO.getId());
        assertEquals(100.0f, basketDTO.getAmount());

        // Vérifier la première ligne de commande
        OrderlineDTO line1 = basketDTO.getOrderLines().get(0);
        assertEquals(101L, line1.getId());
        assertEquals(201L, line1.getStockDTO().getId());
        assertEquals(301L, line1.getStockDTO().getClotheDTO().getId());

        // Vérifier la deuxième ligne de commande
        OrderlineDTO line2 = basketDTO.getOrderLines().get(1);
        assertEquals(102L, line2.getId());
        assertEquals(202L, line2.getStockDTO().getId());
        assertEquals(302L, line2.getStockDTO().getClotheDTO().getId());
    }

    @Test
    void shouldReturnEmptyBasketWhenNoOrderLines() throws Exception {
        // Mock du client avec un panier vide
        SubscribedClients client = new SubscribedClients();
        client.setEmail("test@example.com");

        Order basket = new Order();
        basket.setId(1L);
        basket.setStatus(Status.BASKET);
        basket.setAmount(100.0f);

        client.setBasket(basket);

        Mockito.when(subscribedClientsRepository.findByEmail("test@example.com")).thenReturn(Optional.of(client));

        // Mock pour simuler l'absence de lignes de commande
        Page<OrderLine> orderLines = new PageImpl<>(List.of(), PageRequest.of(0, 6), 0);
        Mockito.when(orderLineRepository.getlines(1L, PageRequest.of(0, 6, Sort.by("id").ascending()))).thenReturn(orderLines);

        // Exécuter la méthode
        OrderDTO basketDTO = subscribedClientsService.getBasket("test@example.com");

        // Vérifier le résultat
        assertNotNull(basketDTO);
        assertTrue(basketDTO.getOrderLines().isEmpty());
        assertEquals(0, basketDTO.getTotalElements());
    }

    @Test
    void shouldThrowExceptionWhenClientNotFound() {
        // Mock pour simuler l'absence du client
        Mockito.when(subscribedClientsRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> {
            subscribedClientsService.getBasket("test@example.com");
        });

        assertEquals("Client not found for email: test@example.com", exception.getMessage());
    }
}
