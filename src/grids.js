import ie11Fallback from './modules/ie11Fallback.js';

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
    parser: 'css',
    ie11: false,
    ie11Exclude: ['mobile', 'tablet'],
    noGridClass: '.no-cssgrid',
    mobileStepName: 'mobile'
};

const defaultOptions = grid;

const customConfig = (def, conf) => {
    grid = { ...def, ...conf };
};

const concatWithPipe = (previous, key) => `${previous}${key}|`;

const getColumns = cols => {
    if (!cols) throw 'cols is empty or invalid';

    if (grid.presets[cols]) {
        return grid.presets[cols];
    }

    const matches = cols.toString().match(/[\w]+/g);

    let gridTemplate = '';

    if (matches.length === 1) {
        return `repeat(${matches}, 1fr)`;
    }

    matches.forEach(col => {
        gridTemplate += col + 'fr ';
    });

    return gridTemplate.trim();
};

const parseMediaQueryProp = prop => {
    if (!prop) throw 'prop is undefined';

    if (grid.parser === 'sass') return `$${prop}`;
    return `(--${prop})`;
};

const generateStepsRegex = gridGaps => {
    const stepsString = Object.keys(gridGaps).reduce(concatWithPipe, '');

    return new RegExp(`@(${stepsString}\\w*)\\s*([\\s0-9-]*)`, 'gi');
};

const getCssResponsiveSteps = responsiveData => {
    const regex = generateStepsRegex(grid.gaps);

    let responsiveSteps = [];
    let regexGroups;
    let addDisplayGridCss = true;

    while ((regexGroups = regex.exec(responsiveData)) !== null) {
        let mediaQuery = '&';

        if (regexGroups[1] !== grid.mobileStepName) {
            mediaQuery = `@media ${parseMediaQueryProp(regexGroups[1])}`;
        }

        responsiveSteps.push({
            name: regexGroups[1],
            columns: regexGroups[2].trim(),
            mediaQuery,
            addDisplayGridCss
        });

        addDisplayGridCss = false;
    }

    return responsiveSteps;
};

const getGridGap = gridGap => {
    if (!gridGap) throw `gridGap doesn't exist`;

    return gridGap.split(' ').reduce((obj, str, index) => {
        const valueMap = { 0: 'row', 1: 'column' };
        obj[valueMap[index]] = str;
        return obj;
    }, {});
};

// --------------- MIXINS ------------------ //
const colSpan = (ignore, colsResponsiveSpan) => {
    let responsiveSpanCss = {};

    getCssResponsiveSteps(colsResponsiveSpan).forEach(step => {
        if (grid.ie11 && !grid.ie11Exclude.includes(step.name)) {
            responsiveSpanCss[step.mediaQuery] = ie11Fallback.colSpan(
                step.columns,
                grid.noGridClass
            );
        }

        responsiveSpanCss[step.mediaQuery] = {
            ...responsiveSpanCss[step.mediaQuery],
            'grid-column-end': `span ${step.columns}`
        };
    });

    return {
        ...responsiveSpanCss
    };
};

const colStart = (ignore, colsResponsiveStart) => {
    let responsiveStartCss = {};

    getCssResponsiveSteps(colsResponsiveStart).forEach(step => {
        responsiveStartCss[step.mediaQuery] = {
            'grid-column-start': `${step.columns}`
        };
    });

    return {
        ...responsiveStartCss
    };
};

