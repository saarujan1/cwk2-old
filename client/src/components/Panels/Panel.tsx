export default function Panel(props) {
  const { width, height, padding, innerPadding, color, className, shadow, border, square, noInnerHeight, children } = props

  return (
    <>
      <div className={width + ' ' + height + ' p-' + padding + ' ' + className}>
        <div className={(noInnerHeight ? '' : 'h-100 ') + 'rounded-7 p-' + padding + ' p-' + innerPadding + ' ' + color + (shadow ? ' panel-shadow' : '') + (border ? ' panel-outline' : '') + (square ? ' square' : '')}>{children}</div>{' '}
      </div>
    </>
  )
}
