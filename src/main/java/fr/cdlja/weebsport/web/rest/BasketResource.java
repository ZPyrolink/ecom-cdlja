package fr.cdlja.weebsport.web.rest;

import fr.cdlja.weebsport.repository.UserRepository;
import fr.cdlja.weebsport.security.SecurityUtils;
import fr.cdlja.weebsport.service.BasketService;
import fr.cdlja.weebsport.service.SubscribedClientsService;
import fr.cdlja.weebsport.service.dto.OrderDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/basket")
@Transactional
public class BasketResource {

    private final BasketService basketService;
    private final UserRepository userRepository;
    private final SubscribedClientsService subscribedClientsService;

    public BasketResource(BasketService basketService, UserRepository userRepository, SubscribedClientsService subscribedClientsService) {
        this.basketService = basketService;
        this.userRepository = userRepository;
        this.subscribedClientsService = subscribedClientsService;
    }

    @GetMapping("")
    public ResponseEntity<OrderDTO> getPanier() {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not logged in"));

        String userEmail = userRepository
            .findOneByLogin(userLogin)
            .orElseThrow(() -> new RuntimeException("User not found with login: " + userLogin))
            .getEmail();

        OrderDTO panierDTO = subscribedClientsService.getBasket(userEmail);

        return ResponseEntity.ok(panierDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> ajouterArticle(@PathVariable(value = "id", required = false) final long articleId) {
        try {
            OrderDTO panier = basketService.ajouterArticle(articleId);
            return ResponseEntity.ok(panier);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // 200 OK
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<OrderDTO> supprimerArticle(@PathVariable(value = "id", required = false) final long articleId) {
        try {
            OrderDTO panier = basketService.supprimerArticle(articleId);
            return ResponseEntity.ok(panier);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // 200 OK
        }
    }
}
