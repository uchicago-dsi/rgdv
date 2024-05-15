# %%
import pandas as pd
from os import path
# msgpack
import msgpack
import numpy as np
import gzip
# pd remove col limit
pd.set_option('display.max_columns', None)
# %%
current_dir = path.dirname(path.abspath(__file__))
data_dir = path.join(current_dir, '..', 'public', 'data')
# %%
# %%
year = '2023'

def make_county_and_state_cols(filepath, id_col="GEOID"):
  df = pd.read_parquet(filepath)
  df['county'] = df[id_col].str.slice(0, 5)
  df['state'] = df[id_col].str.slice(0, 2)
  return df


def get_percentile(df, col, na_val=None):
  if na_val:
    df[col] = df[col].fillna(na_val)
  df[col] = pd.to_numeric(df[col], errors='coerce')
  # not null
  df.loc[df[col].notnull(), 'percentile'] = df[col].rank(pct=True)
  # Convert the percentile rank to cover the range 0-100 instead of 0-1.
  df.loc[df[col].notnull(), 'percentile'] = round(df.loc[df[col].notnull(), 'percentile']*100)
  return df

def get_state_percentile(df, col, id_col, na_val=None):
  if na_val:
    df[col] = df[col].fillna(na_val)
  df[col] = pd.to_numeric(df[col], errors='coerce')
  states = df[id_col].str.slice(0,2).unique()
  for state in states:
    # not null
    loc_filter = (df[col].notnull()) & (df[id_col].str.slice(0,2) == state)
    df.loc[loc_filter, 'state_percentile'] = df.loc[loc_filter, col].rank(pct=True)
    df.loc[loc_filter, 'state_percentile'] *= 100
    df.loc[loc_filter, 'state_percentile'] = round(df.loc[loc_filter, 'state_percentile'])
  return df

def get_county_percentile(df, col, id_col, na_val=None):
  if na_val:
    df[col] = df[col].fillna(na_val)
  df[col] = pd.to_numeric(df[col], errors='coerce')
  counties = df[id_col].str.slice(0,5).unique()
  for county in counties:
    # not null
    loc_filter = (df[col].notnull()) & (df[id_col].str.slice(0,5) == county)
    df.loc[loc_filter, 'county_percentile'] = df.loc[loc_filter, col].rank(pct=True)
    df.loc[loc_filter, 'county_percentile'] *= 100
    df.loc[loc_filter, 'county_percentile'] = round(df.loc[loc_filter, 'county_percentile'])
  return df

debug_county = '13155'

def generate_stats(
    df_filepath,
    demog_filepath, 
    level, 
    id_col, 
    demog_id_col,
    data_col, 
    population_col,
    prefix,
    DEBUG=None
  ):
  df = make_county_and_state_cols(df_filepath)
  demog = make_county_and_state_cols(demog_filepath)
  df = df.merge(demog, how='left', on=[id_col, 'state', 'county'])
  df[data_col] = pd.to_numeric(df[data_col], errors='coerce').fillna(0)
  df[population_col] = pd.to_numeric(df[population_col], errors='coerce').fillna(0)

  weighted_col = f"{data_col}_weighted"
  df[weighted_col] = df[data_col] * df[population_col]

  df_agg = df[[id_col,data_col,population_col,weighted_col]].groupby(id_col).sum().reset_index()
  df_agg[weighted_col] = df_agg[weighted_col] / df_agg[population_col]
  df_agg = get_percentile(df_agg, weighted_col)
  df_agg = df_agg.drop(columns=[data_col, population_col])

  if DEBUG:
    return {
      "joined": df.query(f"{id_col} == '{debug_county}'"),
      "agg":  df_agg.query(f"{id_col} == '{debug_county}'"),
      "pctile": df_agg.query(f"{id_col} == '{debug_county}'")
  }

  out_cols = [
      id_col, 
      f"{prefix}_{data_col}" if level == 'tract' else f"{prefix}_{data_col}_weighted", 
      f"{prefix}_{year}_percentile", 
      f"{prefix}_{year}_state_percentile", 
      f"{prefix}_{year}_county_percentile"
    ] 
  
  if level != 'state':
    df_agg = get_state_percentile(df_agg, weighted_col, id_col)

  if level == 'tract':
    df_agg = get_county_percentile(df_agg, weighted_col, id_col)
  print(df_agg.columns)
  df_agg.columns = out_cols[:len(df_agg.columns)]
  return df_agg

