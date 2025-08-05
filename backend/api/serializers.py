from rest_framework import serializers
from .models import *

class CampaignSerializer(serializers.ModelSerializer):
  class Meta:
    model = Campaign
    fields = '__all__'

class CampaignUploadSerializer(serializers.Serializer):
  file = serializers.FileField()
  
  def validate_file(self, value):
    if not value.name.lower().endswith(('.csv', '.xlsx', '.xls')):
      raise serializers.ValidationError(
        "Invalid file format. Only CSV and Excel files are supported."
      )
    
    return value

class BulkCampaignCreateSerializer(serializers.ListSerializer):
  def create(self, validated_data):
    campaigns = [Campaign(**item) for item in validated_data]
    return Campaign.objects.bulk_create(campaigns, ignore_conflicts=False)

class BulkCampaignSerializer(serializers.ModelSerializer):
  class Meta:
    model = Campaign
    fields = [
      'client', 'platform', 'buy_type', 'objective', 'placement',
      'cpu_value', 'cpu_type', 'est_kpi', 'cost', 'campaign_name',
      'start_date', 'end_date'
    ]
    list_serializer_class = BulkCampaignCreateSerializer
  
  def validate_cpu_value(self, value):
    if value <= 0:
      raise serializers.ValidationError("CPU value must be greater than 0")
    return value
  
  def validate_cost(self, value):
    if value <= 0:
      raise serializers.ValidationError("Cost must be greater than 0")
    return value
  
  def validate(self, data):
    if data.get('start_date') and data.get('end_date'):
      if data['start_date'] > data['end_date']:
        raise serializers.ValidationError(
          "Start date cannot be after end date"
        )
    return data
