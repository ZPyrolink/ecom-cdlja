package fr.cdlja.weebsport.service.dto;

public class FilterSortDTO {

    private FilterDTO filters;
    private String search;
    private String sort;

    public FilterDTO getFilters() {
        return filters;
    }

    public void setFilter(FilterDTO filter) {
        this.filters = filter;
    }

    public String getSearch() {
        return search;
    }

    public void setSearch(String search) {
        this.search = search;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }
}
