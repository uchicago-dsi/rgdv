# %%
import pandas as pd
from glob import glob
from os import path
# %%
data_dir = path.abspath(path.join("..", "public", "data"))
csvs = glob(path.join(data_dir, "*.csv"))
# %%
df = pd.read_parquet(os.path.join(data_dir, "sdoh.parquet"))
# %%
zpop = list(df[df.Flag_Tract_Pop_Zero>0].GEOID)
# as json
import json
with open(path.join(data_dir, "zero_pop_tracts.json"), "w") as f:
    json.dump(zpop, f)
# %%
# convert each csv to parquet
compression = "gzip"
for csv in csvs:
    df = pd.read_csv(csv)
    df['GEOID'] = df['GEOID'].astype(str).str.zfill(11)
    parquet = path.splitext(csv)[0] + ".parquet"
    df.to_parquet(parquet, compression=compression)
# %%
store_sales = pd.read_parquet(path.join(data_dir, "___grocery_store_sales.parquet"))
# %%
store_sales.to_feather(path.join(data_dir, "___grocery_store_sales.feather"), compression="uncompressed")
# %%
import numpy as np
import pandas as pd
from pandas import DataFrame, Series
import sqlite3
# %%
# get output ready for database export
# %%
# %%
def df_to_db(df: DataFrame, table_name: str, con: sqlite3.Connection):
    df.to_sql(name=table_name, con=con, if_exists='replace')
    con.commit()
# %5
def output_inmemory_db_to_file(con: sqlite3.Connection, file_path: str):
    with open(file_path, 'w') as f:
        for line in con.iterdump():
            f.write('%s\n' % line)
#%%
db_path = path.join(data_dir, "___grocery_store_sales.db")
conn = sqlite3.connect(db_path)
store_sales.to_sql(name='sales', con=conn, if_exists='replace')
conn.commit()
# %%
conn.close()

# %%
