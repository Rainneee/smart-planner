from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import CampaignViewSet

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet, basename='campaign')
urlpatterns = router.urls