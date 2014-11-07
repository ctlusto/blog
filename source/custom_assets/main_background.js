$(function() {

    var $hero = $('#hero');

    var setBG = function() {
        $('#life').remove();
        $hero.append("<div id='life'></div>");
        $hero.css('backgroundColor', 'transparent');

        var $life = $('#life');
        $life.width($hero.outerWidth()).height($hero.outerHeight());

        var life = new Life({
            elt: '#life',
            width: $life.width(),
            height: $life.height(),
            cellSize: 10
        });
        life.init();
    };

    setBG();

    $(window).resize(setBG);


});