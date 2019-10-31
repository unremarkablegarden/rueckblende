<?
/**
 * Template Name: CMS Upload
 **/
get_header();

global $post;
$current_page = $post->post_name;

if(isset($_GET['action'])) {
  $action = $_GET['action'];
} else {
  $action = false;
}

if ($action == 'juryedit') $juryedit = true;
else $juryedit = false;

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
$state['juryedit'] = $juryedit;

um_fetch_user(get_current_user_id());
$profession = um_user('user_profession');
$state['usertype'] = strtolower($profession[0]);
$state['username'] = um_user('user_login');

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

// Notice: Undefined variable: all_series in /var/www/html/wp-content/themes/rueckblende/build/template_upload.php on line 66
if( isset($all_series) ) {
  $state['totalseriescount'] = count($all_series) - 1;
} else {
  $state['totalseriescount'] = 0;
}


foreach($submissions as $sub) {
  $cf = get_post_custom($sub->ID);
  $kat = $cf['kategorie'][0];

  // echo "<h1>".$state['serienname'] = $cf['serienname'][0]."</h1>";

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

    <? if(!$juryedit): ?>
      <div class="column is-3 side-menu">
        <? // include('cms-menu.php');  ?>
        <?
        wp_nav_menu(array(
        	'menu' => 'cms',
        	'before' => '<img class="arrow" src="/wp-content/themes/rueckblende/btn_arrow_white.svg">'
        ));
        ?>
      </div>
    <? endif; ?>

    <div class="column is-9 main">
      <?
      if (!$profession) {
        $profession = 'unknown';
      } else {
        $profession = strtolower($profession[0]);
      }
      echo '<div class="hidden usertype" data-usertype="'.$profession.'"></div>';      
      ?>
      <? the_content(); ?>
    </div>
  </div>
</section>

<script>
var $buoop = {required:{e:-4,f:-3,o:-3,s:-1,c:-3},insecure:true,unsupported:true,mobile:false,api:2018.10,test:false };
function $buo_f(){
 var e = document.createElement("script");
 e.src = "//browser-update.org/update.min.js";
 document.body.appendChild(e);
};
try {document.addEventListener("DOMContentLoaded", $buo_f,false)}
catch(e){window.attachEvent("onload", $buo_f)}
</script>

<? if($juryedit): ?>
  <style>
    #pre-header-spacer {
      height: 0 !important;
      min-height: 0 !important;
      overflow: hidden !important;
    }
    .wpuf_custom_html_Custom_HTML_19951 {
      display: none;
    }
  </style>
<? endif; ?>

<? get_footer(); ?>
