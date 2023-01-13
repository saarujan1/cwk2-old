export default function DisplayVal(props) {
  const { color, noPadding, children } = props

  return (
    <>
      <div className={'text-light-cream rounded-7 fw-bold ' + color + (noPadding ? '' : ' p-3')}>{children}</div>
    </>
  )
}
