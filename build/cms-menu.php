<?
if (is_user_logged_in()) {
	wp_nav_menu(array(
		'menu' => 'cms',
		'before' => '<img class="arrow" src="/wp-content/themes/rueckblende/btn_arrow_white.svg">'
	));
}
?>
