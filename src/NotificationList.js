import React from 'react';
import List from './arwes/packages/arwes/src/List';
import Frame from './arwes/packages/arwes/src/Frame';
import Words from './arwes/packages/arwes/src/Words';


class NotificationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
    }


    componentDidMount() {

        const initMessages = [
            {msg: 'booting up...', delay: 500 + Math.floor(Math.random() * 1000)},
            {msg: 'initializing systems...', delay: 1000 + Math.floor(Math.random() * 1000)},
            {msg: 'testing power controls...', delay: 500 + Math.floor(Math.random() * 1000)},
            {msg: 'testing life support...', delay: 1000 + Math.floor(Math.random() * 2000)},
            {msg: 'testing shield generator...', delay: 500 + Math.floor(Math.random() * 2000)},
            {msg: 'bringing shields up...', delay: 2000 + Math.floor(Math.random() * 1000)},
            {msg: 'shields online', delay: 1000},
            {msg: 'testing JUMP drive...', delay: 500 + Math.floor(Math.random() * 1000)},
            {msg: 'testing PDC systems...', delay: 500 + Math.floor(Math.random() * 1000)},
            {msg: 'testing plasma generator...', delay: 750 + Math.floor(Math.random() * 1250)},
            {msg: 'testing launcher bays...', delay: 750 + Math.floor(Math.random() * 1250)},
            {msg: 'testing guidance systems...', delay: 250 + Math.floor(Math.random() * 500)},
            {msg: 'all test passed', delay: 1000},
            {msg: 'system initialized', delay: 1000},
            {msg: 'bringing reactor online...', delay: 2000 + Math.floor(Math.random() * 2000)},
            {msg: 'reactor online', delay: 1000},
            {msg: 'all systems operational', delay: 5000 + Math.floor(Math.random() * 15) * 1000},
        ];

        const MESSAGES = [
            'diagnostics check complete',
            'power levels optimal',
            'no system error reported',
            'cryostatis cells reporting',
            'homebase connection online',
            'plasma levels safe',
            'system entropy acceptable'
        ];

        const processNext = () => {
            const next = initMessages.shift();
            if (next) {
                this.setState({messages: this.state.messages.concat([next.msg])});
                setTimeout(processNext, next.delay);
            } else {
                const addMessage = () => {
                    this.setState({messages: this.state.messages.concat(MESSAGES[Math.floor(Math.random() * MESSAGES.length)])});
                    setTimeout(addMessage, 5000 + Math.floor(Math.random() * 15) * 1000);
                };
                addMessage();
            }
        };
        processNext();
    }

    componentDidUpdate(prevProps) {
        document.querySelector('ul li:last-child').scrollIntoView();
    }

    componentWillUnmount() {
    }

    render() {
        return <Frame show animate level={3} corners={4} layer='primary' style={this.props.style}>
            <List node='ul'>
                {this.state.messages.map((message, idx) => <li key={idx}><Words animate show mute={true}>{message}</Words></li>)}
            </List>
        </Frame>;
    }
}

export default NotificationList;
