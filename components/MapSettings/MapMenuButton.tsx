export const MenuButton: React.FC<{
  onClick: () => void
  label: string
  selected: boolean
}> = ({ onClick, label, selected }) => {
  return (
    <button
      onClick={onClick}
      className={`z-0 mb-[-1px] mr-[-1px] max-w-full border-[1px] border-solid border-neutral-300 p-1 text-sm
      focus:bg-theme-canvas-100 focus:shadow-[0_0_-5px_5px] focus:shadow-blackA5 focus:outline-none
      
      ${selected ? "bg-primary-200" : "bg-white hover:bg-theme-canvas-100"}
      `}
    >
      {label}
    </button>
  )
}
