from django.db import models

class Campaign(models.Model):
  client = models.CharField(max_length=255)
  platform = models.CharField(max_length=255)
  buy_type = models.CharField(max_length=255)
  objective = models.CharField(max_length=255)
  placement = models.CharField(max_length=255)
  cpu_value = models.DecimalField(max_digits=10, decimal_places=2)
  cpu_type = models.CharField(max_length=10)
  est_kpi = models.IntegerField()
  cost = models.DecimalField(max_digits=12, decimal_places=2)
  campaign_name = models.CharField(max_length=255)
  start_date = models.DateField()
  end_date = models.DateField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    ordering = ['created_at']

  def __str__(self):
    return f"{self.client} {self.campaign_name}"