const generateGrid = (ignore, responsiveGrids) => {
    if (!responsiveGrids) throw `CSS grid mixin: wrong parameters`;

    if (!responsiveGrids.startsWith('@')) {
        return generateGrid('', grid.templates[responsiveGrids]);
    }

    let responsiveGridsCss = new Object();

    getCssResponsiveSteps(responsiveGrids).forEach(step => {
        if (grid.ie11 && !grid.ie11Exclude.includes(step.name)) {
            responsiveGridsCss[step.mediaQuery] = ie11Fallback.generateCss(
                step,
                grid.gaps[step.name],
                grid.noGridClass
            );
        }

        responsiveGridsCss[step.mediaQuery] = {
            ...responsiveGridsCss[step.mediaQuery],
            'grid-template-columns': getColumns(step.columns),
            'grid-template-rows': 'auto'
        };

        if (grid.gaps[step.name]) {
            const gridGap = getGridGap(grid.gaps[step.name]);

            responsiveGridsCss[step.mediaQuery] = {
                ...responsiveGridsCss[step.mediaQuery],
                'grid-row-gap': gridGap.row,
                'grid-column-gap': gridGap.column ? gridGap.column : gridGap.row
            };
        }

        if (step.addDisplayGridCss) {
            responsiveGridsCss[step.mediaQuery] = {
                ...responsiveGridsCss[step.mediaQuery],
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

// --------------- CSS GRID-TEMPLATE-AREAS ------------------ //
const generateGridTemplateAreasStepsRegex = gridGaps => {
    const stepsString = Object.keys(gridGaps).reduce(concatWithPipe, '');

    return new RegExp(`@(${stepsString}\\w*)\\s*([a-z0-9" \.]*)`, 'gi');
};

const getGridTemplateAreasColumnsCss = gridTemplate => {
    const templateColumns = gridTemplate.match(/"([a-z0-9 \.]*)"/g)[0].split(' ');

    return templateColumns.map(() => '1fr').join(' ');
};

const generateGridTemplateAreasResponsiveStepsObject = responsiveData => {
    const regex = generateGridTemplateAreasStepsRegex(grid.gaps);

    let responsiveSteps = [];
    let regexGroups;
    let addDisplayGridCss = true;

    while ((regexGroups = regex.exec(responsiveData)) !== null) {
        let mediaQuery = '&';

        if (regexGroups[1] !== grid.mobileStepName) {
            mediaQuery = `@media ${parseMediaQueryProp(regexGroups[1])}`;
        }

        const stepName = regexGroups[1];
        const gridTemplateAreas = regexGroups[2].trim();
        const gridTemplateColumnsCss = getGridTemplateAreasColumnsCss(gridTemplateAreas);

        responsiveSteps.push({
            name: stepName,
            template: gridTemplateAreas,
            columns: gridTemplateColumnsCss,
            mediaQuery,
            addDisplayGridCss
        });

        addDisplayGridCss = false;
    }

    return responsiveSteps;
};

const generateGridTemplateAreasCss = (ignore, mixinParams) => {
    if (!mixinParams) throw `CSS grid mixin: wrong parameters`;

    if (!mixinParams.startsWith('@')) {
        return generateGridTemplateAreasCss(null, grid.templates[mixinParams]);
    }

    let responsiveGridsCss = new Object();

    generateGridTemplateAreasResponsiveStepsObject(mixinParams).forEach(step => {
        responsiveGridsCss[step.mediaQuery] = {
            ...responsiveGridsCss[step.mediaQuery],
            'grid-template': `${step.template} / ${step.columns}`
        };

        if (grid.gaps[step.name]) {
            const gridGap = getGridGap(grid.gaps[step.name]);

            responsiveGridsCss[step.mediaQuery] = {
                ...responsiveGridsCss[step.mediaQuery],
                'grid-row-gap': gridGap.row,
                'grid-column-gap': gridGap.column ? gridGap.column : gridGap.row
            };
        }

        if (step.addDisplayGridCss) {
            responsiveGridsCss[step.mediaQuery] = {
                ...responsiveGridsCss[step.mediaQuery],
                display: 'grid',
                width: '100%'
            };
        }

        step.template = step.template
            .replace(/[^A-Za-z0-9 ]/g, '') // remove all unuseful chars
            .replace(/  +/g, ' ') // no more double spaces
            .split(' ')
            .filter((x, i, a) => a.indexOf(x) == i)
            .forEach((area, index) => {
                responsiveGridsCss[step.mediaQuery][`> *:nth-child(${index + 1})`] = {
                    'grid-area': area
                };
            });
    });

    return {
        ...responsiveGridsCss
    };
};

module.exports = {
    defaultOptions,
    customConfig,
    generateGrid,
    generateGridTemplateAreasCss,
    colStart,
    colSpan,
    spanAll,
    __private__: {
        getColumns,
        parseMediaQueryProp,
        getCssResponsiveSteps,
        getGridGap,
        generateStepsRegex,
        // GRID-TEMPLATE
        generateGridTemplateAreasStepsRegex,
        getGridTemplateAreasColumnsCss,
        generateGridTemplateAreasResponsiveStepsObject
    }
};
