import { HomeProps } from "./types";

export const Renderer: React.FC<HomeProps> = ({ pageInfo }) => {
  return (
    <div>
      {JSON.stringify(pageInfo.data, null, 2)}
    </div>
  )
}