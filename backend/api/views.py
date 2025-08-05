from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction
from .models import Campaign
from .serializers import *
from .utils import CampaignDataProcessor

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload(self, request):
      serializer = CampaignUploadSerializer(data=request.data)
      if not serializer.is_valid():
         return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
         )
      file = serializer.validated_data['file']

      try:
        df = CampaignDataProcessor.read_file(file)
        processed_data, validation_errors = CampaignDataProcessor.process_dataframe(df)

        if validation_errors:
          return Response(
              {
                'message': 'Validation failed',
                'validation_errors': validation_errors,
                'processed_count': 0
              }, status=status.HTTP_400_BAD_REQUEST
          )
        if not processed_data:
          return Response({
              'message': 'No valid campaign data found in file',
              'validation_errors': [],
              'processed_count': 0
          }, status=status.HTTP_400_BAD_REQUEST)
        
        bulk_serializer = BulkCampaignSerializer(data=processed_data, many=True)

        if not bulk_serializer.is_valid():
          return Response({
              'message': 'Data validation failed',
              'validation_errors': bulk_serializer.errors,
              'processed_count': 0
          })
        
        with transaction.atomic():
          campaigns = bulk_serializer.save()

        return Response({
          'message': f'Successfully uploaded {len(campaigns)} campaigns',
          'processed_count': len(campaigns),
          'validation_errors': [],
          'campaigns': CampaignSerializer(campaigns, many=True).data
        }, status=status.HTTP_201_CREATED)

      except Exception as e:
        return Response({
           'message': f'File processing failed: {str(e)}',
           'validation_errors': [],
           'processed_count': 0
        }, status=status.HTTP_400_BAD_REQUEST)