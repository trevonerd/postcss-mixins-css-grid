[![CircleCI](https://circleci.com/gh/trevonerd/postcss-mixins-css-grid.svg?style=svg)](https://circleci.com/gh/trevonerd/postcss-mixins-css-grid)

# PostCSS Mixins CSS Grid

The easiest way to implement a responsive grid system using CSS Grid
------

This is a super easy CSS Grid generator mixin for PostCSS.

---
Intallation:

coming soon...

---
Usage:

```
@mixin grid @[step.name] [columns]

or

@mixin grid [template-name]
```



#### Example 1:

if you have these media queries variables:
```css
/* _media-queries.css */

$tablet: (min-width: 720px);
$desktop: (min-width: 960px);
$large-desktop: (min-width: 1379px);
```

and you want a grid system with these rules:

* mobile: 6 columns
* tablet: 6 columns
* desktop: 12 columns
* large-desktop: 24

just write:
```css
/* page.css */

.products-list {
  @mixin grid @mobile 6 @desktop 12 @large-desktop 24
}
```
###### _the @mobile step is the default step in a responsive design, and you don't need to have a sass/CSS variable for this media query._

**if you have near steps with the same amount of columns, you must omit the bigger one to have a smaller CSS output!**

Generated CSS:
```css
/* bundle.css */

...
.grid-default {
    -ms-grid-columns: (1fr) [6];
    grid-template-columns: repeat(6, 1fr);
    grid-row-gap: 10px;
    grid-column-gap: 32px;
    display: -ms-grid;
    display: grid;
    width: 100%;
}
@media (min-width: 960px) {
    .grid-default__1zrRQ {
        -ms-grid-columns: (1fr) [12];
        grid-template-columns: repeat(12, 1fr);
        grid-row-gap: 10px;
        grid-column-gap: 32px;
    }
}
@media (min-width: 1380px) {
    .grid-default__1zrRQ {
        -ms-grid-columns: (1fr) [24];
        grid-template-columns: repeat(24, 1fr);
        grid-row-gap: 10px;
        grid-column-gap: 32px;
    }
}
...
```


deafault configuration:
```javascript
const defaults = {
  gaps: {                               // grid-gaps: row column
    mobile: '5px',
    tablet: '5px',
    desktop: '5px',
    'large-desktop': '5px'
  },
  templates: {                          // add templates to quickly reuse the same responsive grids combo
    default: '@mobile 6 @tablet 12 @desktop 24 @large-desktop 24'
  },
  parser: 'css',                        // media queries variables type: sass ($var) or css (--var) 
  ie11: false,                          // enable Internet Explorer 11 fallback. It makes the grid working on this old browser!
  ie11Exclude: ['mobile', 'tablet'],    // steps to exclude from the IE11 fallback (usually the mobile and tablet)
  noGridClass: '.no-cssgrid',           // the Modernizer class for the browsers that don't support CSS Grid
  mobileStepName: 'mobile'              // the mobile step name to use in the mixin
};
```
