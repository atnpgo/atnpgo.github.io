import React from 'react';

const CHARACTERS = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:⏀⏂⍎☭⚩⚦."=*+<>¦｜⍶çｸ☭⚩⚦日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:⏀⏂⍎☭⚩⚦."=*+<>¦｜⍶çｸ'.split('');
// const CHARACTERS = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:⏀⏂⍎☭⚩⚦⚧."=*+<>¦｜⍶çｸ☭⚩⚧⚦日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:⏀⏂⍎☭⚩⚧⚦."=*+<>¦｜⍶çｸ'.split('');

class Fall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            children1: {
                list: [],
                full: false,
                index: 0
            },
            children2: {
                list: [],
                full: false,
                index: 0
            }
        };
    }


    componentDidMount() {

        const process = children => children.list = children.list.map(child => Math.random() > 0.001 ? child : {
            text: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)],
            class: 'flash'
        });


        const tick = () => {
            process(this.state.children1);
            process(this.state.children2);
            window.requestAnimationFrame(() => {
                this.setState(this.state);
                tick();
            });
        };
        tick();

        const addChar = children => {
            const height = this.container1.clientHeight + 160;
            if (children.full) {
                if (children.index * 20 > height) {
                    children.index = 0;
                    children.list.forEach(i => i.class = '');
                }
            } else if (children.list.length * 20 > height) {
                children.full = true;
                children.list.forEach(i => i.class = '');
            }

            if (children.full) {
                children.list[children.index++] = {text: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)], class: 'flash'};
            } else {
                children.list.push({text: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)], class: 'flash'});
            }

            window.requestAnimationFrame(() => {
                this.setState(this.state);
                setTimeout(() => addChar(children), Math.floor(Math.random() * 25));
            });
        };
        addChar(this.state.children1);
        addChar(this.state.children2);

    }

    componentDidUpdate(prevProps) {

    }

    componentWillUnmount() {
    }

    render() {
        return <div>
            <p ref={container => this.container1 = container}>
                {this.state.children1.list.map((child, idx) => <span className={child.class} key={idx}>{child.text}</span>)}
            </p>
            <p>
                {this.state.children2.list.map((child, idx) => <span className={child.class} key={idx}>{child.text}</span>)}
            </p>
        </div>;
    }
}

export default Fall;
