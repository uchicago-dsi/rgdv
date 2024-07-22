export const MenuSection: React.FC<{
  title: string
  children: React.ReactNode
  isActive: boolean
  titleChildren?: React.ReactNode
}> = ({ title, children, titleChildren, isActive }) => {
  if (!isActive) {
    return null
  }

  return (
    <div className="prose p-2">
      <div className="flex flex-row">
        <h3 className="m-0 p-0">{title}</h3>
        <div>{titleChildren}</div>
      </div>
      {children}
    </div>
  )
}
