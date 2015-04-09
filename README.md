# angular-chart.js

Beautiful, reactive, responsive Clock widgets for Angular.JS using SVG. 

[Demo](http://jtblin.github.io/angular-chart.js/)

# Installation

    bower install angular-clock --save
    
or copy the files from `dist/`. Then add the sources to your code (adjust paths as needed) after 
adding the dependencies for Angular first:

```html
<script src="../bower_components/angular/angular.min.js"></script>
<script src="/bower_components/angular-clock/dist/angular-clock.js"></script>
```

# Utilisation

There are 6 types of charts so 6 directives: `chart-line`, `chart-bar`, `chart-radar`, `chart-pie`, 
`chart-polar-area`, `chart-doughnut`.

They all use mostly the same API:

- `data`: series data
- `labels`: x axis labels (line, bar, radar) or series labels (pie, doughnut, polar area)
- `options`: chart options (as from [Chart.js documentation](http://www.chartjs.org/docs/))
- `series`: (default: `[]`): series labels (line, bar, radar)
- `colours`: data colours (will use default colours if not specified)
- `getColour`: function that returns a colour in case there are not enough (will use random colours if not specified)
- `click`: onclick event handler
- `hover`: onmousemove event handler
- `legend`: (default: `false`): show legend below the chart

There is another directive `chart-base` that takes an extra attribute `chart-type` to define the type
dynamically, see [stacked bar example](http://jtblin.github.io/angular-chart.js/examples/stacked-bars.html).

## Browser compatibility

For IE8 and older browsers, you will need SVG polyfills and Shims


# Example

## Markup

```html
<canvas id="line" class="chart chart-line" data="data" labels="labels" 
	legend="true" series="series" click="onClick"></canvas> 
```

## Javascript

```javascript
angular.module("app", ["chart.js"]).controller("LineCtrl", ['$scope', '$timeout', function ($scope, $timeout) {

  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  
  // Simulate async data update
  $timeout(function () {
    $scope.data = [
      [28, 48, 40, 19, 86, 27, 90],
      [65, 59, 80, 81, 56, 55, 40]
    ];
  }, 3000);
}]);
```

## Reactive

angular-chart.js watch updates on data, series, labels, colours and options and will update, or destroy and recreate, 
the chart on changes.



## Colours

There are a set of 7 default colours. Colours can be replaced using the `colours` attribute.
If there is more data than colours, colours are generated randomly or can be provided 
via a function through the `getColour` attribute.

Hex colours are converted to Chart.js colours automatically, 
including different shades for highlight, fill, stroke, etc.

# Issues
 
Please check if issue exists and otherwise open issue in [github](https://github.com/jtblin/angular-chart.js/issues). 
**Please add a link to a plunker, jsbin, or equivalent.** 
Here is a [jsbin template](http://jsbin.com/dufibi/3/edit?html,js,output) for convenience.

# Contributing
 
Pull requests welcome!

1. Fork the repo
1. Make your changes
1. Run tests: `npm test`
1. Submit pull request

## Contributors

Thank you!



# Author

Deepu K Sasidharan

Inspired from [this demo](https://gist.github.com/BinaryMuse/6100363).

# License

angular-clock.js is available under the [MIT license](http://opensource.org/licenses/MIT).
