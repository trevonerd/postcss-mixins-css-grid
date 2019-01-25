const parseIntGapSize = gap => {
  const values = gap.split(' ');

  return {
    column: values[1] ? parseInt(values[1]) : parseInt(values[0]),
    row: parseInt(values[0])
  };
};

const generateCss = (step, stepGap, noCssClass) => {
  let ie11ColumnsCss = {};

  if (stepGap) {
    const stepGapObj = parseIntGapSize(stepGap);

    const gapWidth = (step.columns - 1) * stepGapObj.column;

    ie11ColumnsCss[`> *`] = {
      float: 'left',
      'margin-bottom': `${stepGapObj.row}px`,
      'margin-right': `${stepGapObj.column}px`,
      width: `calc((100% - ${gapWidth}px) / ${step.columns})`
    };

    ie11ColumnsCss[`> *:nth-of-type(${step.columns}n)`] = {
      'margin-right': `0`
    };
  } else {
    ie11ColumnsCss[`> *`] = {
      float: 'left',
      width: `calc((100% / ${step.columns})`
    };
  }

  const noGridCss = {};
  noGridCss[`${noCssClass} &`] = { ...ie11ColumnsCss };

  return { ...noGridCss };
};

export default {
  generateCss,
  __private__: { parseIntGapSize }
};
