"use client"
import React from "react"

const PostWidget: React.FC<{ widget: string }> = ({ widget }) => {
  switch (widget) {
    case "sortableTable":
      return <h2>Tabel. ..</h2>
    case "test":
      return <code className="bg-gray-200 p-2">Test widget</code>
    default:
      return null
  }
}

export default PostWidget
