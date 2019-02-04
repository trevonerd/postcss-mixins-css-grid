const parseIntGapSize = gap => {
  const values = gap.split(' ');

  return {
    column: values[1] ? parseInt(values[1]) : parseInt(values[0]),
    row: parseInt(values[0])
  };
};

const generateCss = (step, stepGap, noCssClass) => {
  let ie11ColumnsCss = {};

  ie11ColumnsCss = {
    display: 'flex',
    'flex-wrap': 'wrap'
  };

  if (stepGap) {
    const stepGapObj = parseIntGapSize(stepGap);

    const gapWidth = (step.columns - 1) * stepGapObj.column;

    ie11ColumnsCss[`> *`] = {
      'margin-bottom': `${stepGapObj.row}px`,
      'margin-right': `${stepGapObj.column}px`,
      width: `calc((100% - ${gapWidth}px) / ${step.columns})`
    };

    ie11ColumnsCss[`> *:nth-child(${step.columns}n)`] = {
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

const colSpan = (stepColumns, noCssClass) => {
  const ie11Span = {
    'flex-grow': stepColumns
  };

  const noGridCss = {};
  noGridCss[`${noCssClass} &`] = ie11Span;

  return { ...noGridCss };
};

export default {
  generateCss,
  colSpan,
  __private__: { parseIntGapSize }
};
