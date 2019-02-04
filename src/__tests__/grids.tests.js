import grids from '../grids.js';
import ie11Fallback from '../modules/ie11Fallback';

let defaults = {
  gaps: {
    mobile: '1px',
    desktop: '3px 10px',
    'large-desktop': '4px'
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

const configCustomGaps = {
  gaps: {
    phone: '10px',
    desktop: '32px',
    wide: '10px 36p'
  },
  mobileStepName: 'phone',
  ie11Exclude: ['phone', 'tablet']
};

const configCustomTemplates = {
  templates: {
    '1-2': '@mobile 1 @tablet 2',
    '1-3': '@mobile 1 @tablet 3 @desktop 4'
  }
};

//---
describe('getColums', () => {
  test('getCoulmms - no param error', () => {
    const getColumns = () => grids.__private__.getColumns();

    expect(getColumns).toThrow('cols is empty or invalid');
  });

  test('getCoulmms with single column (no preset)', () => {
    const result = grids.__private__.getColumns(5);

    expect(result).toBe('repeat(5, 1fr)');
  });

  test('getCoulmms with multiple columns (no preset)', () => {
    const result = grids.__private__.getColumns('5 10 5');

    expect(result).toBe('5fr 10fr 5fr');
  });

  test('getCoulmms with single column', () => {
    const result = grids.__private__.getColumns(6);

    expect(result).toBe('repeat(6, 1fr)');
  });

  test('getCoulmms with multiple columns', () => {
    const result = grids.__private__.getColumns('5 10 2 4');

    expect(result).toBe('5fr 10fr 2fr 4fr');
  });
});

//---
describe('parseMediaQueryProp', () => {
  test('parseMediaQueryProp - no param error', () => {
    const parseMediaQueryProp = () => grids.__private__.parseMediaQueryProp();

    expect(parseMediaQueryProp).toThrow('prop is undefined');
  });

  test('parseMediaQueryProp - Sass variables', () => {
    grids.customConfig(defaults, configSass);
    const result = grids.__private__.parseMediaQueryProp('prop');

    expect(result).toBe('$prop');
  });

  test('parseMediaQueryProp - CSS3 variables', () => {
    grids.customConfig(defaults, configCss3);
    const result = grids.__private__.parseMediaQueryProp('prop');

    expect(result).toBe('(--prop)');
  });
});

//---
describe('getCssResponsiveSteps', () => {
  test('getCssResponsiveSteps with one step', () => {
    const result = grids.__private__.getCssResponsiveSteps('@mobile 3');
    expect(result).toEqual([
      {
        addDisplayGridCss: true,
        columns: '3',
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
      {
        addDisplayGridCss: true,
        columns: '6',
        mediaQuery: '&',
        name: 'mobile'
      },
      {
        addDisplayGridCss: false,
        columns: '6',
        mediaQuery: '@media (--tablet)',
        name: 'tablet'
      },
      {
        addDisplayGridCss: false,
        columns: '12',
        mediaQuery: '@media (--desktop)',
        name: 'desktop'
      },
      {
        addDisplayGridCss: false,
        columns: '24',
        mediaQuery: '@media (--large-desktop)',
        name: 'large-desktop'
      }
    ]);
  });
});

//---
describe('getGripGap', () => {
  test('getGrigGap should return an object with row and column gap', () => {
    expect(grids.__private__.getGridGap(defaults.gaps.mobile)).toEqual({
      row: '1px'
    });
    expect(grids.__private__.getGridGap(defaults.gaps.desktop)).toEqual({
      row: '3px',
      column: '10px'
    });
  });

  test('getGrigGap error', () => {
    const getGridGap = () => grids.__private__.getGridGap();

    expect(getGridGap).toThrow("gridGap doesn't exist");
  });
});

//---
describe('templates', () => {
  test('generate grid using an existing template', () => {
    grids.customConfig(defaults, configNoIE11);

    const result = grids.generateGrid(null, 'default');
    expect(result).toEqual({
      '&': {
        display: 'grid',
        'grid-column-gap': '1px',
        'grid-row-gap': '1px',
        'grid-template-columns': 'repeat(6, 1fr)',
        width: '100%'
      },
      '@media (--desktop)': {
        'grid-column-gap': '10px',
        'grid-row-gap': '3px',
        'grid-template-columns': 'repeat(24, 1fr)'
      },
      '@media (--large-desktop)': {
        'grid-column-gap': '4px',
        'grid-row-gap': '4px',
        'grid-template-columns': 'repeat(24, 1fr)'
      },
      '@media (--tablet)': { 'grid-template-columns': 'repeat(12, 1fr)' }
    });
  });

  test('should throw an error if we try to generate the grid using an unknown template', () => {
    grids.customConfig(defaults, configNoIE11);

    const result = () => grids.generateGrid(null, 'unknown_template');
    expect(result).toThrow("template doesn't exist");
  });

  test('custom templates', () => {
    grids.customConfig(defaults, { ...configNoIE11, ...configCustomTemplates });

    let result = grids.generateGrid(null, '1-2');
    expect(result).toEqual({
      '&': {
        display: 'grid',
        'grid-column-gap': '1px',
        'grid-row-gap': '1px',
        'grid-template-columns': '1fr',
        width: '100%'
      },
      '@media (--tablet)': { 'grid-template-columns': 'repeat(2, 1fr)' }
    });

    result = grids.generateGrid(null, '1-3');
    expect(result).toEqual({
      '&': {
        display: 'grid',
        'grid-column-gap': '1px',
        'grid-row-gap': '1px',
        'grid-template-columns': '1fr',
        width: '100%'
      },
      '@media (--desktop)': {
        'grid-column-gap': '10px',
        'grid-row-gap': '3px',
        'grid-template-columns': 'repeat(4, 1fr)'
      },
      '@media (--tablet)': { 'grid-template-columns': 'repeat(3, 1fr)' }
    });
  });
});

describe('IE11 GenerateCSS', () => {
  const step = {
    columns: 2
  };
  const gap = '10px 32px';
  const noCssClass = '.no-cssgrid';

  test('should generate the right CSS with grid gap', () => {
    const result = ie11Fallback.generateCss(step, gap, noCssClass);
    expect(result).toEqual({
      '.no-cssgrid &': {
        '> *': {
          'margin-bottom': '10px',
          'margin-right': '32px',
          width: 'calc((100% - 32px) / 2)'
        },
        '> *:nth-child(2n)': { 'margin-right': '0' },
        display: 'flex',
        'flex-wrap': 'wrap'
      }
    });
  });

  test('should generate the right CSS without grid gap', () => {
    const result = ie11Fallback.generateCss(step, null, noCssClass);
    expect(result).toEqual({
      '.no-cssgrid &': {
        '> *': { float: 'left', width: 'calc((100% / 2)' },
        display: 'flex',
        'flex-wrap': 'wrap'
      }
    });
  });
});

//---
describe('small functions', () => {
  test('parseIntGapSize should create an object', () => {
    let result = ie11Fallback.__private__.parseIntGapSize('10px 32px');
    expect(result.column).toBe(32);
    expect(result.row).toBe(10);

    result = ie11Fallback.__private__.parseIntGapSize('10px');
    expect(result.column).toBe(10);
    expect(result.row).toBe(10);
  });

  test('generateStepsRegex should return the right steps regex', () => {
    const regex = grids.__private__.generateStepsRegex(defaults.gaps);
    const mixinParams = '@mobile 1 @tablet 1 @desktop 3';
    expect(regex.exec(mixinParams)[1]).toBe('mobile');
    expect(regex.exec(mixinParams)[1]).toBe('tablet');
    expect(regex.exec(mixinParams)[1]).toBe('desktop');
  });
});

//---
describe('Generate the grid', () => {
  test('generate grid without IE11 fallback', () => {
    grids.customConfig(defaults, configNoIE11);

    const result = grids.generateGrid(null, '@mobile 6 @desktop 12');
    expect(result).toEqual({
      '&': {
        display: 'grid',
        'grid-column-gap': '1px',
        'grid-row-gap': '1px',
        'grid-template-columns': 'repeat(6, 1fr)',
        width: '100%'
      },
      '@media (--desktop)': {
        'grid-column-gap': '10px',
        'grid-row-gap': '3px',
        'grid-template-columns': 'repeat(12, 1fr)'
      }
    });
  });

  test('generate grid with IE11 fallback', () => {
    grids.customConfig(defaults, configIE11);
    const result = grids.generateGrid(null, '@mobile 6 @tablet 12 @desktop 12');
    expect(result).toEqual({
      '&': {
        display: 'grid',
        'grid-column-gap': '1px',
        'grid-row-gap': '1px',
        'grid-template-columns': 'repeat(6, 1fr)',
        width: '100%'
      },
      '@media (--desktop)': {
        '.no-cssgrid &': {
          '> *': {
            'margin-bottom': '3px',
            'margin-right': '10px',
            width: 'calc((100% - 110px) / 12)'
          },
          '> *:nth-child(12n)': { 'margin-right': '0' },
          display: 'flex',
          'flex-wrap': 'wrap'
        },
        'grid-column-gap': '10px',
        'grid-row-gap': '3px',
        'grid-template-columns': 'repeat(12, 1fr)'
      },
      '@media (--tablet)': { 'grid-template-columns': 'repeat(12, 1fr)' }
    });
  });

  test('generate custom grid without IE11 fallback', () => {
    grids.customConfig(defaults, { ...configNoIE11, ...configCustomGaps });
    const result = grids.generateGrid(
      null,
      '@phone 6 @tablet 12 @desktop 12 @wide 12'
    );
    expect(result).toEqual({
      '&': {
        display: 'grid',
        'grid-column-gap': '10px',
        'grid-row-gap': '10px',
        'grid-template-columns': 'repeat(6, 1fr)',
        width: '100%'
      },
      '@media (--desktop)': {
        'grid-column-gap': '32px',
        'grid-row-gap': '32px',
        'grid-template-columns': 'repeat(12, 1fr)'
      },
      '@media (--tablet)': { 'grid-template-columns': 'repeat(12, 1fr)' },
      '@media (--wide)': {
        'grid-column-gap': '36p',
        'grid-row-gap': '10px',
        'grid-template-columns': 'repeat(12, 1fr)'
      }
    });
  });

  test('generate custom grid with IE11 fallback', () => {
    grids.customConfig(defaults, { ...configIE11, ...configCustomGaps });
    const result = grids.generateGrid(
      null,
      '@phone 6 @tablet 12 @desktop 12 @wide 12'
    );
    expect(result).toEqual({
      '&': {
        display: 'grid',
        'grid-column-gap': '10px',
        'grid-row-gap': '10px',
        'grid-template-columns': 'repeat(6, 1fr)',
        width: '100%'
      },
      '@media (--desktop)': {
        '.no-cssgrid &': {
          '> *': {
            'margin-bottom': '32px',
            'margin-right': '32px',
            width: 'calc((100% - 352px) / 12)'
          },
          '> *:nth-child(12n)': { 'margin-right': '0' },
          display: 'flex',
          'flex-wrap': 'wrap'
        },
        'grid-column-gap': '32px',
        'grid-row-gap': '32px',
        'grid-template-columns': 'repeat(12, 1fr)'
      },
      '@media (--tablet)': { 'grid-template-columns': 'repeat(12, 1fr)' },
      '@media (--wide)': {
        '.no-cssgrid &': {
          '> *': {
            'margin-bottom': '10px',
            'margin-right': '36px',
            width: 'calc((100% - 396px) / 12)'
          },
          '> *:nth-child(12n)': { 'margin-right': '0' },
          display: 'flex',
          'flex-wrap': 'wrap'
        },
        'grid-column-gap': '36p',
        'grid-row-gap': '10px',
        'grid-template-columns': 'repeat(12, 1fr)'
      }
    });
  });
});

describe('Generate colSpan', () => {
  test('generate colSpan without IE11 fallback', () => {
    grids.customConfig(defaults, configNoIE11);

    const result = grids.colSpan(null, '@mobile 6 @desktop 12');
    expect(result).toEqual({
      '&': { 'grid-column-end': 'span 6' },
      '@media (--desktop)': { 'grid-column-end': 'span 12' }
    });
  });

  test('generate colSpan with IE11 fallback', () => {
    grids.customConfig(defaults, configIE11);
    const result = grids.colSpan(null, '@mobile 6 @tablet 12 @desktop 12');
    expect(result).toEqual({
      '&': { 'grid-column-end': 'span 6' },
      '@media (--desktop)': {
        '.no-cssgrid &': { 'flex-grow': '12' },
        'grid-column-end': 'span 12'
      },
      '@media (--tablet)': { 'grid-column-end': 'span 12' }
    });
  });
});
