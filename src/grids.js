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
    }
};

const customConfig = conf => {
    grid = {
        gaps: { ...grid.gaps, ...conf.grid.gaps },
        presets: { ...grid.presets, ...conf.grid.presets }
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

const getCssResponsiveValues = responsiveData => {
    const regex = /@(mobile|tablet|desktop|large-desktop\w*)\s*([0-9-]*)/gi;
    let values = [];
    let m;

    while ((m = regex.exec(responsiveData)) !== null) {
        let cssProp = '&';

        if (m[1] !== 'mobile') {
            cssProp = `@media (--${m[1]})`;
        }

        values.push([m[1], m[2], cssProp]);
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
    let responsiveGridsCss = new Object();

    getCssResponsiveValues(responsiveGrids).forEach(step => {
        responsiveGridsCss[step[2]] = {
            'grid-template-columns': getColumns(step[1]),
            'grid-gap': grid.gaps[step[0]]
        };
    });

    responsiveGridsCss['&'] = {
        ...responsiveGridsCss['&'],
        display: 'grid',
        margin: '0 auto',
        width: '100%'
    };

    return {
        ...responsiveGridsCss
    };
};

export { customConfig, generateGrid, colStart, colSpan };