def to_msgpack(df, outpath, id_col):
  data_dict = {}
  for index, row in df.iterrows():
    data_dict[row[id_col]] = row.to_dict()
  with open(outpath, 'wb') as f:
    packed = msgpack.packb(data_dict)
    f.write(packed)


def open_msgpack(filepath):
  with open(filepath, 'rb') as f:
    return msgpack.unpackb(f.read())

def write_msgpack(data, filepath, compress=False):
  packed = msgpack.packb(data)
  if compress:
    with gzip.open(filepath.replace(".msgpack", ".min.msgpack.gz"), 'wb') as f:
      f.write(packed)
  else:
    with open(filepath.replace(".msgpack", ".min.msgpack"), 'wb') as f:
      f.write(packed)

def columnarize_msgpack(data, id_col, filepath, cols, compress=False):
  print('Columnarizing ', len(data), ' rows')
  data_min = {
    "columns": cols
  }
  for row in range(len(data)):
    values = data[row]
    id = values[id_col]
    data_min[id] = []
    for col in cols:
      data_min[id].append(values[col])
  try:
    write_msgpack(data_min, filepath, compress)
  except Exception as e: 
    print('Error writing ', filepath)
    print(e)
    return data_min
  
def split_df_and_msgpack(df, id_col, outpath, compress=False):
  columns = list(df.columns)
  df['state'] = df[id_col].str.slice(0, 2)
  unique_states = df['state'].unique()
  for state in unique_states:
    state_data = df[df['state'] == state].to_dict(orient='records')
    columnarize_msgpack(state_data, id_col, path.join(outpath, f'{state}.msgpack'), columns, compress=compress)

# %%
gravity_county = generate_stats(
  path.join(data_dir, 'gravity_dollar_pivoted.parquet'),
  path.join(data_dir, 'demography_tract.parquet'),
  "county",
  "county",
  "county",
  year,
  "TOTAL_POPULATION",
  "gravity",
)

hhi_county = generate_stats(
  path.join(data_dir, 'concentration_metrics_wide_ds.parquet'),
  path.join(data_dir, 'demography_tract.parquet'),
  "county",
  "county",
  "county",
  year,
  "TOTAL_POPULATION",
  "hhi"
)

segregation_county = generate_stats(
  path.join(data_dir, 'sdoh.parquet'),
  path.join(data_dir, 'demography_tract.parquet'),
  "county",
  "county",
  "county",
  "ICE_Black_Alone_White_Alone",
  "TOTAL_POPULATION",
  "segregation"
)
# %%
county_demography = pd.read_parquet(path.join(data_dir, 'demography_county.parquet'))
county_adi = pd.read_parquet(path.join(data_dir, 'adi', '2021_counties.parquet'))
# %%
county_joined = gravity_county.merge(hhi_county, how='left', on="county")\
  .merge(segregation_county, how='left', on="county")\
  .merge(county_demography, how='left', left_on="county", right_on="GEOID")\
  .merge(county_adi, how='left', left_on="county", right_on="COUNTY")\
  .drop(columns=["COUNTY"])
# %%
split_df_and_msgpack(
  county_joined,
  'county',
  path.join(data_dir, 'summary', 'county'),
  compress=True
)
# %%

gravity_tract = generate_stats(
  path.join(data_dir, 'gravity_no_dollar_pivoted.parquet'),
  path.join(data_dir, 'demography_tract.parquet'),
  "tract",
  "GEOID",
  "GEOID",
  '2021',
  "TOTAL_POPULATION",
  "gravity"
)
hhi_tract = generate_stats(
  path.join(data_dir, 'concentration_metrics_wide.parquet'),
  path.join(data_dir, 'demography_tract.parquet'),
  "tract",
  "GEOID",
  "GEOID",
  '2023',
  "TOTAL_POPULATION",
  "hhi"
)

segregation_tract = generate_stats(
  path.join(data_dir, 'sdoh.parquet'),
  path.join(data_dir, 'demography_tract.parquet'),
  "tract",
  "GEOID",
  "GEOID",
  "ICE_Black_Alone_White_Alone",
  "TOTAL_POPULATION",
  "segregation"
)
# %%
tract_demography = pd.read_parquet(path.join(data_dir, 'demography_tract.parquet'))
tract_adi = pd.read_parquet(path.join(data_dir, 'adi', '2021_tracts.parquet'))
# %%
tract_joined = gravity_tract.merge(hhi_tract, how='outer', on="GEOID")\
  .merge(segregation_tract, how='outer', on="GEOID")\
  .merge(tract_demography, how='outer', on="GEOID")\
  .merge(tract_adi, how='outer', left_on="GEOID", right_on="FIPS")
