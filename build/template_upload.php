<?
/**
 * Template Name: CMS Upload
 **/
get_header();

global $post;
$current_page = $post->post_name;

$state = array();
$state['id'] = get_current_user_id();

$args = array(
  'author'        =>  get_current_user_id(),
  'orderby'       =>  'post_date',
  'order'         =>  'ASC',
  'posts_per_page' => -1,
  'year'          => date('Y'),
);
$submissions = get_posts( $args );

$state['total']['foto'] = 0;
$state['total']['serie'] = 0;
$state['total']['karikatur'] = 0;


// count total series
$args = array(
  'posts_per_page' => -1,
  'year'          => date('Y'),
);
$all_submissions = get_posts( $args );
$all_seris = array();
foreach($all_submissions as $sub) {
  $cf = get_post_custom($sub->ID);
  $kat = $cf['kategorie'][0];
  if($kat == 'serie') {
    $sub->kat = $kat;
    $author = get_author_name($sub->post_author);
    $series_name = $cf['serienname'][0];
    $author_series = $author."_".$series_name;
    $array_place = sanitize_title($author_series);
    // echo $array_place."<br />";

    $n = $all_series[$array_place];
    if (!$n) { $n = 0; }
    if ($n == 0 || $n > 0) { $n = $n + 1; }
    // this array has an index which is a slug made of author name and series name, and contains the total count of images that user submitted in that series.
    $all_series[$array_place] = $n;
  }
}
$state['totalseriescount'] = count($all_series);

foreach($submissions as $sub) {
  $cf = get_post_custom($sub->ID);
  $kat = $cf['kategorie'][0];

  if(!$state['serienname']) {
    $state['serienname'] = $cf['serienname'][0];
  }

  if(!$state['standort']) {
    $state['standort'] = $cf['standort'][0];
  }

  if($kat == 'foto') {
    $state['total']['foto'] = $state['total']['foto'] + 1;
  }
  else if($kat == 'serie') {
    $state['total']['serie'] = $state['total']['serie'] + 1;
  }
  else if($kat == 'karikatur') {
    $state['total']['karikatur'] = $state['total']['karikatur'] + 1;
  }

}

?>

<div id='state' data-state='<? echo json_encode($state); ?>'>
  <!-- <xmp>
    <? print_r($state); ?>
  </xmp> -->
</div>

<section class="upload-page">
  <div class="columns">
    <div class="column is-3 side-menu">
      <? // include('cms-menu.php');  ?>
      <?
      wp_nav_menu(array(
      	'menu' => 'cms',
      	'before' => '<img class="arrow" src="/wp-content/themes/rueckblende/btn_arrow_white.svg">'
      ));
      ?>
    </div>
    <div class="column is-9 main">
      <? the_content(); ?>
    </div>
  </div>
</section>

<? get_footer(); ?>
