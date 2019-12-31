<?php

/**
 * Plugin Name:       MathJax Gutenberg Block
 * Plugin URI:        https://classcube.com
 * Description:       Embed static images from MathJax code instead of needing the MathJax JavaScript library loaded client side
 * Version:           0.0.6
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            ClassCube
 * Author URI:        https://classcube.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       classcube-mathjax-block
 */

namespace ClassCube\WordPress\MathJax;

Block::init();

class Block {

  /**
   * Bootstrap that sets up all the other actions for this plugin.
   */
  public static function init() {
    add_action( 'init', [ self::class, 'register_block' ] );
  }

  public static function register_block() {
    $script_name = true || defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? 'gutenberg-block.js' : 'gutenberg-block.min.js';

    wp_register_script( 'classcube-mathjax', 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js', [], null );
//    wp_register_script('classcube-mathjax', 'https://cdn.mathjax.org/mathjax/latest/MathJax.js', [], null); 
    wp_register_script(
            'classcube-mathjax-block',
            plugins_url( 'js/dist/' . $script_name, __FILE__ ),
            [ 'jquery', 'wp-blocks'],
            self::version()
    );
    

    wp_register_style(
            'classcube-mathjax-block',
            plugins_url( 'css/dist/style.min.css', __FILE__ ),
            [],
            self::version()
    );

    register_block_type( 'classcube/mathjax-block', [
        'editor_script' => ['classcube-mathjax-block', 'classcube-mathjax'],
        'editor_style' => 'classcube-mathjax-block',
        'render_callback' => [self::class, 'render_callback']
    ] );
  }

  /**
   * Gets the version from package.json
   */
  public static function version() {
    $json = json_decode( file_get_contents( __DIR__ . '/package.json' ), true );
    if ( empty( $json ) || empty( $json[ 'version' ] ) ) {
      return false;
    }
    return $json[ 'version' ];
  }
  
  public static function render_callback($props) {
    if (strlen($props['imageData']) < 10) {
      if (define('WP_DEBUG') && WP_DEBUG) {
        return '<p>' . __('Image data not available for MathJax equation', 'classcube-mathjax-block') . '</p>'; 
      }
    }
    return '<img src="' . $props['imageData'] . '">'; 
  }

}
