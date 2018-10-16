const parseIntGapSize = gap => {
    const values = gap.split(' ');

    return {
        x: values[1] ? parseInt(values[1]) : parseInt(values[0]),
        y: parseInt(values[0])
    };
};

const generateCss = (step, stepGap) => {
    let ie11ColumnsCss = {};

    stepGap = parseIntGapSize(stepGap);

    for (let j = 1; j <= step.columns; j++) {
        ie11ColumnsCss['> *'] = {
            'margin-left': stepGap.x / 2,
            'margin-right': stepGap.x / 2
        };
    }

    ie11ColumnsCss[`*:first-child`] = {
        'margin-left': 0
    };

    ie11ColumnsCss[`*:last-child`] = {
        'margin-right': 0
    };

    return {
        '@media all and (-ms-high-contrast: none), (-ms-high-contrast: active)': {
            ...ie11ColumnsCss
        }
    };
};

export default {
    generateCss,
    __private__: { parseIntGapSize }
};
