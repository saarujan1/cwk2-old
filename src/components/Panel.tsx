export default function Panel(props) {
  const { width, height, padding, color, className, children } = props

  return (
    <>
      <div className={width + ' ' + height + ' p-' + padding + ' bg-dark ' + className}>
        <div className={'h-100 rounded p-' + padding + ' ' + color}>{children}</div>
      </div>
    </>
  )
}
