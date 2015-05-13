function customActions(node, canvas) {
    if (node.querySelector('svg')) {
        var svgNodes = node.querySelectorAll('svg');
        var ctx = canvas.getContext('2d');
        for (var i = 0; i < svgNodes.length; i++) {
            // In our case, the svg itself doesn't have any position information. 
            // So we use its bounding parentNode to get offset
            // The svg has some problem getting the offsetParent
            var offset = getRelativeOffset(svgNodes[i].parentNode, node),
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
    // This doesn't work very well with svg element
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

function getOuterHTML(el)
{ 
//    var element = angular.element,
//        svgStr = element('<div />').append(element(el).clone()).html();
//    if (svgStr.match(/xmlns/g) && svgStr.match(/xmlns/g).length > 1) {
//        svgStr = svgStr.replace('xmlns=\"http://www.w3.org/2000/svg\"','');
//    }
//    return svgStr;
    var wrapper = '';
    
    if(el) {
        var inner = 'innerHTML' in el ? el.innerHTML : getInnerHTML(el);
        wrapper = '<' + el.tagName;
        for( var i = 0; i < el.attributes.length; i++ ) {
            wrapper += ' ' + el.attributes[i].nodeName + '="';
            wrapper += el.attributes[i].nodeValue + '"';
        }
        wrapper += '>' + inner + '</' + el.tagName + '>';
    }
    
    console.log(wrapper);
    return wrapper;
}

function getInnerHTML(node) {
    var output = [];
    var childNode = node.firstChild;
    while (childNode) {
      serializeXML(childNode, output);
      childNode = childNode.nextSibling;
    }
    return output.join('');
}

function serializeXML(node, output) {
  var nodeType = node.nodeType;
  if (nodeType == 3) { // TEXT nodes.
    // Replace special XML characters with their entities.
    output.push(node.textContent.replace(/&/, '&amp;').replace(/</, '&lt;').replace('>', '&gt;'));
  } else if (nodeType == 1) { // ELEMENT nodes.
    // Serialize Element nodes.
    output.push('<', node.tagName);
    if (node.hasAttributes()) {
      var attrMap = node.attributes;
      for (var i = 0, len = attrMap.length; i < len; ++i) {
        var attrNode = attrMap.item(i);
        output.push(' ', attrNode.name, '=\'', attrNode.value, '\'');
      }
    }
    if (node.hasChildNodes()) {
      output.push('>');
      var childNodes = node.childNodes;
      for (var i = 0, len = childNodes.length; i < len; ++i) {
        serializeXML(childNodes.item(i), output);
      }
      output.push('</', node.tagName, '>');
    } else {
      output.push('/>');
    }
  } else if (nodeType == 8) {
    // TODO(codedread): Replace special characters with XML entities?
    output.push('<!--', node.nodeValue, '-->');
  } else {
    // TODO: Handle CDATA nodes.
    // TODO: Handle ENTITY nodes.
    // TODO: Handle DOCUMENT nodes.
    throw 'Error serializing XML. Unhandled node of type: ' + nodeType;
  }
}

