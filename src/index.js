import { colSpan, colStart, customConfig, generateGrid } from './grids';

const mixins = function(config) {
    if (config) customConfig(config);
    
    return {
        grid: generateGrid,
        'col-start': colStart,
        'col-span': colSpan
    };
};

export { mixins };
