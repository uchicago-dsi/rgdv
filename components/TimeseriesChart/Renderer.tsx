"use client"
import React, { useEffect, useState } from "react";
import { getTimeseriesChartProps } from "./types";
import { ds } from "utils/data/service";

const TimeseriesChart: React.FC<getTimeseriesChartProps> = ({ id }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await ds.initDb();
      await ds.initData();
      const data = await ds.getTimeseries(id);
      setData(data);
    };

    fetchData();
  }, [id]);

  return <div>TimeseriesChart {id}</div>;
}

export default TimeseriesChart;