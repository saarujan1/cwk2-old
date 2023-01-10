export default function Panel(props) {
  const { width, height, padding, color, className, children } = props

  return (
    <>
      <div className={width + ' ' + height + ' p-' + padding + ' ' + className}>
        <div className={'panel-shadow h-100 rounded-7 p-' + padding + ' ' + color}>{children}</div>
      </div>
    </>
  )
}
