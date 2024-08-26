
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from scipy.stats import pearsonr
import requests
from os import path

current_dir = path.dirname(path.abspath(__file__))
data_dir = path.join(current_dir, '..', 'public', 'data')

code_dict = {
    1: 'Large central metro',
    2: 'Large fringe metro',
    3: 'Medium metro',
    4: 'Small metro',
    5: 'Micropolitan',
    6: 'Noncore adjacent to a metro',
}

def correlation_matrix_with_significance(_df, significance_level=0.05):
    """
    Create a correlation matrix with statistically significant correlations in bold
    :param _df: DataFrame
    :param significance_level: float
    :return: None
    """
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
    ax.set_xticklabels(ax.get_xticklabels(), rotation=45, horizontalalignment='right')
    for i in range(len(correlations.columns)):
        for j in range(len(correlations.columns)):
            text = f'{correlations.iloc[i, j]:.0f}'
            if pvalues.iloc[i, j] < significance_level:
                ax.text(j+0.5, i+0.5, text, ha='center', va='center', color='black', fontweight="bold", fontsize=10)
            else:
                ax.text(j+0.5, i+0.5, text, ha='center', va='center', color='gray', fontsize=10)

    # plt.title('Correlation Matrix with Statistically Significant Correlations in Bold')
    plt.show()
    return {
        "correlations": correlations,
        "pvalues": pvalues,
    }


def get_subset_stats(df: pd.DataFrame, sum_cols: list, mean_cols: list):
    out_dict = [
        {
            "Property": "Number of Tracts",
            "Value": len(df)
        }
    ]
    for col in sum_cols:
        out_dict.append({
            "Property": col + " total",
            "Value": round(df[col].sum())
        })
    for col in mean_cols:
        out_dict.append({
            "Property": col + " average",
            "Value": f'{round(df[col].mean(), 4)}'
        })
    df=  pd.DataFrame(out_dict)
    # to clipboard
    df.to_clipboard(index=False)
    return df

def pretty_table(data_dict):
    for k, v in data_dict.items():
        print(f"{k}: {v}")


corr_columns_dict = {
  'gravity_2023': "Food Access 2023",
  'hhi_2023': "Concentration 2023",
  # 'segregation_ICE_Black_Alone_White_Alone',
  'TOTAL_POPULATION': "Total Population",
  "DENSITY": "Population Density",
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
#   'ADI_STATERNK': "Neighborhood Disadvantage Rank (State)",
#   'gravity_2000': "Food Access 2000",
#   'gravity_2010': "Food Access 2010",
#   'gravity_2020': "Food Access 2020",
#   'gravity_ds_2000': "Food Access (Dollar Stores) 2000",
#   'gravity_ds_2010': "Food Access (Dollar Stores) 2010",
#   'gravity_ds_2020': "Food Access (Dollar Stores) 2020",
#   'hhi_2000': "Concentration 2000",
#   'hhi_2010': "Concentration 2010",
#   'hhi_2020': "Concentration 2020",
#   'hhi_ds_2000': "Concentration (Dollar Stores) 2000",
#   'hhi_ds_2010': "Concentration (Dollar Stores) 2010",
#   'hhi_ds_2020': "Concentration (Dollar Stores) 2020",
  'ICE_Black_Alone_White_Alone': "Segregation (Black/White)",
  'ICE_Hispanic_NH_White_Alone': "Segregation (Hispanic/White)",
  "PCT_NO_HEALTHCARE": "No Healthcare (%)",
"PCT_WITH_A_DISABILITY": "Living with a disability (%)",
"PCT_SNAP_ASSISTANCE":"Receiving SNAP or cash assistance (%)",	
}
corr_columns = list(corr_columns_dict.values())


def get_full_data():
    acp_data_url = 'https://www.americancommunities.org/wp-content/themes/AmericanCommunitiesProject/data/processed-county-data.json'
    data = requests.get(acp_data_url).json()['objects']['counties']['geometries']
    properties = [{'geoid': row['id'], **row['properties']} for row in data]
    acp_data = pd.DataFrame(properties)   
    df_full =  pd.read_parquet(path.join(data_dir, 'full_tract.parquet'))
    # tract_info = pd.read_parquet(path.join(data_dir, 'tracts_info.parquet'))
    # df_full = df_full.merge(tract_info, on='GEOID')
    # df_full['COUMTY'] = df_full['GEOID'].str.slice(0, 5)
    # df_full = df_full.merge(acp_data, left_on='COUMTY', right_on='geoid')
    # df_full['ALAND'] = pd.to_numeric(df_full['ALAND'])
    # df_full['DENSITY'] = df_full['TOTAL_POPULATION'] / df_full['ALAND']
    # # sf to sq mi
    # df_full['ALAND'] = pd.to_numeric(df_full['ALAND'])/ 2589988.11
    # df_full['DENSITY'] = df_full['TOTAL_POPULATION'] / df_full['ALAND']
    # replace -666666666.0 with None
    df_full = df_full.replace(-666666666.0, None)
    rurality = pd.read_excel(path.join(data_dir, 'Urban Rural Classification 2013.xlsx'))[[
        'FIPS code', '2013 code'
    ]]
    rurality['FIPS code'] = rurality['FIPS code'].astype(str).str.zfill(5)
    rurality['urbanicity'] = rurality['2013 code'].map(code_dict)
    df_full = df_full.merge(rurality, left_on='COUMTY', right_on='FIPS code')
    # big cities community
    bc_df = df_full.query('community == "Big Cities"')
    # terciles by ADI_NATRANK
    tercile_1 = bc_df.ADI_NATRANK.quantile(0.33)
    tercile_2 = bc_df.ADI_NATRANK.quantile(0.66)
    def split_big_cities_community(row):
        if row['community'] != 'Big Cities':
            return row['community']
        if row['ADI_NATRANK'] < tercile_1:
            return 'Big Cities - T1 (Low) Disadvantage'
        if row['ADI_NATRANK'] < tercile_2:
            return 'Big Cities - T2 (Mid) Disadvantage'
        return 'Big Cities - T3 (High) Disadvantage'

    df_full['community'] = df_full.apply(split_big_cities_community, axis=1)
    return df_full