import defaultConfig from "./config";
import { DataConfig } from "./config.types";
import * as P from 'papaparse';
import type { AsyncDuckDB, AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
import {
  getDuckDb,
  runQuery,
  loadParquet
} from 'utils/duckdb'

export class DataService {
  config: DataConfig[];
  data: Record<string, Record<string, Record<string|number, number>>> = {};
  complete: Array<string> = [];
  eagerData: Array<string> = [];
  completeCallback?: (s: string) => void;
  hasRunWasm: boolean = false;
  dbStatus: 'none' |'loading' | 'loaded' | 'error' = 'none';
  db?: AsyncDuckDB;
  baseURL: string = window.location.origin;
  conn?: AsyncDuckDBConnection;

  constructor(completeCallback?: (s: string) => void, config: DataConfig[] = defaultConfig) {
    this.config = config;
    this.completeCallback = completeCallback;
  }

  initData(){
    console.log('FETCHING DATA!!!')
    const eagerData = this.config.filter(c => c.eager);
    eagerData.forEach(c => this.fetchData(c));
  }

  async waitForDb(){
    if (this.dbStatus === 'loaded') {
      return;
    }
    while (this.dbStatus === 'loading') {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  async initDb(){
    console.log('RUNNING WASM!!!')
    if (this.dbStatus === 'loaded') {
      return;
    } else if (this.dbStatus === 'loading') {
      console.log('Waiting for db to load');
      return this.waitForDb();
    }
    this.dbStatus = 'loading';
    this.db = await getDuckDb()
    this.conn = await this.db.connect()
    this.dbStatus = 'loaded';
  }

  backgroundDataLoad(){
    if (this.complete.length === this.config.length) {
      const remainingData = this.config.filter(c => !this.complete.includes(c.filename));
      remainingData.forEach(c => this.fetchData(c));
    }
  }
  ingestData(data: Array<any>, config: DataConfig, dataStore: any){
    console.log(config, data[0])
    for (let i=0; i<data.length; i++) {
      const row = data[i];
      if (!row?.[config.id]) {
        console.error(`Row ${i} in ${config.filename} is missing a valid id`);
        continue;
      }
      let id = `${row[config.id]}`
      // if (id.length === 10) {
      //   id = `0${id}`
      // }
      dataStore[id] = {
        ...row,
        id
      };
      // @ts-ignore
    }
    console.log("All done!");
    if (this.completeCallback) {
      this.completeCallback(config.filename);
    }
    this.complete.push(config.filename);
  }
  async fetchData(config: DataConfig){
    if (this.complete.includes(config.filename)) {
      return;
    }
    await this.initDb();
    const dataStore = this.data[config.filename]
    if (this.data[config.filename]) {
      // console.error(`Data store already exists for ${config.filename}`);
      return;
    }
    this.data[config.filename] = {};
    const r = await runQuery(
      this.db!,
      `SELECT * FROM '${this.baseURL}/${config.filename}'`
    )
    this.ingestData(r, config, this.data[config.filename]);

  }

  setCompleteCallback(cb: (s: string) => void){
    this.completeCallback = cb;
    this.complete.forEach(cb);
  }
}