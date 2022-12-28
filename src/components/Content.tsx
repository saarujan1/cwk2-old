import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { Container } from 'react-bootstrap'

export default function Content(props) {
  return (
    <>
      {/* REF1 */}
      {/* <Container className={getPathDepth() - prevDepth >= 0 ? "container left" : "container right"}> */}
      <Container className="col-sm p-3 min-vh-100">
        <SwitchTransition>
          <CSSTransition
            key={props.location.pathname}
            // as React.RefObject<HTMLDivElement> fixes what would be an 'unknown' type
            nodeRef={props.nodeRef as React.RefObject<HTMLDivElement>}
            timeout={300}
            classNames="pageSlider"
            unmountOnExit
          >
            {() => (
              <div ref={props.nodeRef as React.RefObject<HTMLDivElement>} className="page">
                {props.currentOutlet}
              </div>
            )}
          </CSSTransition>
        </SwitchTransition>
      </Container>
      {/* END OF REF1 */}
    </>
  )
}

// REFERENCES
// REF1, adapted from an example from the React Transition Group library: https://reactcommunity.org/react-transition-group/with-react-router/
