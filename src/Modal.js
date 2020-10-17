import React, {Fragment} from 'react';
import {withSounds} from './arwes/packages/sounds/src/withSounds';
import Project from './arwes/packages/arwes/src/Project';
import Animation from './arwes/packages/arwes/src/Animation';
import withStyles from './arwes/packages/arwes/src/tools/withStyles';
import styles from './arwes/packages/arwes/src/Project/styles';
import Link from './arwes/packages/arwes/src/Link';


const Modal = withStyles(styles)(withSounds()(props => {
    return (
        <Animation animate={true} show={true} timeout={props.theme.animTime}>
            {anim => (
                <Fragment>
                    <div className={'modal-overlay'}/>
                    <div className={'modal-wrapper'}>
                        <div className={'modal-content' + (props.small ? ' modal-sm' : '')} style={{
                            padding: '0 0.5rem',
                            margin: '0 auto 4rem'
                        }}>
                            <Project show={anim.entered} animate header={props.title} style={{margin: '4px'}}
                                     header2={props.close ? <Link className={'close'} href="#" onClick={props.close}>&times;</Link> : ''}>
                                {props.children}
                            </Project>
                        </div>
                    </div>
                </Fragment>
            )}
        </Animation>
    );
}));

export default Modal;
