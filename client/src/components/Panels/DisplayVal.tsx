export default function DisplayVal(props) {
  const { label, children } = props

  return (
    <>
      <div className="row d-flex w-100 justify-content-start gx-5">
        <div className="col-12 d-flex flex-column justify-content-end">
          <p className="fs-7 text-lighter-gray">{label}</p>
        </div>
        <div className="col-12">
          <p className="fs-5 fw-bold text-blue">{children}</p>
        </div>
      </div>
    </>
  )
}
