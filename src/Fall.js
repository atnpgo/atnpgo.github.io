import React from 'react';

// const CHARACTERS = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:⏀⏂⍎☭⚩⚦⚧."=*+<>¦｜⍶çｸ☭⚩⚧⚦日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:⏀⏂⍎☭⚩⚧⚦."=*+<>¦｜⍶çｸ'.split('');
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
        const tick = () => {
            this.state.list.map(child => Math.random() > 0.001 ? child : {
                text: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)],
                class: 'flash'
            });
            window.requestAnimationFrame(() => {
                this.setState(this.state);
                tick();
            });
        };

        const addChar = () => {
            const height = this.container.current.clientHeight + 160;
            if (this.state.full) {
                if (this.state.index * 20 > height) {
                    this.state.index = 0;
                    this.state.list.forEach(i => i.class = '');
                }
            } else if (this.state.list.length * 20 > height) {
                this.state.full = true;
                this.state.list.forEach(i => i.class = '');
            }

            if (this.state.full) {
                this.state.list[this.state.index++] = {text: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)], class: 'flash'};
            } else {
                this.state.list.push({text: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)], class: 'flash'});
            }

            window.requestAnimationFrame(() => {
                this.setState(this.state);
                setTimeout(() => addChar(), Math.floor(Math.random() * 25));
            });
        };
        setTimeout(addChar, 1250);

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
