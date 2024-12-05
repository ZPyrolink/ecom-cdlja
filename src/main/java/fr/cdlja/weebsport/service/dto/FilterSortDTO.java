package fr.cdlja.weebsport.service.dto;

import fr.cdlja.weebsport.domain.enumeration.Sort;

public class FilterSortDTO {

    private FilterDTO filter;
    private String search;
    private Sort sort;

    public FilterDTO getFilter() {
        return filter;
    }

    public void setFilter(FilterDTO filter) {
        this.filter = filter;
    }

    public String getSearch() {
        return search;
    }

    public void setSearch(String search) {
        this.search = search;
    }

    public Sort getSort() {
        return sort;
    }

    public void setSort(Sort sort) {
        this.sort = sort;
    }
}
