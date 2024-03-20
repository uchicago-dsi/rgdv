import defaultConfig from "./config";
import { DataConfig } from "./config.types";
import * as P from 'papaparse';

export class DataService {
  config: DataConfig[];
  data: Record<string, Record<string, Record<string|number, number>>> = {};
  complete: Array<string> = [];
  eagerData: Array<string> = [];
  completeCallback?: (s: string) => void;

  constructor(completeCallback?: (s: string) => void, config: DataConfig[] = defaultConfig) {
    this.config = config;
    this.completeCallback = completeCallback;
    this.initData();
  }

  initData(){
    const eagerData = this.config.filter(c => c.eager);
    eagerData.forEach(c => this.fetchData(c));
  }

  backgroundDataLoad(){
    if (this.complete.length === this.config.length) {
      const remainingData = this.config.filter(c => !this.complete.includes(c.filename));
      remainingData.forEach(c => this.fetchData(c));
    }
  }

  async fetchData(config: DataConfig){
    if (this.complete.includes(config.filename)) {
      return;
    }

    this.data[config.filename] = {};
    const dataStore = this.data[config.filename]
    P.parse<Record<string,any>>(config.filename, {
      download: true,
      header: true,
      dynamicTyping: true,
      fastMode: true,
      complete: (results) => {
        const data = results.data;
        if (!dataStore) {
          console.error(`No data store for ${config.filename}`);
          return;
        }

        for (let i=0; i<data.length; i++) {
          const row = data[i];
          if (!row?.[config.id]) {
            console.error(`Row ${i} in ${config.filename} is missing a valid id`);
            continue;
          }
          let id = `${row[config.id]}`
          if (id.length === 10) {
            id = `0${id}`
          }
          dataStore[id] = row;
          // @ts-ignore
          dataStore[id]['id'] = id;
        }
        console.log("All done!");
        if (this.completeCallback) {
          this.completeCallback(config.filename);
        }
        this.complete.push(config.filename);
      }
    })
  }

  setCompleteCallback(cb: (s: string) => void){
    this.completeCallback = cb;
    this.complete.forEach(cb);
  }
}