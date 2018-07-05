import { colSpan, colStart, customConfig, generateGrid } from './grids';

export default function(config) {
    if (config) customConfig(config);

    return {
        grid: generateGrid,
        'col-start': colStart,
        'col-span': colSpan
    };
}
