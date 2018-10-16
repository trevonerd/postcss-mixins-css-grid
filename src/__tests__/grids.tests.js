import grids from '../grids.js';
import ie11Fallback from '../modules/ie11Fallback';

const configSass = {
    parser: 'sass'
};

const configCss3 = {
    parser: 'css'
};

const configIE11 = {
    ie11: true
};

const configNoIE11 = {
    ie11: false
};

//---
test('getCoulmms - no param error', () => {
    function getColumns() {
        grids.__private__.getColumns();
    }
    expect(getColumns).toThrow('cols is empty or invalid!');
});

test('getCoulmms with single column', () => {
    let result = grids.__private__.getColumns(6);

    expect(result).toBe('repeat(6, 1fr)');
});

test('getCoulmms with multiple columns', () => {
    let result = grids.__private__.getColumns('5 10 2 4');

    expect(result).toBe('5fr 10fr 2fr 4fr');
});

//---
test('parseMediaQueryProp - no param error', () => {
    function parseMediaQueryProp() {
        grids.__private__.parseMediaQueryProp();
    }
    expect(parseMediaQueryProp).toThrow('prop is undefined!');
});

test('parseMediaQueryProp - Sass variables', () => {
    grids.customConfig(configSass);
    const result = grids.__private__.parseMediaQueryProp('prop');

    expect(result).toBe('$prop');
});

test('parseMediaQueryProp - CSS3 variables', () => {
    grids.customConfig(configCss3);
    const result = grids.__private__.parseMediaQueryProp('prop');

    expect(result).toBe('(--prop)');
});

//---
test('getCssResponsiveSteps with one step', () => {
    const result = grids.__private__.getCssResponsiveSteps('@mobile 3');
    expect(result).toEqual([
        {
            addDisplayGridCss: true,
            columns: 3,
            mediaQuery: '&',
            name: 'mobile'
        }
    ]);
});

test('getCssResponsiveSteps with more then one step', () => {
    const result = grids.__private__.getCssResponsiveSteps(
        '@mobile 6 @tablet 6 @desktop 12 @large-desktop 24'
    );
    expect(result).toEqual([
        {addDisplayGridCss: true, columns: 6, mediaQuery: '&', name: 'mobile'},
        {
            addDisplayGridCss: false,
            columns: 6,
            mediaQuery: '@media (--tablet)',
            name: 'tablet'
        },
        {
            addDisplayGridCss: false,
            columns: 12,
            mediaQuery: '@media (--desktop)',
            name: 'desktop'
        },
        {
            addDisplayGridCss: false,
            columns: 24,
            mediaQuery: '@media (--large-desktop)',
            name: 'large-desktop'
        }
    ]);
});

//---
test('generate grid without IE11 fallback', () => {
    grids.customConfig(configNoIE11);

    const result = grids.generateGrid(null, '@mobile 6 @desktop 12');
    expect(result).toEqual({
        '&': {
            display: 'grid',
            'grid-gap': '5px',
            'grid-template-columns': 'repeat(6, 1fr)',
            width: '100%'
        },
        '@media (--desktop)': {
            'grid-gap': '5px',
            'grid-template-columns': 'repeat(12, 1fr)'
        }
    });
});

test('generate grid with IE11 fallback', () => {
    grids.customConfig(configIE11);
    const result = grids.generateGrid(null, '@mobile 6 @desktop 12');
    expect(result).toEqual({
        '&': {
            '@media all and (-ms-high-contrast: none), (-ms-high-contrast: active)': {
                '*:first-child': {'margin-left': 0},
                '*:last-child': {'margin-right': 0},
                '> *': {'margin-left': 2.5, 'margin-right': 2.5}
            },
            display: 'grid',
            'grid-gap': '5px',
            'grid-template-columns': 'repeat(6, 1fr)',
            width: '100%'
        },
        '@media (--desktop)': {
            '@media all and (-ms-high-contrast: none), (-ms-high-contrast: active)': {
                '*:first-child': {'margin-left': 0},
                '*:last-child': {'margin-right': 0},
                '> *': {'margin-left': 2.5, 'margin-right': 2.5}
            },
            'grid-gap': '5px',
            'grid-template-columns': 'repeat(12, 1fr)'
        }
    });
});

//---
test('parseIntGapSize should create an object', () => {
    let result = ie11Fallback.__private__.parseIntGapSize('10px 32px');
    expect(result.x).toBe(32);
    expect(result.y).toBe(10);

    result = ie11Fallback.__private__.parseIntGapSize('10px');
    expect(result.x).toBe(10);
    expect(result.y).toBe(10);
});

test('generateCss should generate the right CSS', () => {
    const step = {
        columns: 2
    };
    const gap = '10px 32px';

    const result = ie11Fallback.generateCss(step, gap);
    expect(result).toEqual({
        '@media all and (-ms-high-contrast: none), (-ms-high-contrast: active)': {
            '*:first-child': {'margin-left': 0},
            '*:last-child': {'margin-right': 0},
            '> *': {'margin-left': 16, 'margin-right': 16}
        }
    });
});
