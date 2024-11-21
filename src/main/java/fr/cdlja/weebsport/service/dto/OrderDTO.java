package fr.cdlja.weebsport.service.dto;

import fr.cdlja.weebsport.domain.enumeration.MeansOfPayment;
import fr.cdlja.weebsport.domain.enumeration.Status;
import java.util.Date;
import java.util.List;

public class OrderDTO {

    private Long id;
    private Status status;
    private Date date;
    private Float amount;
    private String deliveryAddress;
    private MeansOfPayment meansOfPayment;
    private List<OrderlineDTO> articles;
}
