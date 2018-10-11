let grid = {
    gaps: {
        mobile: '5px',
        tablet: '5px',
        desktop: '5px',
        'large-desktop': '5px'
    },
    presets: {
        1: '1fr',
        2: 'repeat(2, 1fr)',
        3: 'repeat(3, 1fr)',
        4: 'repeat(4, 1fr)',
        6: 'repeat(6, 1fr)',
        8: 'repeat(8, 1fr)',
        12: 'repeat(12, 1fr)',
        24: 'repeat(24, 1fr)'
    },
    templates: {
        default: '@mobile 6 @tablet 12 @desktop 24 @large-desktop 24'
    },
    parser: 'css'
};

const customConfig = conf => {
    grid = {
        gaps: {...grid.gaps, ...conf.grid.gaps},
        presets: {...grid.presets, ...conf.grid.presets},
        templates: {...grid.templates, ...conf.grid.templates},
        parser: conf.parser
    };
};

const getColumns = cols => {
    if (grid.presets[cols]) {
        return grid.presets[cols];
    }

    const matches = cols.match(/[\w]+/g);
    let gridTemplate = '';
    matches.forEach(col => {
        gridTemplate += col + 'fr ';
    });

    return gridTemplate;
};

const parseMediaQueryProp = prop => {
    if (grid.parser === 'sass') return `$${prop}`;
    return `(--${prop})`;
};

const getCssResponsiveValues = responsiveData => {
    const regex = /@(mobile|tablet|desktop|large-desktop\w*)\s*([0-9-]*)/gi;
    let values = [];
    let m;
    let addDisplayGridCss = true;

    while ((m = regex.exec(responsiveData)) !== null) {
        let cssProp = '&';

        if (m[1] !== 'mobile') {
            cssProp = `@media ${parseMediaQueryProp(m[1])}`;
        }

        values.push([m[1], m[2], cssProp, addDisplayGridCss]);
        addDisplayGridCss = false;
    }

    return values;
};

const colSpan = (ignore, colsResponsiveSpan) => {
    let responsiveSpanCss = {};

    getCssResponsiveValues(colsResponsiveSpan).forEach(step => {
        responsiveSpanCss[step[2]] = {
            'grid-column-end': `span ${step[1]}`
        };
    });

    return {
        ...responsiveSpanCss
    };
};

const colStart = (ignore, colsResponsiveStart) => {
    let responsiveStartCss = {};

    getCssResponsiveValues(colsResponsiveStart).forEach(step => {
        responsiveStartCss[step[2]] = {
            'grid-column-start': step[1]
        };
    });

    return {
        ...responsiveStartCss
    };
};

const generateGrid = (ignore, responsiveGrids) => {
    if (!responsiveGrids.startsWith('@'))
        return generateGrid('', grid.templates[responsiveGrids]);

    let responsiveGridsCss = new Object();

    getCssResponsiveValues(responsiveGrids).forEach(step => {
        responsiveGridsCss[step[2]] = {
            'grid-template-columns': getColumns(step[1]),
            'grid-gap': grid.gaps[step[0]]
        };

        if (step[3]) {
            responsiveGridsCss[step[2]] = {
                ...responsiveGridsCss[step[2]],
                display: 'grid',
                width: '100%'
            };
        }
    });

    return {
        ...responsiveGridsCss
    };
};

const spanAll = ignore => {
    return {
        'grid-column': '1/-1'
    };
};

export {customConfig, generateGrid, colStart, colSpan, spanAll};
