package fr.cdlja.weebsport.web.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.cdlja.weebsport.repository.UserRepository;
import fr.cdlja.weebsport.service.BasketService;
import fr.cdlja.weebsport.service.SubscribedClientsService;
import fr.cdlja.weebsport.service.UserService;
import fr.cdlja.weebsport.service.dto.PaymentDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/basket")
@Transactional
public class BasketResource {

    private static final Logger LOG = LoggerFactory.getLogger(BasketResource.class);

    private final BasketService basketService;
    private final UserRepository userRepository;
    private final UserService userService;
    private final SubscribedClientsService subscribedClientsService;
    private final ObjectMapper jacksonObjectMapper;

    public BasketResource(
        BasketService basketService,
        UserRepository userRepository,
        UserService userService,
        SubscribedClientsService subscribedClientsService,
        ObjectMapper jacksonObjectMapper
    ) {
        this.basketService = basketService;
        this.userRepository = userRepository;
        this.userService = userService;
        this.subscribedClientsService = subscribedClientsService;
        this.jacksonObjectMapper = jacksonObjectMapper;
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> ajouterArticle(@PathVariable(value = "id", required = false) final long articleId) {
        try {
            basketService.ajouterArticle(articleId);
            return ResponseEntity.ok("Article ajouté avec succès");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimerArticle(@PathVariable(value = "id", required = false) final long articleId) {
        try {
            basketService.supprimerArticle(articleId);
            return ResponseEntity.ok("Article supprimé avec succès");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/price")
    public ResponseEntity<Float> basketPrice() {
        return userService
            .getUserWithAuthorities()
            .map(user -> ResponseEntity.ok(basketService.price(user)))
            .orElse(ResponseEntity.badRequest().header("Error-Message", "The user was not found").build());
    }

    @PostMapping("/pay")
    public ResponseEntity<String> pay(@RequestBody PaymentDTO payment) throws InterruptedException, JsonProcessingException {
        LOG.debug(jacksonObjectMapper.writeValueAsString(payment));

        BasketService.PaymentResult result = basketService.pay(
            payment.getCardNum(),
            payment.getMonth(),
            payment.getYear(),
            payment.getCrypto(),
            payment.getBasket()
        );
        return ResponseEntity.status(result.status).body(result.msg);
    }
}
