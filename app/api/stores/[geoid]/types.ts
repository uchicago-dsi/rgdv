export type StoreEntry = {
  GEOID: string
  STORE_LAT: number
  STORE_LON: number
  COMPANY: string
  "PARENT COMPANY": string
  'PCT OF TRACT SALES': number
  ZIPCODE: string
  "ADDRESS LINE 1": string
}
export type StoreData = Array<StoreEntry>
