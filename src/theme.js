import {darken, lighten} from 'polished';

const accent = 0.25;
const generateColor = color => ({
    base: color,
    light: lighten(accent, color),
    dark: darken(accent, color)
});
const generateBackground = color => ({
    level0: color,
    level1: lighten(0.01, color),
    level2: lighten(0.02, color),
    level3: lighten(0.03, color)
});

const THEME = {
    color: {
        primary: generateColor('#F52400'),
        header: generateColor('#F52400'),
        disabled: generateColor('#999999'),
        snapchat: generateColor('#FFFC00'),
        instagram: generateColor('#E4405F'),
        github: generateColor('#4078C0'),
        linkedin: generateColor('#0077B5'),
        youtube: generateColor('#FF0000'),
        facebook: generateColor('#3B5998'),
        reddit: generateColor('#FF4500'),
        twitch: generateColor('#6441A4'),
        twitter: generateColor('#1DA1F2')
    },

    background: {
        primary: generateBackground('#360800'),
        header: generateBackground('#360800'),
        disabled: generateBackground('#595959'),
        snapchat: generateBackground('#807E26'),
        instagram: generateBackground('#E4405F'),
        github: generateBackground('#633A41'),
        linkedin: generateBackground('#002336'),
        youtube: generateBackground('#800000'),
        facebook: generateBackground('#283B66'),
        reddit: generateBackground('#FF4500'),
        twitch: generateBackground('#3E2966'),
        twitter: generateBackground('#0C4466')
    },
    alpha: 0.45,
    shadowLength: 12,
    animTime: 100,
    typography: {
        headerSizes: {
            h1: 64,
            h2: 48,
            h3: 40,
            h4: 32,
            h5: 24,
            h6: 16
        },
        fontSize: 16,
        headerFontFamily: '"ailerons-regular", "sans-serif"',
        fontFamily: '"exan-regular", monospace'
    },

    code: {
        fontSize: 16,
        fontFamily: 'exan-regular,  monospace',
    }
};
export default THEME;
