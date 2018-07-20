import { colSpan, colStart, customConfig, generateGrid, generateGridTheme, spanAll } from './grids';

export default function(config) {
    if (config) customConfig(config);

    return {
        grid: generateGrid,
        'grid-theme': generateGridTheme,
        'col-start': colStart,
        'col-span': colSpan,
        'span-all': spanAll
    };
}
