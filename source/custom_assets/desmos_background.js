$(function() {

    var $main = $('#main');
    $main.append("<div id='calc'></div>");
    $main.css('backgroundColor', 'transparent');

    var $calc = $('#calc');
    $calc.width($main.outerWidth()).height($main.outerHeight());
    $calc.css('opacity', 0.75);

    var $document = $(document);
    docWidth = $document.outerWidth();


    var elt = document.getElementById('calc');
    calc = new Desmos.Calculator(elt, {
        expressions: false,
        settingsMenu: false,
        expressionsTopbar: false,
        zoomButtons: false,
        lockViewport: true
    });

    calc.setExpressions([
        {id: 'mult', latex: 'a=1'},
        {id: 'sin-fam', latex: '\\left[1...5\\right]\\sin(ax)', color: Desmos.Colors.BLUE}
    ]);

    $document.mousemove(function(evt) {
        calc.setExpression({
            id: 'mult',
            latex: 'a=' + (evt.clientX / docWidth)
        });
    });


});