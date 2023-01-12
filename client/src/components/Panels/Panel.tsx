export default function Panel(props) {
  const { width, height, padding, color, className, shadow, border, children } = props

  return (
    <>
      <div className={width + ' ' + height + ' p-' + padding + ' ' + className}>
        <div className={'h-100 rounded-7 p-' + padding + ' ' + color + (shadow ? ' panel-shadow' : '') + (border ? ' panel-outline' : '')}>{children}</div>
      </div>
    </>
  )
}
