import { DataService } from "utils/data/service/service"

class GlobalServices {
  globalDb: any
  globalConn: any
  globalDs: any
  colorFunction: (id: string | number) => Array<number> = (_: string | number) => [120, 120, 120, 0]

  set({
    conn,
    db,
    ds,
    colorFunction,
  }: {
    conn?: any
    db?: any
    ds?: DataService<any>
    colorFunction?: (id: string | number) => Array<number>
  }) {
    if (db) this.globalDb = db;
    if (conn) this.globalConn = conn;
    if (ds) this.globalDs = ds;
    if (colorFunction) this.colorFunction = colorFunction;
  }
}

export const globals = new GlobalServices()