# %%
def get_full_data(path, column_dict, out_cols=["GEOID"]):
  df = pd.read_parquet(path)
  for key, value in column_dict.items():
    df = df.rename(columns={key: value})
  cols_out = list(column_dict.values()) + out_cols
  return df[cols_out]

gravity_full_ds = get_full_data(
  path.join(data_dir, 'gravity_dollar_pivoted.parquet'),
  {
    '2000': 'gravity_ds_2000',
    '2010': 'gravity_ds_2010',
    '2020': 'gravity_ds_2020'
  }
)

gravity_full = get_full_data(
  path.join(data_dir, 'gravity_no_dollar_pivoted.parquet'),
  {
    '2000': 'gravity_2000',
    '2010': 'gravity_2010',
    '2020': 'gravity_2020'
  }
)
hhi_full_ds = get_full_data(
  path.join(data_dir, 'concentration_metrics_wide_ds.parquet'),
  {
    '2000': 'hhi_ds_2000',
    '2010': 'hhi_ds_2010',
    '2020': 'hhi_ds_2020'
  }
)

hhi_full = get_full_data(
  path.join(data_dir, 'concentration_metrics_wide.parquet'),
  {
    '2000': 'hhi_2000',
    '2010': 'hhi_2010',
    '2020': 'hhi_2020'
  }
)
sdoh_full = get_full_data(
  path.join(data_dir, 'sdoh.parquet'),
  {
    'ICE_Black_Alone_White_Alone': 'ICE_Black_Alone_White_Alone',
    'ICE_Hispanic_NH_White_Alone': 'ICE_Hispanic_NH_White_Alone'
  }
)
# %%
full_out = tract_joined.merge(gravity_full, how='left', on="GEOID")\
  .merge(gravity_full_ds, how='left', on="GEOID")\
  .merge(hhi_full_ds, how='left', on="GEOID")\
  .merge(hhi_full, how='left', on="GEOID")\
  .merge(sdoh_full, how='left', on="GEOID")\
  .drop(columns=["FIPS"])
# %%
full_out.to_parquet(path.join(data_dir, 'full_tract.parquet'), compression='gzip')
# %%
columnarize_msgpack(
  tract_joined.to_dict(orient="records"), 
  "GEOID", 
  path.join(data_dir, f'tract_full.msgpack'), 
  list(tract_joined.columns), 
  compress=True
)
# %%
# %%
split_df_and_msgpack(
  tract_joined,
  'GEOID',
  path.join(data_dir, 'summary', 'tract'),
  compress=True
)
# %%

gravity_state = generate_stats(
  path.join(data_dir, 'gravity_dollar_pivoted.parquet'),
  path.join(data_dir, 'demography_tract.parquet'),
  "state",
  "state",
  'state',
  year,
  'TOTAL_POPULATION',
  "gravity"
)
hhi_state = generate_stats(
  path.join(data_dir, 'concentration_metrics_wide_ds.parquet'),

  path.join(data_dir, 'demography_tract.parquet'),
  "state",
  "state",
  'state',
  year,
  'TOTAL_POPULATION',
  "hhi"
)

segregation_state = generate_stats(
  path.join(data_dir, 'sdoh.parquet'),

  path.join(data_dir, 'demography_tract.parquet'),
  "state",
  "state",
  'state',
  "ICE_Black_Alone_White_Alone",
  'TOTAL_POPULATION',
  "segregation"
)
# %%
state_demog = pd.read_parquet(path.join(data_dir, 'demography_state.parquet'))
state_adi = pd.read_parquet(path.join(data_dir, 'adi', '2021_states.parquet'))
# %%
state_joined = gravity_state.merge(hhi_state, how='outer', on="state")\
  .merge(segregation_state, how='outer', on="state")\
  .merge(state_demog, how='outer', left_on='state', right_on="GEOID")\
  .merge(state_adi, how='outer', left_on='state', right_on="STATE")
# %%
split_df_and_msgpack(
  state_joined,
  'state',
  path.join(data_dir, 'summary', 'state'),
  compress=True
)
# %%
demog_tract = pd.read_parquet(path.join(data_dir, 'demography_tract.parquet'))
# %%
