import React from 'react';


const CHARACTERS = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:⏀⏂⍎☭⚧."=*+<>¦｜⍶çｸ☭⚧日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:⏀⏂⍎☭⚧."=*+<>¦｜⍶çｸ'.split('');

class Fall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            children1: [],
            children2: []
        };
    }


    componentDidMount() {

        const process = children => {
            children.forEach((child, index) => {
                child.opacity = Math.max(0, Math.round((1 - Math.round((children.length - index)) / 10) * 10) / 10);
                if (Math.random() < 0.001) {
                    child.text = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
                }
            });
        };


        const tick = () => {
            process(this.state.children1);
            process(this.state.children2);


            this.setState(this.state);
            window.requestAnimationFrame(tick);
        };
        tick();

        const addChar = children => {
            if (children.length * 20 > this.container1.clientHeight + 160) {
                children.length = 0;
            }
            children.push({text: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)], opacity: 1});

            window.requestAnimationFrame(() => {
                this.setState(this.state);
                setTimeout(() => addChar(children), Math.floor(Math.random() * 250));
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
                {this.state.children1.map((child, idx) => <span key={idx} style={{opacity: child.opacity}}>{child.text}</span>)}
            </p>
            <p>
                {this.state.children2.map((child, idx) => <span key={idx} style={{opacity: child.opacity}}>{child.text}</span>)}
            </p>
        </div>;
    }
}

export default Fall;
