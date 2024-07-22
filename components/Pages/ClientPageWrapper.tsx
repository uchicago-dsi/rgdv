"use client"
import React from "react"
import { useTina } from "tinacms/dist/react"
import { PageProps } from "./types"

// The HOC function, using TypeScript generics to infer and pass along the props of the wrapped component
function withClient<T extends {}>(WrappedComponent: React.ComponentType<T>) {
  // Define the returned component using function component syntax and hooks
  const WithClient: React.FC<T & PageProps> = (props) => {
    const data = useTina({
      // @ts-ignore
      query: props.pageInfo.query,
      // @ts-ignore
      variables: props.pageInfo.variables,
      data: props.pageInfo.data,
    })
    // Render the WrappedComponent with the original props and additional isClient prop
    return <WrappedComponent {...props} pageInfo={data} />
  }
  return WithClient
}

export default withClient
