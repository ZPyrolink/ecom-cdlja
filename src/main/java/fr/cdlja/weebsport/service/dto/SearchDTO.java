package fr.cdlja.weebsport.service.dto;

public class SearchDTO {

    private String search;

    public SearchDTO() {}

    public SearchDTO(String search) {
        this.search = search;
    }

    public String getSearch() {
        return search;
    }

    public void setSearch(String search) {
        this.search = search;
    }
}
