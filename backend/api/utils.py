import pandas as pd
import numpy as np
from datetime import datetime
from decimal import Decimal, InvalidOperation
import re

class CampaignDataProcessor:
  COLUMN_MAPPINGS = {
    'client': ['client', 'client_name', 'advertiser', 'brand', 'company'],
    'platform': ['platform', 'channel', 'media_platform', 'ad_platform', 'publisher'],
    'buy_type': ['buy_type', 'buying_type', 'buy_method', 'purchase_type', 'buytype'],
    'objective': ['objective', 'campaign_objective'],
    'placement': ['placement'],
    'cpu_value': ['cpu_value', 'cpu', 'cost_per_unit', 'cpm', 'cpc', 'cpv', 'cpa'],
    'cpu_type': ['cpu_type'],
    'est_kpi': ['est_kpi', 'estimated_kpi', 'kpi'],
    'cost': ['cost', 'total_cost', 'amount'],
    'campaign_name': ['campaign_name', 'campaign', 'name', 'title', 'campaign_title'],
    'start_date': ['start_date', 'start', 'begin_date', 'launch_date', 'from_date'],
    'end_date': ['end_date', 'end', 'finish_date', 'completion_date', 'to_date']
  }
  
  @classmethod
  def clean_column_name(cls, column_name):
    if pd.isna(column_name):
      return ''
    cleaned = str(column_name).lower().strip()
    cleaned = re.sub(r'[^\w\s]', '', cleaned)
    cleaned = re.sub(r'\s+', '_', cleaned)
    cleaned = re.sub(r'_+', '_', cleaned)
    cleaned = cleaned.strip('_')
    
    return cleaned
  
  @classmethod
  def read_file(cls, file):
    try:
      if file.name.lower().endswith('.csv'):
        encodings = ['utf-8', 'latin-1', 'cp1252']
        for encoding in encodings:
          try:
            file.seek(0)
            df = pd.read_csv(file, encoding=encoding, low_memory=False)
            break
          except UnicodeDecodeError:
            continue
        else:
          raise ValueError("Could not decode CSV file with any supported encoding")
      
      elif file.name.lower().endswith(('.xlsx', '.xls')):
        file.seek(0)
        df = pd.read_excel(file, engine='openpyxl' if file.name.endswith('.xlsx') else 'xlrd')
      
      else:
        raise ValueError("Unsupported file format")
      
      df.columns = [cls.clean_column_name(col) for col in df.columns]
      
      return df
    
    except Exception as e:
      raise ValueError(f"Error reading file: {str(e)}")
  
  @classmethod
  def find_numeric_column(cls, df, base_patterns):
    candidates = []
    
    for col in df.columns:
      if any(pattern in col for pattern in base_patterns):
        sample_values = df[col].dropna().head(10)
        numeric_count = 0
        
        for value in sample_values:
          if cls.clean_numeric_value(value) is not None:
            numeric_count += 1
        if len(sample_values) > 0 and (numeric_count / len(sample_values)) > 0.7:
          candidates.append((col, numeric_count / len(sample_values)))
    if candidates:
      return max(candidates, key=lambda x: x[1])[0]
    return None
  
  @classmethod
  def find_string_column(cls, df, base_patterns):
    candidates = []
    
    for col in df.columns:
      if any(pattern in col for pattern in base_patterns):
        sample_values = df[col].dropna().head(10)
        string_count = 0
        
        for value in sample_values:
          if cls.clean_numeric_value(value) is None and pd.notna(value) and str(value).strip():
            string_count += 1
        
        if len(sample_values) > 0 and (string_count / len(sample_values)) > 0.7:
          candidates.append((col, string_count / len(sample_values)))
    if candidates:
      return max(candidates, key=lambda x: x[1])[0]
    return None

  @classmethod
  def find_cpu_columns_by_content(cls, df):
    cpu_value_col = None
    cpu_type_col = None
    cpu_combined_col = None

    potential_cols = []
    for col in df.columns:
      col_name = str(col).lower()
      if 'cpu' in col_name or col_name in ['', 'unnamed', 'column'] or col_name.startswith('unnamed'):
        potential_cols.append(col)
    
    if not potential_cols:
      potential_cols = list(df.columns)
    
    for col in potential_cols:
      if col in [cpu_value_col, cpu_type_col, cpu_combined_col]:
        continue
        
      sample_values = df[col].dropna().head(20)
      if len(sample_values) == 0:
        continue
      
      numeric_count = 0
      cpu_type_count = 0
      combined_count = 0
      
      for value in sample_values:
        str_val = str(value).strip().upper()
        if cls.parse_cpu_value(value)[0] is not None and cls.parse_cpu_value(value)[1] is not None:
          combined_count += 1
        elif cls.clean_numeric_value(value) is not None:
          numeric_count += 1
        elif re.match(r'^CP[A-Z]+$', str_val) or str_val in ['CPR', 'CPC', 'CPM', 'CPA', 'CPV', 'CPCV', 'CPL']:
          cpu_type_count += 1
      
      total_samples = len(sample_values)
      
      if combined_count / total_samples > 0.7 and cpu_combined_col is None:
        cpu_combined_col = col
      elif numeric_count / total_samples > 0.7 and cpu_value_col is None:
        cpu_value_col = col 
      elif cpu_type_count / total_samples > 0.7 and cpu_type_col is None:
        cpu_type_col = col
    
    return cpu_value_col, cpu_type_col, cpu_combined_col

  @classmethod
  def find_kpi_columns_by_content(cls, df):
    kpi_value_col = None
    kpi_combined_col = None

    potential_cols = []
    for col in df.columns:
      col_name = str(col).lower()
      if any(kpi_word in col_name for kpi_word in ['kpi', 'reach', 'impression', 'click', 'view']):
        potential_cols.append(col)

    if not potential_cols:
      potential_cols = list(df.columns)
    
    for col in potential_cols:
      if col in [kpi_value_col, kpi_combined_col]:
        continue
        
      sample_values = df[col].dropna().head(20)
      if len(sample_values) == 0:
        continue
      
      numeric_count = 0
      combined_count = 0
      
      for value in sample_values:
        if cls.parse_kpi_value(value) is not None:
          str_val = str(value).strip()
          if any(sep in str_val for sep in ['|', '-', ':', 'reach', 'impression', 'click', 'view']):
            combined_count += 1
          else:
            numeric_count += 1
        elif cls.clean_numeric_value(value) is not None:
          numeric_count += 1
      
      total_samples = len(sample_values)

      if combined_count / total_samples > 0.7 and kpi_combined_col is None:
        kpi_combined_col = col
      elif numeric_count / total_samples > 0.7 and kpi_value_col is None:
        kpi_value_col = col
    
    return kpi_value_col, kpi_combined_col

  @classmethod
  def clean_numeric_value(cls, value):
    if pd.isna(value) or value == '':
      return None

    str_value = str(value).strip()
    str_value = re.sub(r'[₱$,\s]', '', str_value)
    
    try:
      return float(str_value)
    except (ValueError, TypeError):
      return None
  
  @classmethod
  def parse_cpu_value(cls, value):
    if pd.isna(value) or value == '':
      return None, None
    
    str_value = str(value).strip()

    pattern = r'([₱$]?\s*[\d,]+\.?\d*)\s*([A-Za-z]+)'
    match = re.match(pattern, str_value)
    
    if match:
      numeric_part = match.group(1)
      type_part = match.group(2)
      
      cleaned_numeric = re.sub(r'[₱$,\s]', '', numeric_part)
      try:
        numeric_value = float(cleaned_numeric)
        return numeric_value, type_part.upper()
      except (ValueError, TypeError):
        return None, None
    
    return None, None
  
  @classmethod
  def parse_kpi_value(cls, value):
    if pd.isna(value) or value == '':
      return None
    
    str_value = str(value).strip()
    pattern = r'^([\d,]+\.?\d*)\s*[\|\-\:\s]'
    match = re.match(pattern, str_value)
    
    if match:
      numeric_part = match.group(1)
      cleaned_numeric = re.sub(r'[,\s]', '', numeric_part)
      try:
        return float(cleaned_numeric)
      except (ValueError, TypeError):
        return None
    
    pattern = r'^([\d,]+\.?\d*)'
    match = re.match(pattern, str_value)
    if match:
      numeric_part = match.group(1)
      cleaned_numeric = re.sub(r'[,\s]', '', numeric_part)
      try:
        return float(cleaned_numeric)
      except (ValueError, TypeError):
        return None
    
    return None
  
  @classmethod
  def clean_date_value(cls, value):
    if pd.isna(value) or value == '':
      return None
    
    try:
      if isinstance(value, datetime):
        return value.date()

      date_formats = [
        '%Y-%m-%d', '%m/%d/%Y', '%d/%m/%Y',
        '%Y-%m-%d %H:%M:%S', '%m/%d/%Y %H:%M:%S'
      ]
      
      str_value = str(value).strip()
      for fmt in date_formats:
        try:
          return datetime.strptime(str_value, fmt).date()
        except ValueError:
          continue

      return pd.to_datetime(str_value, errors='coerce').date()
    
    except:
      return None

  @classmethod
  def map_columns(cls, df):
    mapped_columns = {}
    
    cpu_value_col, cpu_type_col, cpu_combined_col = cls.find_cpu_columns_by_content(df)
    if cpu_combined_col:
      mapped_columns['cpu_value'] = cpu_combined_col
      mapped_columns['cpu_type'] = cpu_combined_col
    else:
      if cpu_value_col:
        mapped_columns['cpu_value'] = cpu_value_col
      if cpu_type_col:
        mapped_columns['cpu_type'] = cpu_type_col
    est_kpi_col, kpi_combined_col = cls.find_kpi_columns_by_content(df)
    if kpi_combined_col:
      mapped_columns['est_kpi'] = kpi_combined_col
    elif est_kpi_col:
      mapped_columns['est_kpi'] = est_kpi_col
    
    for model_field, possible_names in cls.COLUMN_MAPPINGS.items():
      if model_field in ['cpu_value', 'cpu_type', 'est_kpi'] and model_field in mapped_columns:
        continue
      
      if model_field in ['cost', 'cpu_value', 'est_kpi']:
        numeric_col = cls.find_numeric_column(df, possible_names)
        if numeric_col and numeric_col not in mapped_columns.values():
          mapped_columns[model_field] = numeric_col

      elif model_field == 'cpu_type':
        if 'cpu_type' not in mapped_columns:
          type_col = cls.find_string_column(df, possible_names)
          if type_col and type_col not in mapped_columns.values():
            mapped_columns[model_field] = type_col

      else:
        for col in df.columns:
          if col not in mapped_columns.values():
            if any(possible_name in col for possible_name in possible_names):
              mapped_columns[model_field] = col
              break
    
    return mapped_columns
  
  @classmethod
  def process_dataframe(cls, df):
    column_mapping = cls.map_columns(df)
    
    required_fields = ['client', 'platform', 'campaign_name', 'cost']
    missing_required = [field for field in required_fields if field not in column_mapping]
    
    if missing_required:
      available_columns = list(df.columns)
      raise ValueError(
        f"Missing required columns: {', '.join(missing_required)}. "
        f"Available columns: {', '.join(available_columns)}"
      )
    
    processed_data = []
    validation_errors = []
    
    for index, row in df.iterrows():
      row_number = index + 2
      campaign_data = {}
      row_errors = []
      
      for model_field, df_column in column_mapping.items():
        value = row[df_column]
        
        try:
          if model_field == 'cpu_value':
            if column_mapping.get('cpu_type') == df_column:
              parsed_numeric, parsed_type = cls.parse_cpu_value(value)
              if parsed_numeric is not None:
                campaign_data[model_field] = Decimal(str(parsed_numeric))
              elif model_field in required_fields:
                row_errors.append(f"Row {row_number}: {model_field} is required")
            else:
              cleaned_value = cls.clean_numeric_value(value)
              if cleaned_value is None and model_field in required_fields:
                row_errors.append(f"Row {row_number}: {model_field} is required")
              elif cleaned_value is not None:
                campaign_data[model_field] = Decimal(str(cleaned_value))
          
          elif model_field == 'cpu_type':
            if column_mapping.get('cpu_value') == df_column:
              parsed_numeric, parsed_type = cls.parse_cpu_value(value)
              if parsed_type is not None:
                campaign_data[model_field] = parsed_type
            else:
              if pd.notna(value) and str(value).strip():
                campaign_data[model_field] = str(value).strip().upper()
          
          elif model_field == 'est_kpi':
            parsed_kpi = cls.parse_kpi_value(value)
            if parsed_kpi is not None:
              campaign_data[model_field] = Decimal(str(parsed_kpi))
            else:
              cleaned_value = cls.clean_numeric_value(value)
              if cleaned_value is not None:
                campaign_data[model_field] = Decimal(str(cleaned_value))
          
          elif model_field == 'cost':
            cleaned_value = cls.clean_numeric_value(value)
            if cleaned_value is None and model_field in required_fields:
              row_errors.append(f"Row {row_number}: {model_field} is required")
            elif cleaned_value is not None:
              campaign_data[model_field] = Decimal(str(cleaned_value))
          
          elif model_field in ['start_date', 'end_date']:
            cleaned_value = cls.clean_date_value(value)
            if cleaned_value:
              campaign_data[model_field] = cleaned_value
          
          else:
            if pd.notna(value) and str(value).strip():
              campaign_data[model_field] = str(value).strip()
            elif model_field in required_fields:
              row_errors.append(f"Row {row_number}: {model_field} is required")
        
        except (ValueError, InvalidOperation) as e:
          row_errors.append(f"Row {row_number}: Invalid {model_field} value '{value}'")

      if 'start_date' in campaign_data and 'end_date' in campaign_data:
        if campaign_data['start_date'] > campaign_data['end_date']:
          row_errors.append(f"Row {row_number}: Start date cannot be after end date")
      
      if row_errors:
        validation_errors.extend(row_errors)
      else:
        processed_data.append(campaign_data)
    
    return processed_data, validation_errors
  
  @classmethod
  def get_column_mapping_report(cls, df):
    column_mapping = cls.map_columns(df)
    
    report = {
      'mapped_columns': column_mapping,
      'unmapped_columns': [col for col in df.columns if col not in column_mapping.values()],
      'missing_required': [field for field in ['client', 'platform', 'campaign_name', 'cost'] 
                if field not in column_mapping]
    }
    
    return report