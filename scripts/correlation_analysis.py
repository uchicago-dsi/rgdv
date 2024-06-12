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
df_full =  pd.read_parquet(path.join(data_dir, 'full_tract.parquet'))
# %%
corr_columns_dict = {
  'gravity_2023': "Food Access 2023",
  'hhi_2023': "Concentration 2023",
  # 'segregation_ICE_Black_Alone_White_Alone',
  'TOTAL_POPULATION': "Total Population",
  'PCT NH WHITE': "White (%)",
  'PCT NH BLACK': "Black (%)",
  'PCT NH AMERICAN INDIAN': "Native American (%)",
  'PCT HISPANIC OR LATINO': "Hispanic/Latinx (%)",
  'MEDIAN_AGE':   "Median Age",
  'POVERTY_RATE': "Poverty Rate (%)",
  'MEDIAN_HOUSEHOLD_INCOME': "Median Household Income (2021)",
  # 'NO HEALTHCARE TOTAL', 
  # 'PCT_NO_HEALTHCARE', 
  'ADI_NATRANK': "Neighborhood Disadvantage Rank",
  'ADI_STATERNK': "Neighborhood Disadvantage Rank (State)",
  'gravity_2000': "Food Access 2000",
  'gravity_2010': "Food Access 2010",
  'gravity_2020': "Food Access 2020",
  'gravity_ds_2000': "Food Access (Dollar Stores) 2000",
  'gravity_ds_2010': "Food Access (Dollar Stores) 2010",
  'gravity_ds_2020': "Food Access (Dollar Stores) 2020",
  'hhi_2000': "Concentration 2000",
  'hhi_2010': "Concentration 2010",
  'hhi_2020': "Concentration 2020",
  'hhi_ds_2000': "Concentration (Dollar Stores) 2000",
  'hhi_ds_2010': "Concentration (Dollar Stores) 2010",
  'hhi_ds_2020': "Concentration (Dollar Stores) 2020",
  'ICE_Black_Alone_White_Alone': "Segregation (Black/White)",
  'ICE_Hispanic_NH_White_Alone': "Segregation (Hispanic/White)",
}
corr_columns = list(corr_columns_dict.values())
# %%
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from scipy.stats import pearsonr


def correlation_matrix_with_significance(_df, significance_level=0.05):
    df = _df.copy().dropna()
    def calculate_pvalues(df):
        dfcols = pd.DataFrame(columns=df.columns)
        pvalues = dfcols.transpose().join(dfcols, how='outer')
        for r in df.columns:
            for c in df.columns:
                _, p = pearsonr(df[r], df[c])
                pvalues[r][c] = round(p, 4)
        return pvalues

    correlations = df.corr() * 100
    correlations = correlations.round(0).astype(int)  
    pvalues = calculate_pvalues(df)

    mask = np.triu(np.ones_like(correlations, dtype=bool))

    fig, ax = plt.subplots(figsize=(12, 10))
    cmap = sns.diverging_palette(220, 10, as_cmap=True)

    sns.heatmap(correlations, cmap=cmap, vmax=100, vmin=-100, center=0,
                square=True, annot=False, fmt=".0f", linewidths=.5, cbar_kws={"shrink": .5}, ax=ax)

    for i in range(len(correlations.columns)):
        for j in range(len(correlations.columns)):
            text = f'{correlations.iloc[i, j]:.0f}'
            if pvalues.iloc[i, j] < significance_level:
                ax.text(j+0.5, i+0.5, text, ha='center', va='center', color='black', fontweight="bold", fontsize=10)
            else:
                ax.text(j+0.5, i+0.5, text, ha='center', va='center', color='gray', fontsize=10)

    plt.title('Correlation Matrix with Statistically Significant Correlations in Bold')
    plt.show()

# %%
corr_df = df_full.rename(columns=corr_columns_dict)[corr_columns]
correlation_matrix_with_significance(corr_df)
# %%
corr_df_black_aa = corr_df.query("`Black (%)` > .30")
# %%
correlation_matrix_with_significance(corr_df_black_aa)

# %%
big_pop_corr_df = corr_df.query("`Total Population` > 5000")
# %%
correlation_matrix_with_significance(big_pop_corr_df)
# %%
