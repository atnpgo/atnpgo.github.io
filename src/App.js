import React, {Fragment} from 'react';

import ThemeProvider from './arwes/packages/arwes/src/ThemeProvider';
import createTheme from './arwes/packages/arwes/src/tools/createTheme';
import Arwes from './arwes/packages/arwes/src/Arwes';
import Puffs from './arwes/packages/arwes/src/Puffs';
import Header from './arwes/packages/arwes/src/Header';
import Heading from './arwes/packages/arwes/src/Heading';
import Frame from './arwes/packages/arwes/src/Frame';
import Words from './arwes/packages/arwes/src/Words';
import Loading from './arwes/packages/arwes/src/Loading';
import createLoader from './arwes/packages/arwes/src/tools/createLoader';
import Footer from './arwes/packages/arwes/src/Footer';
import Project from './arwes/packages/arwes/src/Project';
import {SoundsProvider} from './arwes/packages/sounds/src/SoundsProvider';

import {Howl} from 'howler';
import SiriWave from 'siriwave';


import THEME from './theme';
import HoverButton from './HoverButton';
import Modal from './Modal';
import ModalHolder from './ModalHolder';
import Video from './arwes/packages/arwes/src/Video';
import moment from 'moment';
import NotificationList from './NotificationList';
import Fall from './Fall';


class AppWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            launched: false
        };


    }

    createPlayer(src, settings = {}) {
        return new Howl(Object.assign(settings, {
            src: [src]
        }));
    }

    componentDidUpdate(prevProps) {
        if (this.state.loading) {
            createLoader().load({
                images: [
                    '/images/PIA13112_hires.jpg',
                    '/images/glow.png',
                ], sounds: [
                    '/sounds/click.mp3',
                    '/sounds/error.mp3',
                    '/sounds/information.mp3',
                    '/sounds/warning.mp3',
                    '/sounds/typing.mp3',
                    '/sounds/deploy.mp3',
                    '/sounds/ask.mp3',
                    '/sounds/hover.mp3'
                ]
            }).then(() => {
                this.setState({loading: false});
            }, () => {
                console.error('Resources could not be loaded.');
                this.setState({loading: false});
            });
        } else {
            const wave = new SiriWave({
                container: document.getElementById('siri-container'),
                width: 100,
                height: 30,
                color: '#F52400',
                cover: true,
                autostart: true,
                speed: 0.1,
                amplitude: 0.1
            });

            document.querySelector('#siri-container canvas').setAttribute('height', '40');
            let entropyY = 0;
            let entropyX = 0;

            const X_MAX = 50;
            const Y_MAX = 120;

            document.addEventListener('mousemove', e => {
                entropyY += Math.abs(e.movementY / window.innerHeight * Y_MAX);
                if (entropyY > Y_MAX) {
                    entropyY = Y_MAX;
                }
                entropyX += Math.abs(e.movementX / window.innerWidth * X_MAX);
                if (entropyX > X_MAX) {
                    entropyX = X_MAX;
                }
            });

            document.addEventListener('click', e => {
                entropyY = Y_MAX;
                entropyX = X_MAX;
            });

            document.addEventListener('touchstart', e => {
                entropyY = Y_MAX;
                entropyX = X_MAX;
            });


            const decay = () => {
                entropyY--;
                if (entropyY < 0) {
                    entropyY = 0;
                }
                entropyX--;
                if (entropyX < 0) {
                    entropyX = 0;
                }

                wave.setSpeed(entropyX / 100 + 0.1);
                wave.setAmplitude(entropyY / 100 + 0.1);

                window.requestAnimationFrame(decay);
            };
            decay();

            const timeSpan = document.querySelector('#time');
            const setTime = () => {
                timeSpan.textContent = moment.utc().format('HH.mm.ss.SSS');
                window.requestAnimationFrame(setTime);
            };
            setTime();

            const dateSpan = document.querySelector('#date');
            const setDate = () => {
                dateSpan.textContent = moment.utc().format('YYYY.MM.DD');
                setTimeout(() => window.requestAnimationFrame(setDate), 1000);
            };
            setDate();

        }
    }

    render() {
        const oneAtATime = true;

        const theme = createTheme(THEME);
        return (
            <ThemeProvider theme={theme}>
                <SoundsProvider players={{
                    click: this.createPlayer('/sounds/click.mp3'),
                    error: this.createPlayer('/sounds/error.mp3'),
                    info: this.createPlayer('/sounds/information.mp3'),
                    warning: this.createPlayer('/sounds/warning.mp3'),
                    hover: this.createPlayer('/sounds/hover.mp3'),
                    typing: this.createPlayer('/sounds/click.mp3', {oneAtATime}),
                    deploy: this.createPlayer('/sounds/deploy.mp3', {oneAtATime}),
                    ask: this.createPlayer('/sounds/ask.mp3', {oneAtATime})
                }} audio={{mute: false}}>
                    {!this.state.launched
                        ? <ThemeProvider theme={theme}>
                            <Arwes>
                                <Modal title={'WELCOME'} theme={theme}>
                                    {anim => (
                                        <div style={{display: 'flex', justifyContent: 'center'}}>
                                            <HoverButton animate layer='primary' show={anim.entered} onClick={() => this.setState({launched: true})}>
                                                {anim => <Fragment><i className={'icon-play'} style={{marginRight: '0.5rem'}}/>
                                                    <Words animate show={anim.entered}>Launch</Words></Fragment>}
                                            </HoverButton>
                                        </div>
                                    )}
                                </Modal>
                            </Arwes>
                        </ThemeProvider>
                        : this.state.loading
                            ? <ThemeProvider theme={theme}>
                                <Arwes>
                                    <Loading full animate show={this.state.loading} animation={{unmountOnExit: true}}/>
                                </Arwes>
                            </ThemeProvider>
                            : this.props.children}
                </SoundsProvider>
            </ThemeProvider>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: null
        };

        this._modals = React.createRef();
    }

    componentDidMount() {
        const {animate, show, players} = this.props;
        if (animate && show) {
            players.deploy && players.deploy.play();
        }
    }

    componentDidUpdate(prevProps) {
        const {animate, show, players} = this.props;
        if (animate && prevProps.show !== show) {
            players.deploy && players.deploy.play();
        }
    }

    componentWillUnmount() {
        const {animate, sounds} = this.props;
        if (animate) {
            sounds.deploy && sounds.deploy.stop();
        }
    }

    render() {
        return <AppWrapper>
            <Arwes animate={true} show={true} background='/images/PIA13112_hires.jpg' pattern='/images/glow.png'>
                {anim => (

                    <Fragment>
                        <Header animate className={'slideInTop'}>
                            <Heading node='h1' style={{margin: 0}}>ATNPGO</Heading>
                        </Header>
                        <div className={'sidebars'}>
                            <div>
                                <div/>
                                <Fall/>
                            </div>
                            <div>
                                <div/>
                                <Fall/>
                            </div>
                        </div>
                        <div className={'wings'}>
                            <div>
                                <span id={'date'} style={{marginLeft: '0.5rem'}}/>
                                <div/>
                            </div>
                            <div>
                                <span id={'time'} style={{marginRight: '0.5rem'}}/>
                                <div/>
                            </div>
                        </div>

                        <div className={'auto-width'} style={{
                            margin: '2rem auto 4rem',
                            padding: '0 0.5rem',
                            overflowY: 'auto',
                            maxHeight: 'calc(100% - 220px)',
                            overflowX: 'hidden'
                        }}>
                            <Puffs animate>
                                <Fragment>
                                    <Frame show={anim.entered} animate level={3} corners={4} layer='primary' style={{margin: '4px auto 0'}} className={'first-frame'}>
                                        {anim => (
                                            <p style={{margin: '1rem'}}><Words animate show={anim.entered}>
                                                Welcome to the personal website of Etienne Pageau. Full-stack software developer, design dabbler, film snob, avid reader, cardboard
                                                collector, picky foodie, cat owner, casual gamer, stoner smark, clout chaser, sci-fi nerd, and fantasy dork.
                                            </Words></p>
                                        )}
                                    </Frame>

                                    <Project show={anim.entered} animate header='SELECT A SECTION' style={{margin: '2rem auto'}} className={'auto-width'}>
                                        {anim => (
                                            <div className={'button-container'}>
                                                <HoverButton animate layer='success' show={anim.entered} onClick={() => this._modals.current.openSocials()}
                                                             style={{margin: '0 0.5rem 0.5rem 0'}}>
                                                    <Words animate show={anim.entered}>Social Media</Words>
                                                </HoverButton>
                                                <HoverButton animate layer='secondary' show={anim.entered} onClick={() => this._modals.current.openHobbies()}
                                                             style={{margin: '0 0.5rem 0.5rem 0'}}>
                                                    <Words animate show={anim.entered}>Projects</Words>
                                                </HoverButton>
                                                <HoverButton animate layer='control' show={anim.entered} onClick={() => this._modals.current.openCV()}
                                                             style={{margin: '0 0.5rem 0.5rem 0'}}>
                                                    <Words animate show={anim.entered}>Resume</Words>
                                                </HoverButton>
                                            </div>
                                        )}
                                    </Project>

                                </Fragment>
                                <ModalHolder ref={this._modals}/>
                            </Puffs>
                        </div>
                        <Footer className={'slideInBottom'}>
                            <span></span>
                            <span style={{fontSize: '0.6rem'}}>oc © 2020 Etienne Pageau</span>
                        </Footer>


                        <Frame show={anim.entered} className={'auto-hide slideInTop'} animate level={3} corners={4} layer='primary'
                               style={{position: 'fixed', top: '1.5rem', right: '2rem'}}>
                            <div id="siri-container"/>
                        </Frame>

                        <div className={'low-wing right'} style={{position: 'fixed', bottom: '2.9rem', right: 0}}>
                            <div/>
                            <div><NotificationList style={{height: '100%'}}/></div>
                        </div>
                        <div className={'low-wing left'} style={{position: 'fixed', bottom: '2.9rem', left: 0}}>
                            <div/>
                            <Video layer='primary'
                                   vidProps={{
                                       muted: 'muted',
                                       autoPlay: 'autoplay',
                                       loop: 'loop',
                                       playsInline: true
                                   }}
                                   style={{height: '100%', width: '100%'}}
                                   animate show={anim.entered} className={''}>
                                <source src='/images/planet.webm' type='video/webm'/>
                                <source src="/images/planet.mp4" type="video/mp4"/>
                            </Video>
                        </div>

                    </Fragment>
                )}
            </Arwes>
        </AppWrapper>;
    }
}

export default App;
