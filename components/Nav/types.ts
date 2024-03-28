export type LinkSpec = {  title: string;
  path: string}

export type NavProps = { 
  navInfo: 
  { 
    query: any,
    variables: any,
    data: {
      nav:{ 
        links: Array<LinkSpec & {subLinks: Array<LinkSpec>}>
      }
    }
  }
}
