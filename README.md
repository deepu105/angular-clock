# Angular Clock Widget

Responsive, beautiful clocks for [AngularJS](http://angularjs.org) built using [SVG](https://developer.mozilla.org/en/docs/Web/SVG)

[Demo & Documentation](http://deepu105.github.io/angular-clock/)

# Getting started

### Dependencies

This repository contains **native AngularJS directives** to render a clock face. The **only required dependencies** are:

*   [AngularJS](http://angularjs.org) (tested with 1.3.14 although it probably works with older versions)

### Installation

```
bower install angular-ui-clock --save
```
Alternatively files can be downloaded [downloaded from Github](https://github.com/deepu105/angular-clock).
and copy the files from `dist/`. Then add the sources to your code (adjust paths as needed) after
adding the dependencies for Angular first:

```html
<script src="../bower_components/angular/angular.min.js"></script>
<script src="/bower_components/angular-clock/dist/angular-clock.js"></script>
```

Whichever method you choose the good news is that the overall size is very small: &lt; 4kb for all directives (~1kb with gzip compression!)


As soon as you've got all the files downloaded and included in your page you just need to declare a dependency on the `ds.clock` [module](http://docs.angularjs.org/guide/module):   

```javascript
angular.module('myModule', ['ds.clock']);
```

### CSS

You need to include a link to the css file in your page.

```html
<link rel="stylesheet" href="bower_components/dist/angular-clock.css">
```

If you need the default digital clock font ```Syncopate```, include this. Else check styling section to use your own font
```html
<link href='//fonts.googleapis.com/css?family=Syncopate:400,700' rel='stylesheet' type='text/css'>
```

### Options

There are several options that you can set as attributes on the directive element

1.  `start-time` : init clock with specific time in milliseconds, (default: `undefined`)
2.  `digital-format` : digital clock format in [angular date filter format](https://docs.angularjs.org/api/ng/filter/date) (default: `'HH-mm-ss'`). Pass as string enclosed in single quate
3.  `gmt-offset` : shows time for the given [GMT offset](http://en.wikipedia.org/wiki/List_of_UTC_time_offsets) in clock, (default: `false`, shows local time) example: India -> 5.30, Singapore -> 8 , venezula -> -4.30, Nepal -> 5.45
4.  `show-digital`: shows digital clock, (default: `true` if both show-analog &show-digital are not set)
5.  `show-analog` : shows analog clock, (default: `true` if both show-analog &show-digital are not set)
6.  `show-gmt-info` : shows GMT offset value, (default: `false`)
7.  `theme` : analog clockface theme, (default: `light`)


## Browser compatibility

For IE8 and older browsers, you will need SVG polyfills and Shims


# Example

## Markup

```html
<ds-widget-clock theme="dark" show-secs="true" digital-format="'hh:mm:ss a'"></ds-widget-clock>
```

## Reactive & Responsive

angular clock widget is reactive and fully responsive


# Issues

Please check if issue exists and otherwise open issue in [github](https://github.com/deepu105/angular-clock/issues?state=open)

**Please add a link to a plunker, jsbin, or equivalent.**

# Contributing

Pull requests welcome!

1. Fork the repo
2. Make your changes
3. Write unit tests under test directory
4. Update examples under examples directory
5. Run tests: `npm test`, `gulp test`
6. Submit pull request

## Contributors

Thank you!


# Author

Designed and built by [Deepu K Sasidharan](https://github.com/jtblin)

[Issues](https://github.com/deepu105/angular-clock/issues?state=open)

Inspired from [this demo](https://gist.github.com/BinaryMuse/6100363).

# License

angular-clock.js is available under the [MIT license](http://opensource.org/licenses/MIT).
