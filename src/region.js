c3_chart_internal_fn.initRegion = function () {
    var $$ = this;
    $$.region = $$.main.append('g')
        .attr("clip-path", $$.clipPath)
        .attr("class", CLASS.regions);
};
c3_chart_internal_fn.updateRegion = function (duration) {
    var $$ = this, config = $$.config;

    // hide if arc type
    $$.region.style('visibility', $$.hasArcType() ? 'hidden' : 'visible');

    $$.mainRegion = $$.main.select('.' + CLASS.regions).selectAll('.' + CLASS.region)
        .data(config.regions);
    $$.mainRegion.enter().append('g')
        .attr('class', $$.classRegion.bind($$))
      .append('rect')
        .style("fill-opacity", 0);
    $$.mainRegion.exit().transition().duration(duration)
        .style("opacity", 0)
        .remove();
};
c3_chart_internal_fn.redrawRegion = function (withTransition) {
    var $$ = this,
        regions = $$.mainRegion.selectAll('rect'),
        x = $$.regionX.bind($$),
        y = $$.regionY.bind($$),
        w = $$.regionWidth.bind($$),
        h = $$.regionHeight.bind($$);
    return [
        (withTransition ? regions.transition() : regions)
            .attr("x", x)
            .attr("y", y)
            .attr("width", w)
            .attr("height", h)
            .attr("data-additional", function(d){ return d.additional ? d.additional : ""; })
            .style("fill-opacity", function (d) { return isValue(d.opacity) ? d.opacity : 0.1; })
    ];
};
c3_chart_internal_fn.regionX = function (d) {
    var $$ = this, config = $$.config,
        xPos, yScale = (d.axis === 'y' || d.axis === 'xy') ? $$.y : $$.y2;
    if (d.axis === 'y' || d.axis === 'y2') {
        xPos = config.axis_rotated ? ('start' in d ? yScale(d.start) : 0) : 0;
    } else if (d.axis === 'xy' || d.axis === 'xy2') {
        xPos = config.axis_rotated ?
            ('start' in d && 'y' in d.start ? yScale($$.isTimeSeries() ? $$.parseDate(d.start.y) : d.start.y) : 0)
            : ('start' in d && 'x' in d.start ? $$.x($$.isTimeSeries() ? $$.parseDate(d.start.x) : d.start.x) : 0);
    } else {
        xPos = config.axis_rotated ? 0 : ('start' in d ? $$.x($$.isTimeSeries() ? $$.parseDate(d.start) : d.start) : 0);
    }
    return xPos;
};
c3_chart_internal_fn.regionY = function (d) {
    var $$ = this, config = $$.config,
        yPos, yScale = (d.axis === 'y' || d.axis === 'xy') ? $$.y : $$.y2;
    if (d.axis === 'y' || d.axis === 'y2') {
        yPos = config.axis_rotated ? 0 : ('end' in d ? yScale(d.end) : 0);
    } else if (d.axis === 'xy' || d.axis === 'xy2') {
        yPos = config.axis_rotated ?
            ('start' in d && 'x' in d.start ? $$.x($$.isTimeSeries() ? $$.parseDate(d.start.x) : d.start.x) : 0)
            : ('end' in d && 'y' in d.end ? yScale(d.end.y) : 0);
    } else {
        yPos = config.axis_rotated ? ('start' in d ? $$.x($$.isTimeSeries() ? $$.parseDate(d.start) : d.start) : 0) : 0;
    }
    return yPos;
};
c3_chart_internal_fn.regionWidth = function (d) {
    var $$ = this, config = $$.config,
        start = $$.regionX(d), end, yScale = (d.axis === 'y' || d.axis === 'xy') ? $$.y : $$.y2;
    if (d.axis === 'y' || d.axis === 'y2') {
        end = config.axis_rotated ? ('end' in d ? yScale(d.end) : $$.width) : $$.width;
    } else if (d.axis === 'xy' || d.axis === 'xy2') {
        end = config.axis_rotated ?
            ('end' in d && 'y' in d.end ? yScale(d.end.y) : $$.width)
            : ('end' in d && 'x' in d.end ? $$.x($$.isTimeSeries() ? $$.parseDate(d.end.x) : d.end.x) : $$.width);
    } else {
        end = config.axis_rotated ? $$.width : ('end' in d ? $$.x($$.isTimeSeries() ? $$.parseDate(d.end) : d.end) : $$.width);
    }
    return end < start ? 0 : end - start;
};
c3_chart_internal_fn.regionHeight = function (d) {
    var $$ = this, config = $$.config,
        start = this.regionY(d), end, yScale = (d.axis === 'y' || d.axis === 'xy') ? $$.y : $$.y2;
    if (d.axis === 'y' || d.axis === 'y2') {
        end = config.axis_rotated ? $$.height : ('start' in d ? yScale(d.start) : $$.height);
    } else if (d.axis === 'xy' || d.axis === 'xy2') {
        end = config.axis_rotated ?
            ('end' in d && 'x' in d.end ? $$.x($$.isTimeSeries() ? $$.parseDate(d.end.x) : d.end.x) : $$.height)
            : ('start' in d && 'y' in d.start ? yScale(d.start.y) : $$.height);
    } else {
        end = config.axis_rotated ? ('end' in d ? $$.x($$.isTimeSeries() ? $$.parseDate(d.end) : d.end) : $$.height) : $$.height;
    }
    return end < start ? 0 : end - start;
};
c3_chart_internal_fn.isRegionOnX = function (d) {
    return !d.axis || d.axis === 'x';
};
