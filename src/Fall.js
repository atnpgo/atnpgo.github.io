import React from 'react';

const CHARACTERS = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:⏀⏂⍎☭⚩⚦."=*+<>¦｜⍶çｸ☭⚩⚦日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:⏀⏂⍎☭⚩⚦."=*+<>¦｜⍶çｸ'.split('');

class Column extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            full: false,
            index: 0
        };

        this.container = React.createRef();
    }

    componentDidMount() {
        let delta = Math.floor(Math.random() * 25);
        let last = 0;
        const addChar = (timestamp) => {
            if ((timestamp - last) >= delta) {
                const newState = Object.assign({}, this.state);

                const height = this.container.current.clientHeight + 160;
                if (newState.full) {
                    if (newState.index * 20 > height) {
                        newState.index = 0;
                        newState.list.forEach(i => i.class = '');
                    }
                } else if (newState.list.length * 20 > height) {
                    newState.full = true;
                    newState.list.forEach(i => i.class = '');
                }

                if (newState.full) {
                    newState.list[newState.index++] = {text: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)], class: 'flash'};
                } else {
                    newState.list.push({text: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)], class: 'flash'});
                }
                this.setState(newState);
                last = timestamp;
                delta = Math.floor(Math.random() * 25);
            }
            window.requestAnimationFrame(addChar);
        };
        window.requestAnimationFrame(addChar);

    }

    componentDidUpdate(prevProps) {

    }

    componentWillUnmount() {
    }

    render() {
        return <p ref={this.container}>
            {this.state.list.map((child, idx) => <span className={child.class} key={idx}>{child.text}</span>)}
        </p>;
    }
}

export default function Fall() {
    return <div><Column/><Column/></div>;
};
