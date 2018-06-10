class CreateElement {
    constructor() {}

    /**
     * createElement()
     * Used to create a Javascript Node
     * @param   {string} element    Can be div, span, a, etc.
     * @param   {object} attribute  Can be {'id': 'myId','class': 'myClass myClass2'}
     * @param   {array} inner       Can be [someEl, someEl2] or 'my inner text'
     * @example                     createElement('div',{'id':'myId','class':'myClass'}, 'myText');
     * @return  {Node}              <div id='myId' class='myClass'>myText</div>
     */
    create (element, attribute, inner) {
        if ( typeof (element) === 'undefined' ) {
            return false;
        }
        if ( typeof (inner) === 'undefined' ) {
            inner = '';
        }
        var el = document.createElement(element);
        if ( attribute !== null ) {
            Object.keys(attribute).forEach(function (key, value) {
                el.setAttribute(key, attribute[key]);
            });
        }
        if ( !Array.isArray(inner) ) {
            inner = [inner];
        }
        for ( var k = 0; k < inner.length; k++ ) {
            if (inner[k].tagName) {
                el.appendChild(inner[k]);
            } else {
                el.appendChild(document.createTextNode(inner[k]));
            }
        }
        return el;
    };
}