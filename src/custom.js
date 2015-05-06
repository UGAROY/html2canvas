function customActions(node, canvas) {
    if (node.querySelector('svg')) {
        var svgNodes = node.querySelectorAll('svg');
        var ctx = canvas.getContext('2d');
        for (var i = 0; i < svgNodes.length; i++) {
            var offset = getRelativeOffset(svgNodes[i], node),
                size = getSvgSize(svgNodes[i]);
            try {
                ctx.drawSvg(getOuterHTML(svgNodes[i]), offset.x, offset.y, size.width, size.height);
            }
            catch (err) {
                console.log(err);
            }
        }
    }
}

function getAbsoluteOffset(el) {
    var x = 0, y =0;
    while (el.offsetParent) {
        x += el.offsetLeft;
        y += el.offsetTop;
        el = el.offsetParent;
    }
    return {
        x: x,
        y: y
    };
}

function getRelativeOffset(el1, el2) {
    var o = getAbsoluteOffset(el1), p = getAbsoluteOffset(el2);
    return {
        x: o.x - p.x,
        y: o.y - p.y
    };
}

function getSvgSize(el) {
    var boudingClientRect = el.getBoundingClientRect();
    return {
        width: boudingClientRect.width,
        height: boudingClientRect.height
    };
}