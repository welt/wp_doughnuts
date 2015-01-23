<?php
/*
Plugin Name: ChartJS Doughnuts for WordPress
Plugin URI: https://github.com/welt/wp_doughnuts.git
Author: welt
Author URI: github.com/welt
Description: Loads Chart.js [http://www.chartjs.org], provides Doughnut shortcode. Usage: [donut id="caramel" type="large" cvals="32000, 600, 1000, 200"]some donut[/donut]. Needs unique ID for each doughnut. cvals: one for each value to represent in the ring. Type: `small` or `large` (default). Text appears in a div underneath Canvas.
Version: 1.0.1
*/

//
// positioning styled user text from the CMS within the Canvas of each instance is work inprogress
// so we place the user text in a div underneath the Canvas for now
//

// filters: rw_wp_doughnut_html, rw_wp_doughnut_charts_load_js

// Restrictions
defined('ABSPATH') or die("&iexcl;Vous ne pouvez pas accéder directement à ce truc l&agrave;!");

// Constants 
define ( 'RW_WP_DOUGHNUT_CHARTS_VERSION', '1.0' );
define ( 'RW_WP_DOUGHNUT_CHARTS_DIR', plugin_dir_path(__FILE__) );
define ( 'RW_WP_DOUGHNUT_CHARTS_URL', plugins_url().'/rw_wp_doughnuts' );
if ( ! defined( 'RW_WP_DOUGHNUT_CHARTS_LOAD_JS' ) ) {
	define( 'RW_WP_DOUGHNUT_CHARTS_LOAD_JS', true );
};

if ( ! function_exists( 'rw_wp_doughnut_chart_script_loader' ) ) :
	// Example filter usage, in functions.php
	// `add_filter( 'rw_wp_doughnut_charts_load_js', '__return_false' );`
	//
	function rw_wp_doughnut_charts_load_js() {
		return apply_filters( 'rw_wp_doughnut_charts_load_js', RW_WP_DOUGHNUT_CHARTS_LOAD_JS );
	}
	function rw_wp_doughnut_chart_script_loader() {
		//
		// load plugin default scripts
		// use rw_wp_doughnut_charts_load_js filter if loading copies of these scripts from theme instead
		//
		wp_register_script( 'chartjs_script', RW_WP_DOUGHNUT_CHARTS_URL.'/Chart.min.js', false, RW_WP_DOUGHNUT_CHARTS_VERSION, true);
		wp_register_script( 'doughnuts', RW_WP_DOUGHNUT_CHARTS_URL. '/rw_wp_doughnuts.js', array( 'jquery', 'chartjs_script'), RW_WP_DOUGHNUT_CHARTS_VERSION, true );

		if ( hl_avansee_charts_load_js() ) {
			wp_enqueue_script( 'chartjs_script' );
			wp_enqueue_script( 'doughnuts' );
		};
	}
	if ( !is_admin() ) {
		add_action('wp_enqueue_scripts', 'rw_wp_doughnut_chart_script_loader', 99);
	}
endif;

/**
 * Doughnut shortcode
 *
 * ID: ID of the Doughnut
 * Type: small or large [default]
 * cvals: comma separated list of segment values
 *
 */

if ( ! function_exists( 'rw_wp_doughnut_shortcode' ) ) :

	function rw_wp_doughnut_shortcode( $atts, $content = null ) {

		// Default values
		//
		extract( shortcode_atts( array(
			'id'         => 'donutChart', // Canvas ID = $id, $id also also gets used as a CSS class name on the container div
			'type'     => 'large',
			'cvals'      => '100',
			'show'		=> 'false' // currently unused option to show donut value with text inside
		), $atts ) );

		//$vals_arr = explode( ', ', $cvals );
		$delimiters = array(",",".","|",":");
		$cvals = str_replace( $delimiters, $delimiters[0], $cvals );
		$vals_arr = explode( $delimiters[0], $cvals );

		switch ($type) {

			case "small":

				ob_start(); ?>
					<div class="canvas_container canvas_container_small <?php echo $id; ?>"><div><?php if ( ! ( null == $content ) ) { echo $content; }; ?></div><canvas id="<?php echo $id; ?>" class="doughnut" width="200" height="200" dir="ltr" data-cval='<?php echo json_encode($vals_arr); ?>' <?php if ( "true" == $show ) {?>data-show='true'<?php }; ?>></canvas></div>
				<?php
					$html = ob_get_contents();
					ob_get_clean();
					return apply_filters( 'rw_wp_doughnut_html', $html );

			default:

				ob_start(); ?>
					<div class="canvas_container canvas_container_large <?php echo $id; ?>"><div><?php if ( ! ( null == $content ) ) { echo $content; }; ?></div><canvas id="<?php echo $id; ?>" class="doughnut" width="400" height="400" dir="ltr" data-cval='<?php echo json_encode($vals_arr); ?>' <?php if ( "true" == $show ) {?>data-show='true'<?php }; ?>></canvas></div>
				<?php
					$html = ob_get_contents();
					ob_get_clean();
					return apply_filters( 'rw_wp_doughnut_html', $html );

		};

		return;
	}

	add_shortcode( 'doughnut', 'rw_wp_doughnut_shortcode' );
	add_shortcode( 'donut', 'rw_wp_doughnut_shortcode' );

endif;

?>
