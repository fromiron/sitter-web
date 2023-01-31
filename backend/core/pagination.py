from rest_framework.pagination import PageNumberPagination


class ListPageNumberPagination(PageNumberPagination):
    page_size = 10
