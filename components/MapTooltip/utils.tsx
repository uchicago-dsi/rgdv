export const adjustTooltipToMousePosition = (x:number, y:number, tooltipWidth: number): {left?:number, top?:number, right?:number, bottom?:number} => {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  // if in bottom right quadrant of screen
  // move tooltip to the left
  const quadrantX = x > screenWidth / 2 ? "right" : "left"
  const quadrantY = y > screenHeight / 2 ? "bottom" : "top"
  let cssProps: {left?:number, top?:number, right?:number, bottom?:number} = {

  }
  if (quadrantX === "right") {
    cssProps['right'] = screenWidth - x + 10
  } else {
    cssProps = {left: x + 10}
  }
  if (quadrantY === "bottom") {
    cssProps['bottom'] = screenHeight - y + 10
  } else {
    cssProps['top'] = y + 10
  }

  return cssProps
}