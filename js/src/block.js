/**
 * Source for adding the MathJax Gutenberg block to WordPress
 */

(function () {
  var __ = wp.i18n.__;
  var createElement = wp.element.createElement;
  var registerBlockType = wp.blocks.registerBlockType;
 

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
              divContents: {default: ''},
              imageData: {default: ''}
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
                className: 'cc-equation-editor',
                onInput: function (evt) {
                  ccMathJax.pngSetDataUrl(jQuery('#block-' + props.clientId).find('div[contentEditable]').html(), jQuery('img[data-preview-id="' + props.clientId + '"]'), props);
                }
              }, '');

              var previewImage = createElement('img', {
                'data-preview-id': props.clientId
              });
              var previewError = createElement('div', {
                'data-preview-id': props.clientId,
                'data-preview': 'error',
                style: {display: 'none'}
              }, __('The equation is either blank or has an error', 'classcube-mathjax-block'));
              var previewDiv = createElement('div', {
                'data-preview-id': props.clientId,
                'data-preview': 'wrapper',
                className: 'cc-mathjax-preview-wrapper'
              }, previewImage, previewError);

              var loaderImage = createElement('img', {
                src: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                onLoad: function (evt) {jQuery('#block-' + props.clientId).find('.cc-equation-editor').html(props.attributes.divContents); 
                  jQuery('#block-' + props.clientId).focus(function () {
                    jQuery(this).find('[contentEditable]').focus();
                  });
                  ccMathJax.pngSetDataUrl(jQuery('#block-' + props.clientId).find('div[contentEditable]').html(), jQuery('img[data-preview-id="' + props.clientId + '"]'), props); 
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
})();