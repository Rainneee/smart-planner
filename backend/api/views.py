from rest_framework.decorators import api_view
from .models import Campaign
# from django.http import HttpResponse
from rest_framework import viewsets
from .serializers import *

class CampaignViewSet(viewsets.ModelViewSet):
  queryset = Campaign.objects.all()
  serializer_class = CampaignSerializer