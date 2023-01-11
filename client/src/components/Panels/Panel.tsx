export default function Panel(props) {
  const { width, height, padding, color, className, ifShadow, children } = props

  return (
    <>
      <div className={width + ' ' + height + ' p-' + padding + ' ' + className}>
        <div className={'h-100 rounded-7 p-' + padding + ' ' + color + (ifShadow ? 'panel-shadow' : '')}>{children}</div>
      </div>
    </>
  )
}
