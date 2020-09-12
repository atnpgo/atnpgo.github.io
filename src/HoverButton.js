import React from 'react';
import Button from './arwes/packages/arwes/src/Button';
import {withSounds} from './arwes/packages/sounds/src/withSounds';


const HoverButton = withSounds()(props => {
    return (
        <Button animate buttonProps={{
            onMouseEnter: () => props.players.hover.play()
        }} {...props}>
            {props.children}
        </Button>
    );
});

export default HoverButton;
