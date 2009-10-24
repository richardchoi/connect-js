/**
 * @module FB
 * @provides mu.content
 * @requires mu.prelude
 */

/**
 * "Content" is a very flexible term. Helpers for things like hidden
 * DOM content, iframes and popups.
 *
 * @class FB.Content
 * @static
 * @access private
 */
FB.copy('Content', {
  _root       : null,
  _hiddenRoot : null,

  /**
   * Append some content.
   *
   * @access private
   * @param content {String|Node} a DOM Node or HTML string
   * @param root    {Node}        (optional) a custom root node
   * @returns {Node} the node that was just appended
   */
  append: function(content, root) {
    // setup the root node, creating it if necessary
    if (!root) {
      if (!FB.Content._root) {
        FB.Content._root = root = document.getElementById('fb-root');
        if (!root) {
          FB.log('The "fb-root" div has not been created.');
          return;
        }
      } else {
        root = FB.Content._root;
      }
    }

    if (typeof content == 'string') {
      var div = document.createElement('div');
      root.appendChild(div).innerHTML = content;
      return div;
    } else {
      return root.appendChild(content);
    }
  },

  /**
   * Append some hidden content.
   *
   * @access private
   * @param content {String|Node} a DOM Node or HTML string
   * @returns {Node} the node that was just appended
   */
  hidden: function(content) {
    if (!FB.Content._hiddenRoot) {
      var
        hiddenRoot = document.createElement('div'),
        style      = hiddenRoot.style;
      style.position = 'absolute';
      style.top      = '-10000px';
      style.width    = style.height = 0;
      FB.Content._hiddenRoot = FB.Content.append(hiddenRoot);
    }

    return FB.Content.append(content, FB.Content._hiddenRoot);
  },

  /**
   * Insert a new iframe. Unfortunately, its tricker than you imagine.
   *
   * @access private
   * @param content {String|Node} a DOM Node or HTML string
   * @param root    {Node}        node to insert the iframe into
   * @param onload  {Function}    optional onload callback
   * @returns {Node} the node that was just appended
   */
  iframe: function(url, root, onload) {
    var node = document.createElement('iframe');

    // general goodness
    node.frameborder = '0';
    node.allowtransparency = 'true';
    node.style.border = 'none';

    // setup onload notification if needed
    if (onload) {
      if (node.attachEvent) {
        // IE is special
        node.attachEvent('onload', onload);
      } else {
        node.onload = onload;
      }
    }

    // In IE, we must set the iframe src _before_ injecting the node into the
    // document to prevent the click noise.
    if (node.attachEvent) {
      node.setAttribute('src', url);
    }
    node = root.appendChild(node);
    // For Firefox, we must set the iframe src _after_ injecting the node into
    // the document to prevent caching issues. This also works fine in other
    // browsers.
    if (!node.attachEvent) {
      node.setAttribute('src', url);
    }

    return node;
  }
});
