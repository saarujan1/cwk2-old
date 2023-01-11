import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { Container } from 'react-bootstrap'
import Panel from './Panel'

export default function Content(props) {
  return (
    <>
      {/* REF1 */}
      {/* <Container className={getPathDepth() - prevDepth >= 0 ? "container left" : "container right"}> */}

      {/* .container-fluid for a full width container, spanning the entire width of the viewport. */}
      {/* .col-lg-auto based on width of content, breakpoint at large */}
      {/* .min-vh-100 min-height 100vw */}
      <Panel padding={3} width="col" height="vh-100" color="bg-lw">
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
      </Panel>
      {/* END OF REF1 */}
    </>
  )
}

// REFERENCES
// REF1, adapted from an example from the React Transition Group library: https://reactcommunity.org/react-transition-group/with-react-router/
