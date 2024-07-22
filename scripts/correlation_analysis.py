# %%
import pandas as pd
from os import path
# msgpack
import msgpack
import numpy as np
import gzip
from utils import correlation_matrix_with_significance, get_subset_stats, corr_columns_dict, corr_columns, get_full_data
import requests
# pd remove col limit
pd.set_option('display.max_columns', None)
# %%
current_dir = path.dirname(path.abspath(__file__))
data_dir = path.join(current_dir, '..', 'public', 'data')
df_full = get_full_data()
# %%
corr_df = df_full.rename(columns=corr_columns_dict)[corr_columns]
corr_df.replace(-666666666.0, np.nan, inplace=True)
corr_result = correlation_matrix_with_significance(corr_df)
# %%
def get_subset_corrs(df, col):
    values = df[col].unique()
    results = {}
    for value in values:
        subset = df[df[col] == value]\
          .rename(columns=corr_columns_dict)[corr_columns]
        subset.replace(-666666666.0, np.nan, inplace=True)
        results[value] = correlation_matrix_with_significance(subset)
    return results
u_results = get_subset_corrs(df_full, 'urbanicity')
# %%
urbanicities = df_full.urbanicity.unique()
i = 0
# %%
while i < len(urbanicities):
    print(urbanicities[i])
    u_results[urbanicities[i]]['correlations'].to_clipboard()
    i += 1
    break
# %%
simple_cols = ['Food Access 2023', 'Concentration 2023', 'Neighborhood Disadvantage Rank', 'Median Household Income (2021)', 'Population Density']
correlation_matrix_with_significance(corr_df[simple_cols])
# %%
corr_df_black_aa = corr_df.query("`Black (%)` > .30")
result = correlation_matrix_with_significance(corr_df_black_aa)
result['correlations'].to_clipboard()

# %%
big_pop_corr_df = corr_df.query("`Total Population` > 5000")
# %%
correlation_matrix_with_significance(big_pop_corr_df)
# %%
density_tercile1 = corr_df['Population Density'].quantile(1/3)
density_tercile2 = corr_df['Population Density'].quantile(2/3)
# %%
df_low_density = corr_df.query("`Population Density` < @density_tercile1")
df_mid_density = corr_df.query("`Population Density` >= @density_tercile1 and `Population Density` < @density_tercile2")
df_high_density = corr_df.query("`Population Density` >= @density_tercile2")
# %%
correlation_matrix_with_significance(df_low_density)
# %%
correlation_matrix_with_significance(df_mid_density)
#%% 
correlation_matrix_with_significance(df_high_density)
# %%
mean_cols = [
    "Food Access 2023",
    "Concentration 2023",
    "White (%)",
    "Black (%)",
    "Native American (%)",
    "Hispanic/Latinx (%)",
    "Median Age",
    "Poverty Rate (%)",
    "Median Household Income (2021)",
    "Neighborhood Disadvantage Rank",
    "Segregation (Black/White)",
    "Segregation (Hispanic/White)",
    "No Healthcare (%)",
    "Living with a disability (%)",
    "Receiving SNAP or cash assistance (%)"
]
sum_cols = [
    "Total Population"
]

# %%
dfs = []
for urbanicity in df_full.urbanicity.unique():
    subset = df_full[df_full.urbanicity == urbanicity]\
      .rename(columns=corr_columns_dict)[corr_columns]
    substats = get_subset_stats(subset, sum_cols, mean_cols)
    substats['urbanicity'] = urbanicity
    corrs = subset[[
    'Food Access 2023',
    'Concentration 2023',
    'Neighborhood Disadvantage Rank'
    ]].corr().iloc[0].values
    substats['food_access_concentration_corr'] = corrs[1]
    substats['food_access_disadvantage_corr'] = corrs[2]
    dfs.append(substats)
# %%
all_urbs = pd.concat(dfs)
# rotate Value as urbanicity
all_urbs.to_clipboard(index=False)
# %%
corr_df_latinx = corr_df.query("`Hispanic/Latinx (%)` > .30")
result = correlation_matrix_with_significance(corr_df_latinx)
result['correlations'].to_clipboard()
# get_subset_stats(corr_df_latinx)
# %%
any_non_white = corr_df.query("`White (%)` < .70")
result = correlation_matrix_with_significance(any_non_white)
result['correlations'].to_clipboard()
# get_subset_stats(any_non_white)
# %%

any_non_white = corr_df.query("`White (%)` < .30")
result = correlation_matrix_with_significance(any_non_white)
result['correlations'].to_clipboard()
# get_subset_stats(any_non_white)
# %%
top_q_concentration = corr_df['Concentration 2023'].quantile(2/3)
bottom_q_access = corr_df['Food Access 2023'].quantile(1/3)
# %%
high_concentration_low_access = corr_df.query("`Concentration 2023` > @top_q_concentration and `Food Access 2023` < @bottom_q_access")
# %%
result = correlation_matrix_with_significance(high_concentration_low_access)
result['correlations'].to_clipboard()
# %%
get_subset_stats(high_concentration_low_access)
# %%
community_results = get_subset_corrs(df_full, 'community')
# %%

communities = df_full.community.unique()
i = 0
# %%
while i < len(communities):
    print(communities[i])
    community_results[communities[i]]['correlations'].to_clipboard()
    i += 1
    break
# %%
