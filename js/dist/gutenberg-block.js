/**
 * Source for adding the MathJax Gutenberg block to WordPress
 */

(function () {
  var __ = wp.i18n.__;
  var createElement = wp.element.createElement;
  var registerBlockType = wp.blocks.registerBlockType;
  var InspectorControls = wp.blocks.InspectorControls;
  var ToggleControl = wp.blocks.ToggleControl;
  var BlockControls = wp.blocks.BlockControls;

  var ed = [];



  /**
   * Register block
   *
   * @param  {string}   name     Block name.
   * @param  {Object}   settings Block settings.
   * @return {?WPBlock}          Block itself, if registered successfully,
   *                             otherwise "undefined".
   */
  registerBlockType(
          'classcube/mathjax-block',
          {
            title: __('MathJax', 'classcube-mathjax-block'),
            icon: 'media-code',
            category: 'common',
            description: __('Insert math equations into your posts using MathJax', 'classcube-mathjax-block'),
            attributes: {
              mathjax: {default: ''},
              imagedata: {default: ''}
            },
            supports: {
              html: false,
              reusable: true
            },

            // Defines the block within the editor.
            edit: function (props) {
              var el = wp.element.createElement;

              var equationEditor = el('div', {
                contentEditable: true,
                onInput: function (evt) {
                  ccMathJax.pngSetDataUrl(jQuery('#block-' + props.clientId).find('div[contentEditable]').html(), jQuery('img[data-preview-id="' + props.clientId + '"]'));
                }
              }, '');

              var previewImage = createElement('img', {
                'data-preview-id': props.clientId
              });
              var previewError = createElement('div', {
                'data-preview-id': props.clientId,
                style: { display: 'none'}
              }, __('The equation is either blank or has an error', 'classcube-mathjax-block')); 
              var previewDiv = createElement('div', {}, previewImage, previewError);

              var loaderImage = createElement('img', {
                src: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                onLoad: function (evt) {
                  jQuery('#block-' + props.clientId).focus(function () {
                    jQuery(this).find('[contentEditable]').focus();
                  });
                }
              });

              return el('div', {}, equationEditor, previewDiv, loaderImage);
            },

            // Defines the saved block.
            save: function (props) {
              return null;
            }
          }
  );
})();;
/**
 * Functions for working with MathJax JavaScript admin side. 
 * 
 * None of this happens client side, it's an image by that point. 
 * 
 * @see https://javascriptweblog.wordpress.com/2010/12/07/namespacing-in-javascript/
 * 
 * @type {}
 */
console.info(window.MathJax);
//window.MathJax = {
//  jax: ["input/TeX", "output/SVG"],
//  extensions: ["tex2jax.js", "MathMenu.js", "MathZoom.js"],
//  showMathMenu: false,
//  showProcessingMessages: false,
//  messageStyle: "none",
//  SVG: {
//    useGlobalCache: false
//  },
//  TeX: {
//    extensions: ["AMSmath.js", "AMSsymbols.js", "autoload-all.js"]
//  }
//};

var ccMathJax = (function () {
  var oldMathJax = {};

  return {

    /**
     * Converts a MathJax string to a PNG DataURL.
     * 
     * @see https://codepen.io/pkra/pen/PZLyQO 
     * @see https://stackoverflow.com/a/13764188/1561431
     * 
     * @param {string} mathJax
     * @param {element} el  Element to set PNG data url as source
     * @return {string}
     */
    pngSetDataUrl: function (mathJax, el) {
      /* Strip out HTML and put in line breaks */
      var mathJax = mathJax.trim()
              .replace(/<br\s*\/*>/ig, '\n ')
              .replace(/(<(p|div))/ig, '\n $1')
              .replace(/(<([^>]+)>)/ig, "");

      this.setupMathJax();
      var clientId = jQuery(el).data('previewId');

      this.tex2img(mathJax, function (output) {
        if (output == '' || output == 'data:,') {
          jQuery(el).hide();
          jQuery('div[data-preview-id="' + clientId + '"]').show();
        } else {
          jQuery('div[data-preview-id="' + clientId + '"]').hide();
          jQuery(el).show();
          jQuery(el).attr('src', output);
        }
      });

      this.resetMathJax();
    },

    tex2img: function (formula, callback) {
      MathJax.Hub.Config({
        SVG: {
          useGlobalCache: false
        }
      });
      MathJax.Hub.Queue(function () {
        var wrapper = MathJax.HTML.Element('span', {}, formula);
        MathJax.Hub.Typeset(wrapper, function () {
          var svg = wrapper.getElementsByTagName('svg'); 
          if (svg.length) {
            svg[0].setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            var img = new Image();
            img.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg[0].outerHTML)));

            img.onload = function () {
              var canvas = document.createElement('canvas');
              canvas.width = img.width * 2;
              canvas.height = img.height * 2;
              var context = canvas.getContext('2d');
              context.drawImage(img, 0, 0, img.width * 2, img.height * 2);
              callback(canvas.toDataURL('image/png'));
            }
          } else {
            callback(''); 
          }

        });
      });
    },

    /**
     * Sets up MathJax to how we need it to create the PNG Data URL, but
     * first stores the old version so it can be changed later. 
     * 
     * @return {void}
     */
    setupMathJax: function () {
      oldMathJax = window.MathJax;

//      window.MathJax = {
//        jax: ['input/TeX', 'output/SVG'],
//        extensions: ['tex2jax.js', 'MathMenu.js', 'MathZoom.js'],
//        showMathMenu: false,
//        showProcessingMessage: false,
//        messageStyle: 'none',
//        SVG: {
//          useGlobalCache: false
//        },
//        TeX: {
//          extensions: ['AMSmath.js', 'AMSsymbols.js', 'autoload-all.js']
//        }
//      }
    },

    /**
     * Set MathJax back to however it was before trying to parse
     * @return {void}
     */
    resetMathJax: function () {
//      window.MathJax = oldMathJax;
    }
  };
})();

