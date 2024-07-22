# %%
import pandas as pd
from os import path
# msgpack
import msgpack
import numpy as np
import gzip
from utils import correlation_matrix_with_significance, get_subset_stats, corr_columns_dict, corr_columns
import requests

# pd remove col limit
pd.set_option('display.float_format', lambda x: '%.3f' % x)
pd.set_option('display.max_columns', None)
# %%
# %%
# acp stats
acp_stats_df = df_full[['community', 'TOTAL_POPULATION','NH WHITE ALONE','NH BLACK ALONE','NH AMERICAN INDIAN ALONE','HISPANIC OR LATINO']]
# sum
acp_stats_df = acp_stats_df.groupby('community').sum().reset_index()
acp_stats_df['NH NON-WHITE'] = acp_stats_df['TOTAL_POPULATION'] - acp_stats_df['NH WHITE ALONE']
# pcts
acp_stats_df['% NH WHITE ALONE'] = acp_stats_df['NH WHITE ALONE'] / acp_stats_df['TOTAL_POPULATION']
acp_stats_df['% NH NON-WHITE'] = acp_stats_df['NH NON-WHITE'] / acp_stats_df['TOTAL_POPULATION']
acp_stats_df['% NH BLACK ALONE'] = acp_stats_df['NH BLACK ALONE'] / acp_stats_df['TOTAL_POPULATION']
acp_stats_df['% NH AMERICAN INDIAN ALONE'] = acp_stats_df['NH AMERICAN INDIAN ALONE'] / acp_stats_df['TOTAL_POPULATION']
acp_stats_df['% HISPANIC OR LATINO'] = acp_stats_df['HISPANIC OR LATINO'] / acp_stats_df['TOTAL_POPULATION']
acp_stats_df = acp_stats_df.sort_values("community")
acp_stats_df.to_clipboard(index=False)
# %%
# other stats by ACP
other_acp = df_full[[
    'community',
    'ADI_NATRANK',
    'AHOLD DELHAIZE USA INC',
    'ALBERTSONS CO INC',
      'COSTCO WHOLESALE CORP', 'DOLLAR GENERAL CORP',
       'DOLLAR TREE INC', 'KROGER CO', 'LONE STAR FUNDS', 'MEIJER INC',
       'PUBLIX SUPER MARKETS INC', 'TARGET CORP', "TRADER JOE'S",
       'WAKEFERN FOOD CORP INC', 'WALMART INC', 'WEGMANS FOOD MARKETS INC'
]]
other_acp = other_acp.groupby('community').mean().reset_index()\
    .sort_values("community")
other_acp.to_clipboard(index=False)


# %%
t3_access = df_full.gravity_2023.quantile(0.33)
t3_concentration = df_full.hhi_2023.quantile(0.66)

t3_df = df_full.copy().query(f'gravity_2023 < {t3_access} & hhi_2023 > {t3_concentration}')
# %%
corr_df = df_full.rename(columns=corr_columns_dict)[corr_columns]
corr_d3_t3 = t3_df.rename(columns=corr_columns_dict)[corr_columns]

# %%
for urbanicity in df_full.urbanicity.unique():
    print(urbanicity)
    subset = df_full[df_full.urbanicity == urbanicity]\
      .rename(columns=corr_columns_dict)[corr_columns]
    correlation_matrix_with_significance(subset[corr_columns])
