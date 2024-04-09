import React from "react"

type StateRouteProps = {
  params: {
    state: string
  }
}
const StatePage: React.FC<StateRouteProps> = ({ params }) => {
  const state = params.state
  return (
    <div>
      <h1>{state}</h1>
    </div>
  )
}

export default StatePage