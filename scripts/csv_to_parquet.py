# %%
import pandas as pd
from glob import glob
from os import path
# %%
data_dir = path.abspath(path.join("..", "public", "data"))
csvs = glob(path.join(data_dir, "*.csv"))
# %%
# convert each csv to parquet
compression = "gzip"
for csv in csvs:
    df = pd.read_csv(csv)
    parquet = path.splitext(csv)[0] + ".parquet"
    df.to_parquet(parquet, compression=compression)
# %%
