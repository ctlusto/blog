$(function() {

    var $main = $('#main');
    $main.append("<div id='life'></div>");
    $main.css('backgroundColor', 'transparent');

    var $life = $('#life');
    $life.width($main.outerWidth()).height($main.outerHeight());
    $life.css('opacity', 0.75);

    var life = new Life({
        elt: '#life',
        width: $life.width(),
        height: $life.height(),
        cellSize: 10,
    });
    life.init();

});