$ ->

    elt = document.getElementById 'real-calc'
    calc = Desmos.Calculator elt

    calc.setExpressions [{id: '1', latex: 'y=sin(ax)'}, {id: '2', latex: 'a=4'}]

    return