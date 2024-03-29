import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { Container } from 'react-bootstrap'
import Panel from './Panel'

export default function Content(props) {
  return (
    <>
      {/* REF1 */}
      <Panel padding={4} width="col" height="vh-100" color="gradient">
        <SwitchTransition>
          <CSSTransition
            key={props.location.pathname}
            // as React.RefObject<HTMLDivElement> fixes what would be an 'unknown' type
            nodeRef={props.nodeRef as React.RefObject<HTMLDivElement>}
            timeout={300}
            classNames="pageSlider vh-100"
            unmountOnExit
          >
            {() => (
              <div ref={props.nodeRef as React.RefObject<HTMLDivElement>} className="page h-100">
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
