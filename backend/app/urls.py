from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView
)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='api-schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='api-schema'),
         name='api-docs'),
    path('api/customer/', include('customer.urls')),
    path('api/pet/', include('pet.urls')),
    path("api/auth/", include("dj_rest_auth.urls")),  # 追加
    path("api/social/", include("social.urls")),  # 追加
]
