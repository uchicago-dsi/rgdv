export type PageContent = {
  sections: Array<{
    title: string
    body: string
  }>
}

export type PageProps = {
  pageInfo: {
    data: PageContent | any
  }
}
