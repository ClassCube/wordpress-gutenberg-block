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
})();