# %%
correlation_matrix_with_significance(corr_df)
# %%
correlation_matrix_with_significance(corr_d3_t3)
# %%
output = [
  {
    "label": "Count",
    "overall": df_full.shape[0],
    "concern": t3_df.shape[0]
  },
  # hhi
  {
    "label": "Average HHI (0-1)",
    "overall": df_full['hhi_2023'].mean(),
    "concern": t3_df['hhi_2023'].mean()
  },
  # gravity
  {
    "label": "Average Food Access Score",
    "overall": df_full['gravity_2023'].mean(),
    "concern": t3_df['gravity_2023'].mean()
  },
  # disadvantage
  {
    "label": "Average Disadvantage Score (0-100)",
    "overall": df_full['ADI_NATRANK'].mean(),
    "concern": t3_df['ADI_NATRANK'].mean()
  },
  {
    # segregation
    "label": "Average Segregation Black/White (-1 to 1, higher is worse)",
    "overall": df_full['segregation_ICE_Black_Alone_White_Alone'].mean(),
    "concern": t3_df['segregation_ICE_Black_Alone_White_Alone'].mean()
  },
  {
    "label": "Total Population",
    "overall": df_full['TOTAL_POPULATION'].sum(),
    "concern": t3_df['TOTAL_POPULATION'].sum()
  },
  {
    "label": "Non-white Population",
    "overall": df_full['TOTAL_POPULATION'].sum() - df_full['NH WHITE ALONE'].sum(),
    "concern": t3_df['TOTAL_POPULATION'].sum() - t3_df['NH WHITE ALONE'].sum()
  },
  {
    "label": "% Non-white Population",
    "overall": (df_full['TOTAL_POPULATION'].sum() - df_full['NH WHITE ALONE'].sum())/ df_full['TOTAL_POPULATION'].sum(),
    "concern": (t3_df['TOTAL_POPULATION'].sum() - t3_df['NH WHITE ALONE'].sum()) / t3_df['TOTAL_POPULATION'].sum()
  },
  # % hispanic
  {
    "label": "% Hispanic Population",
    "overall": df_full['HISPANIC OR LATINO'].sum() / df_full['TOTAL_POPULATION'].sum(),
    "concern": t3_df['HISPANIC OR LATINO'].sum() / t3_df['TOTAL_POPULATION'].sum()
  },
  # % black
  {
    "label": "% Black Population",
    "overall": df_full['NH BLACK ALONE'].sum() / df_full['TOTAL_POPULATION'].sum(),
    "concern": t3_df['NH BLACK ALONE'].sum() / t3_df['TOTAL_POPULATION'].sum()
  },
  # median income
  {
    "label": "Average Median Household Income (2021 dollars)",
    "overall": df_full['MEDIAN_HOUSEHOLD_INCOME'].mean(),
    "concern": t3_df['MEDIAN_HOUSEHOLD_INCOME'].mean()
  },
  {
    "label": "Average Density (people per sq mi)",
    "overall": df_full['DENSITY'].mean(),
    "concern": t3_df['DENSITY'].mean()
  },
  # average poverty rate
  {
    "label": "Average Poverty Rate",
    "overall": df_full['POVERTY_RATE'].mean(),
    "concern": t3_df['POVERTY_RATE'].mean()
  },
  {
    "label": "% No Healthcare",
    "overall": df_full['NO HEALTHCARE TOTAL'].sum() / df_full['TOTAL_POPULATION'].sum(),
    "concern": t3_df['NO HEALTHCARE TOTAL'].sum() / t3_df['TOTAL_POPULATION'].sum()
  },
  {
    "label": "% Living with a disability",
    "overall": df_full['WITH_A_DISABILITY_TOTAL'].sum() / df_full['TOTAL_POPULATION'].sum(),
    "concern": t3_df['WITH_A_DISABILITY_TOTAL'].sum() / t3_df['TOTAL_POPULATION'].sum()
  },
  {
    # pct snap
    "label": "% SNAP or Cash Assistance",
    "overall": df_full['PCT_SNAP_ASSISTANCE'].mean(),
    "concern": t3_df['PCT_SNAP_ASSISTANCE'].mean()
  },
  {
    "label": "Average Median Age",
    "overall": df_full['MEDIAN_AGE'].mean(),
    "concern": t3_df['MEDIAN_AGE'].mean()
  }
]
# average for each of the following columns
cols = [
  'AHOLD DELHAIZE USA INC','ALBERTSONS CO INC', 'COSTCO WHOLESALE CORP', 'DOLLAR GENERAL CORP',
       'DOLLAR TREE INC', 'KROGER CO', 'LONE STAR FUNDS', 'MEIJER INC',
       'PUBLIX SUPER MARKETS INC', 'TARGET CORP', "TRADER JOE'S",
       'WAKEFERN FOOD CORP INC', 'WALMART INC', 'WEGMANS FOOD MARKETS INC']
for col in cols:
    output.append({
        "label": f"% {col}",
        "overall": df_full[col].mean(),
        "concern": t3_df[col].mean()
    })

df_output = pd.DataFrame(output)
# %%
df_output
# %%
# %%
total_community_counts = df_full.community.value_counts()\
    .reset_index().rename(columns={"count": "total count"})
t3_community_counts = t3_df.community.value_counts()\
    .reset_index().rename(columns={"count": "t3 count"})
community_counts = total_community_counts.merge(t3_community_counts, on='community')
community_counts['t3 pct'] = community_counts['t3 count'] / community_counts['total count']

# %%
community_counts.to_clipboard(index=False)
# %%
