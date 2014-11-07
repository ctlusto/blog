$ ->

    $hero = $ '#hero'
    setBG = () ->
        $('#life').remove()
        $hero.append("<div id='life'></div>").css 'backgroundColor', 'transparent'

        $life = $ '#life'
        $life.width($hero.width()).height $hero.height()

        life = new Life {
            elt: '#life'
            width: $life.width()
            height: $life.height()
            cellSize: 10
        }
        life.init()
        return

    setBG();

    $(window).resize setBG

    return