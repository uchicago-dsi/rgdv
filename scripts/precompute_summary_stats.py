# %%
import pandas as pd
from os import path
# msgpack
import msgpack
# %%
current_dir = path.dirname(path.abspath(__file__))
data_dir = path.join(current_dir, '..', 'public', 'data')
# %%
year = '2021'

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

def generate_stats(filepath, level, id_col, data_col, prefix):
  df = make_county_and_state_cols(filepath)
  df_agg = df[[id_col,data_col]].groupby(id_col).median().reset_index()
  df_agg = get_percentile(df_agg, data_col)
  out_cols = [
      id_col, f"{prefix}_{year}", f"{prefix}_{year}_percentile", f"{prefix}_{year}_state_percentile", f"{prefix}_{year}_county_percentile"
    ]
  if level != 'state':
    df_agg = get_state_percentile(df_agg, data_col, id_col)
  if level == 'tract':
    df_agg = get_county_percentile(df_agg, data_col, id_col)
  df_agg.columns = out_cols[:len(df_agg.columns)]
  return df_agg

def to_msgpack(df, outpath, id_col):
  data_dict = {}
  for index, row in df.iterrows():
    data_dict[row[id_col]] = row.to_dict()
  with open(outpath, 'wb') as f:
    packed = msgpack.packb(data_dict)
    f.write(packed)

gravity_county = generate_stats(
  path.join(data_dir, 'gravity_dollar_pivoted.parquet'),
  "county",
  "county",
  year,
  "gravity"
)
hhi_county = generate_stats(
  path.join(data_dir, 'concentration_metrics_wide_ds.parquet'),
  "county",
  "county",
  year,
  "hhi"
)

segregation_county = generate_stats(
  path.join(data_dir, 'sdoh.parquet'),
  "county",
  "county",
  "ICE_Black_Alone_White_Alone",
  "segregation"
)
# %%
county_joined = gravity_county.merge(hhi_county, how='outer', on="county")\
  .merge(segregation_county, how='outer', on="county")
# %%
county_joined.to_parquet(path.join(data_dir, 'county_summary_stats.parquet'), index=False)
to_msgpack(county_joined, path.join(data_dir, 'county_summary_stats.msgpack'), 'county')
# %%

gravity_tract = generate_stats(
  path.join(data_dir, 'gravity_dollar_pivoted.parquet'),
  "tract",
  "GEOID",
  year,
  "gravity"
)
hhi_tract = generate_stats(
  path.join(data_dir, 'concentration_metrics_wide_ds.parquet'),
  "tract",
  "GEOID",
  year,
  "hhi"
)

segregation_tract = generate_stats(
  path.join(data_dir, 'sdoh.parquet'),
  "tract",
  "GEOID",
  "ICE_Black_Alone_White_Alone",
  "segregation"
)

# %%
tract_joined = gravity_tract.merge(hhi_tract, how='outer', on="GEOID")\
  .merge(segregation_tract, how='outer', on="GEOID")
# %%
tract_joined.to_parquet(path.join(data_dir, 'tract_summary_stats.parquet'), index=False)
to_msgpack(tract_joined, path.join(data_dir, 'tract_summary_stats.msgpack'), 'GEOID')
# %%

gravity_tract = generate_stats(
  path.join(data_dir, 'gravity_dollar_pivoted.parquet'),
  "state",
  "state",
  year,
  "gravity"
)
hhi_tract = generate_stats(
  path.join(data_dir, 'concentration_metrics_wide_ds.parquet'),
  "state",
  "state",
  year,
  "hhi"
)

segregation_tract = generate_stats(
  path.join(data_dir, 'sdoh.parquet'),
  "state",
  "state",
  "ICE_Black_Alone_White_Alone",
  "segregation"
)
# %%
state_joined = gravity_tract.merge(hhi_tract, how='outer', on="state")\
  .merge(segregation_tract, how='outer', on="state")
state_joined.to_parquet(path.join(data_dir, 'state_summary_stats.parquet'), index=False)
to_msgpack(state_joined, path.join(data_dir, 'state_summary_stats.msgpack'), 'state')
# %%
