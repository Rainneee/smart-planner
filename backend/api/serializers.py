from rest_framework import serializers
from .models import *

class CampaignSerializer(serializers.ModelSerializer):
  class Meta:
    model = Campaign
    fields = '__all__'