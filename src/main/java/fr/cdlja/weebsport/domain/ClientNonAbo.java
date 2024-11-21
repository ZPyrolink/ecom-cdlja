package fr.cdlja.weebsport.domain;

public class ClientNonAbo extends AbstractClient {

    @Override
    public String gettypeClient() {
        return "nonAbonné";
    }
}
