const parseIntGapSize = gap => {
	const values = gap.split(' ');

	return {
		x: values[1] ? parseInt(values[1]) : parseInt(values[0]),
		y: parseInt(values[0])
	};
};

const generateCss = (step, stepGap, noCssClass) => {
	let ie11ColumnsCss = {};

	stepGap = parseIntGapSize(stepGap);

	for (let j = 1; j <= step.columns; j++) {
		ie11ColumnsCss[`> *:nth-child(${j})`] = {
			'-ms-grid-column': j + ' '
		};
	}

	ie11ColumnsCss['> *'] = {
		'margin-left': stepGap.x / 2,
		'margin-right': stepGap.x / 2
	};

	ie11ColumnsCss[`> *:first-child`] = {
		'margin-left': 0
	};

	ie11ColumnsCss[`> *:last-child`] = {
		'margin-right': 0
	};

	var noGridCss = {};
	noGridCss[`:global(${noCssClass}) &`] = { ...ie11ColumnsCss };

	return { ...noGridCss };
};

export default {
	generateCss,
	__private__: { parseIntGapSize }
};
