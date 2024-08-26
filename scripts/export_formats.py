# %%
import pandas as pd
  
# pd remove col limit
pd.set_option('display.float_format', lambda x: '%.3f' % x)
pd.set_option('display.max_columns', None)
# %%
df_full = pd.read_parquet("../public/data/full_tract.parquet")
# %%
# export to common formats
df_full.to_csv("../public/data/full_tract.csv", index=False)
# excel
df_full.to_excel("../public/data/full_tract.xlsx", index=False)


# %%
