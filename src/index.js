import {
	defaultOptions,
	colSpan,
	colStart,
	customConfig,
	generateGrid,
	generateGridTemplateAreasCss,
	spanAll
} from './grids';

export default function(config) {
	if (config) customConfig(defaultOptions, config);

	return {
		grid: generateGrid,
		'col-start': colStart,
		'col-span': colSpan,
		'span-all': spanAll,
		'grid-areas': generateGridTemplateAreasCss
	};
}
