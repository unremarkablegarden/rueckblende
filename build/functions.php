<?php

// disable ACF hiding custom fields option in WP admin post editor
add_filter( 'acf/settings/remove_wp_meta_box', '__return_false' );

// Register a REST route
add_action( 'rest_api_init', function () {
  register_rest_route( 'relevanssi/v2', '/fetch/', array(
    'methods' => 'GET',
    'callback' => 'relevanssi_rest'
  ));
});


function relevanssi_rest() {

  $search = $_GET['s'];
  $per_page = $_GET['pp'];
  if(!$per_page) $per_page = 20;
  $per_page_q = $per_page;
  $paged = $_GET['pg'];
  if(!$paged) $paged = 1;
  $y = $_GET['y'];
  $c = $_GET['c'];
  $w = $_GET['w'];
  $uid = $_GET['uid'];
  $filter_series = $_GET['filter_series']; // bool
  $series_name = $_GET['series_name'];
  $shortlist = $_GET['shortlist'];

  global $Rquery;

  $args = array(
    'post_type'	=> 'entry',
    'posts_per_page' => $per_page,
    // 'order' => 'ASC',
    'paged' => $paged
    // 'offset' => ($per_page * $paged)
  );
  $Rquery = new WP_Query( $args );

  $Rquery->query_vars['magic'] = true;
  $Rquery->query_vars['custom_year'] = $y;
  $Rquery->query_vars['custom_category'] = $c;
  $Rquery->query_vars['winner'] = $w;
  $Rquery->query_vars['filter_series'] = $filter_series;
  $Rquery->query_vars['per_page'] = $per_page;
  $Rquery->query_vars['s'] = $search;
  $Rquery->query_vars['uid'] = $uid;
  $Rquery->query_vars['pg'] = $paged;
  $Rquery->query_vars['series_name'] = $series_name;
  $Rquery->query_vars['shortlist'] = $shortlist;

  // global $query;
  relevanssi_do_query($Rquery); // ----> rlv_hits_filter($hits)

  if(count($Rquery->posts) > 0):

    $data = array();
    // $series_names = array();
    $i = 0;

    foreach($Rquery->posts as $p):
      $id = $p->ID;
      $debug = $p->debug;
      // $debug = count($Rquery->posts);

      $series_name = get_field('series_name', $id);

      // multiple winner fields into one var
      if(!empty(get_field('photo_prize_first', $id))) $winner = 'photo_prize_first';
      elseif(!empty(get_field('photo_prize_2', $id))) $winner = 'photo_prize_2';
      elseif(!empty(get_field('photo_prize_3', $id))) $winner = 'photo_prize_3';
      elseif(!empty(get_field('das_scharfe_sehen_1', $id))) $winner = 'das_scharfe_sehen_1';
      elseif(!empty(get_field('das_scharfe_sehen_2', $id))) $winner = 'das_scharfe_sehen_2';
      elseif(!empty(get_field('cartoon_prize_1', $id))) $winner = 'cartoon_prize_1';
      elseif(!empty(get_field('cartoon_prize_2', $id))) $winner = 'cartoon_prize_2';
      elseif(!empty(get_field('cartoon_prize_3', $id))) $winner = 'cartoon_prize_3';
      elseif(!empty(get_field('series_prize_1', $id))) $winner = 'series_prize_1';
      elseif(!empty(get_field('photo_public', $id))) $winner = 'photo_public';
      elseif(!empty(get_field('cartoon_public', $id))) $winner = 'cartoon_public';
      elseif(!empty(get_field('auszeichnung_karikatur', $id))) $winner = 'auszeichnung_karikatur';
      else $winner = false;

      if( $winner != false && $winners == 'exclude') $skip = true;
      else $skip = false;

      // --- filter in relevanssi_hits_filter ---
      $i++; // first = 1

      // $imgID = get_field('attachment_id', $id);
      $imageid = get_field('imageid', $id);
      if(is_numeric($image_id)) {
        // new image
        $large = '1';
        $thumb = '2';
      } else {
        // old image
        $large = '/wp-content/photos/' . $year . '/' . $imageid . '.jpg';
        $thumb = '/wp-content/photos/' . $year . '/thumbs/' . $imageid . '.jpg';
      }
      // if(!empty($imgID)) {
      //   // old image
      //   $large = '/wp-content/photos/' . $year . '/' . $imageid . '.jpg';
      //   $thumb = '/wp-content/photos/' . $year . '/thumbs/' . $imageid . '.jpg';
      // } else {
      //   // new image
      //   $largr = wp_get_attachment_image_src($imgID, 'large');
      //   $thumb = wp_get_attachment_image_src($imgID, 'thumbnail');
      //   $img = $img[0];
      //   $thumb = $thumb[0];
      //   $retina = wr2x_get_retina_from_url($large);
      //   $retinaT = wr2x_get_retina_from_url($thumb);
      //   if($retina) { $large = $retina; }
      //   if($retinaT) { $thumb = $retinaT; }
      // }

      $uid = get_field('vorname', $id)."/".get_field('nachname', $id);
      $year = get_field('year', $id);

      $vname = get_field('vorname', $id);
      $nname = get_field('nachname', $id);
      $vname = mb_convert_case(mb_strtolower($vname, "UTF-8"), MB_CASE_TITLE, "UTF-8");
      $nname = mb_convert_case(mb_strtolower($nname, "UTF-8"), MB_CASE_TITLE, "UTF-8");

      $entry = array(
        // 'magic' => $p->magic,
        // 'large' => '/wp-content/photos/' . $year . '/' . $imageid . '.jpg',
        // 'thumb' => '/wp-content/photos/' . $year . '/thumbs/' . $imageid . '.jpg',
        'large' => $large,
        'thumb' => $thumb,
        'vorname' => $vname,
        'nachname' => $nname,
        'fullname' => $vname." ".$nname,
        'year' => $year,
        'date' => get_field('date', $id),
        'location' => get_field('location', $id),
        'caption' => get_field('caption', $id),
        'category' => get_field('category', $id),
        'link' => get_permalink($id),
        'series_name' => $series_name,
        'series_order' => get_field('series_order', $id),
        'winner' => $winner,
        'uid' => $uid,
        'shortlist' => get_field('shortlist', $id),
        'filename' => get_field('filename', $id),
        'debug' => $debug,
      );

      // please master
      $data[] = $entry;

      // endif;
    endforeach;
  else:
    $data[] = 'nada';
  endif;

  return $data;

} // main function















add_filter('relevanssi_search_ok', 'search_trigger');
function search_trigger($search_ok) {
  global $wp_query, $Rquery;
  if ( !isset($wp_query->query['s']) && $Rquery->query_vars['magic'] ) {
    $search_ok = true;
  }
  return $search_ok;
}



add_filter('relevanssi_hits_filter', 'rlv_hits_filter');
function rlv_hits_filter($hits) {

  global $Rquery;
  $y =              $Rquery->query_vars['custom_year'];
  $c =              $Rquery->query_vars['custom_category'];
  $w =              $Rquery->query_vars['winner'];
  $uid =            $Rquery->query_vars['uid'];
  $per_page =       $Rquery->query_vars['per_page'];
  $pg =             $Rquery->query_vars['pg'];
  $shortlist =      $Rquery->query_vars['shortlist'];
  $series_name =    $Rquery->query_vars['series_name'];
  $filter_series =  $Rquery->query_vars['filter_series'];
                    // if($filter_series == 'true') $filter_series = true;
                    // if($filter_series == 'false') $filter_series = false;

  $prizes = explode(',', $w);
  $w_mode = strtoupper( array_shift($prizes) );
  if(!$per_page) $per_page = 20;
  $per_page_q = $per_page;
  if(!$pg) $pg = 1;

  if($w_mode == 'INCLUDE') {
    $w_comp = 'LIKE';
    $rel = 'OR';
  }
  if($w_mode == 'EXCLUDE') {
    $w_comp = 'NOT LIKE';
    $rel = 'AND';
  }

  // ------------------------------------------------------------
  // FILTERS ONLY, NO SEARCH
  if ($hits[0] == null) {

    if($y) {
      $meta_y = array(
        'key' 		=> 'year',
        'value'		=> $y
      );
    } else { $meta_y = null; }

    if($c) {
      $meta_c = array(
        'key' 		=> 'category',
        'value'		=> $c
      );
    } else { $meta_c = null; }

    if($shortlist) {
      $meta_shortlist = array(
        'key' 		=> 'shortlist',
        'value'		=> true
      );
    } else { $meta_shortlist = null; }

    if($series_name) {
      $meta_series_name = array(
        'key' 		=> 'series_name',
        'value'		=> $series_name
      );
    } else { $meta_series_name = null; }

    if($c == 'Serie') {
      if($filter_series == true || $filter_series == 'true') {
        $meta_filter_series = array(
          'key'     => 'series_order',
          'value'   => 1
        );
      }
    } else { $meta_filter_series = null; }

    if($uid) {
      $names = explode('/', $uid);
      $meta_uid = array(
        'relation'=> 'AND',
        array(
          'key'     => 'vorname',
          'value'   => $names[0],
          'compare' => '='
        ),
        array(
          'key'     => 'nachname',
          'value'   => $names[1],
          'compare' => '='
        ),
      );
    } else { $meta_uid = null; }

    if($w) {
      $prizes_meta = array(
        'relation' => $rel
      );
      foreach($prizes as $p) {
        $m = array(
          'key' => $p,
          'value' => 'Yes',
          'compare' => $w_comp
        );
        $prizes_meta[] = $m;
      }
    } else { $prizes_meta = null; }

    // if($filter_series && $c == 'Serie') {
    //   $per_page = $per_page * 6;
    // }

    if($series_name) {
      $orderby = 'meta_value';
      $meta_key = 'filename';
    } else {
      $orderby = 'name';
      $meta_key = '';
      // $orderby = 'meta_value';
      // $meta_key = 'nachname';
    }

    $ppp = $per_page * $pg;
    // $offset = $ppp - $per_page;
    // if($pg > 1) $offset = $offset - 1;

    $args = array(
      'post_type'	=> 'entry',
      'posts_per_page' => $ppp,
      // 'paged' => $pg,
      // 'offset' => $offset,
      'meta_query' => array(
        'relation' => 'AND',
        $meta_y,
        $meta_c,
        $meta_series_name,
        $meta_filter_series,
        $meta_shortlist,
        $meta_uid,
        $prizes_meta,
      ),
      'orderby' => $orderby,
      'meta_key' => $meta_key,
      'order' => 'ASC',
    );
    $posts = get_posts($args); // array of objects

    // $debug = 'ppp: '.$ppp.', offset: '.$offset.', orderby: '.$orderby.', meta_key: '.$meta_key;

    // foreach($posts as $p) {
    //   $p->debug = $debug;
    // }

    $hits[0] = $posts;
  }

  // ------------------------------------------------------------
  // SEARCH AND FILTERS, OR JUST SEARCH
  else {
    $ok = array();
    $series_names = array();

    foreach ($hits[0] as $hit) {
      $id = $hit->ID;
      // $slug = $hit->post_name;
      $series_name = get_field('series_name', $id);
      if($y) $meta_y = get_field('year', $id);
      if($c) $meta_c = get_field('category', $id);
      if($uid) $meta_uid = get_field('vorname', $id)."/".get_field('nachname', $id);


      $the_prizes = array();
      if( $w_mode == 'EXCLUDE' && $prizes ) {
        foreach($prizes as $p) {
          $hp = get_field($p, $id);
          if($hp) {
            $the_prizes[] = $p;
          }
        }
      }

      if( $meta_y == $y && $meta_c == $c && count($the_prizes) == 0) {

        if(!$uid) {
          array_push($ok, $hit);
        } else {
          if($uid == $meta_uid) {
            array_push($ok, $hit);
          }
        }
      }
    }

    $hits[0] = $ok;
  }

  return $hits;
}





function excerpt($title, $cutOffLength) {
  $charAtPosition = "";
  $titleLength = strlen($title);
  do {
      $cutOffLength++;
      $charAtPosition = substr($title, $cutOffLength, 1);
  } while ($cutOffLength < $titleLength && $charAtPosition != " ");
  return substr($title, 0, $cutOffLength) . '...';
}












// ==== FUNCTIONS ==== //

function get_ID_by_slug($page_slug) {
    $page = get_page_by_path($page_slug);
    if ($page) {
        return $page->ID;
    } else {
        return null;
    }
}

function the_entry_src($year, $imageid, $thumb = false) {
  if($thumb === false) {
    echo '/wp-content/photos/'.$year.'/'.$imageid.'.jpg';
  }
  else {
    echo '/wp-content/photos/'.$year.'/thumbs/'.$imageid.'.jpg';
  }
}

function get_entry_src($year, $imageid, $thumb = false) {
  if($thumb === false) {
    return '/wp-content/photos/'.$year.'/'.$imageid.'.jpg';
  }
  else {
    return '/wp-content/photos/'.$year.'/thumbs/'.$imageid.'.jpg';
  }
}


function debug($var) {
  echo "<xmp id='debug'>";
    if($var):
      print_r($var);
    else:
      echo "[empty]";
    endif;
  echo "</xmp>";
}


function get_post_gallery_images_with_info($postid = NULL) {
    if(!isset($postid)){
      global $post;
      $postid = $post;//if the param wasnt sent
      $post_content = $postid->post_content;
    }
    else {
      $content_post = get_post($postid);
      $post_content = $content_post->post_content;
    }

    preg_match('/\[gallery.*ids=.(.*).\]/', $post_content, $ids);
    $images_id = explode(",", $ids[1]);
    $image_gallery_with_info = array();
    foreach ($images_id as $image_id) {
        $attachment = get_post($image_id);
        $large = wp_get_attachment_image_src($image_id, 'large');
        array_push($image_gallery_with_info, array(
            'alt' => get_post_meta($attachment->ID, '_wp_attachment_image_alt', true),
            'caption' => $attachment->post_excerpt,
            'description' => $attachment->post_content,
            'src' => $large[0],
          )
        );
    }
    return $image_gallery_with_info;
}



function the_creator() {
  $creator = get_field('creator');
  $creator_data = get_userdata($creator['ID']);
  echo $creator_data->data->display_name;
}

function img() {
  echo get_template_directory_uri()."/assets/img";
}

function acf_image($size, $get = false) {
  $img = get_field('image');
  $img_src = $img['sizes'][$size];
  if(!$get) echo '<img src="'.$img_src.'" class="acf-image-'.$size.'"/>';
  else return $img_src;
}



function acf_extra_image($size) {
  $img = get_field('extra_image');
  $img_src = $img['sizes'][$size];
  echo '<img src="'.$img_src.'" class="acf-image-'.$size.'"/>';
}






function replace_core_jquery_version() {
    wp_deregister_script( 'jquery-core' );
    wp_register_script( 'jquery-core', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js', array(), '3.2.1' );
    wp_deregister_script( 'jquery-migrate' );
    wp_register_script( 'jquery-migrate', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-migrate/3.0.1/jquery-migrate.min.js', array(), '3.0.1' );
}
add_action( 'wp_enqueue_scripts', 'replace_core_jquery_version' );





/**
 * Prevent duplicates
 * http://codex.wordpress.org/Plugin_API/Filter_Reference/posts_distinct
 */
function cf_search_distinct( $where ) {
    global $wpdb;
    if ( is_search() ) {
        return "DISTINCT";
    }
    return $where;
}
add_filter( 'posts_distinct', 'cf_search_distinct' );





// Load the configuration file for this installation; all options are set here
if ( is_readable( trailingslashit( get_stylesheet_directory() ) . 'functions-config.php' ) )
  require_once( trailingslashit( get_stylesheet_directory() ) . 'functions-config.php' );

// Load configuration defaults for this theme; anything not set in the custom configuration (above) will be set here
// require_once( trailingslashit( get_stylesheet_directory() ) . 'functions-config-defaults.php' );

// An example of how to manage loading front-end assets (scripts, styles, and fonts)
require_once( trailingslashit( get_stylesheet_directory() ) . 'inc/assets.php' );

// Required to demonstrate WP AJAX Page Loader (as WordPress doesn't ship with even simple post navigation functions)
require_once( trailingslashit( get_stylesheet_directory() ) . 'inc/navigation.php' );

// Only the bare minimum to get the theme up and running
function voidx_setup() {

  // HTML5 support; mainly here to get rid of some nasty default styling that WordPress used to inject
  add_theme_support( 'html5', array( 'search-form', 'gallery' ) );

  // Automatic feed links
  add_theme_support( 'automatic-feed-links' );

  // $content_width limits the size of the largest image size available via the media uploader
  // It should be set once and left alone apart from that; don't do anything fancy with it; it is part of WordPress core
  global $content_width;
  $content_width = 960;

  // Register header and footer menus
  register_nav_menu( 'header', __( 'Header menu', 'voidx' ) );
  register_nav_menu( 'footer', __( 'Footer menu', 'voidx' ) );

}
add_action( 'after_setup_theme', 'voidx_setup', 11 );

// Sidebar declaration
function voidx_widgets_init() {
  register_sidebar( array(
    'name'          => __( 'Main sidebar', 'voidx' ),
    'id'            => 'sidebar-main',
    'description'   => __( 'Appears to the right side of most posts and pages.', 'voidx' ),
    'before_widget' => '<aside id="%1$s" class="widget %2$s">',
    'after_widget'  => '</aside>',
    'before_title'  => '<h2>',
    'after_title'   => '</h2>'
  ) );
}
add_action( 'widgets_init', 'voidx_widgets_init' );









/* ULTIMATE MEMBER Add fields to ACCOUNT page */
add_action('um_after_account_general', 'showExtraFields', 100);
function showExtraFields()
{
  $custom_fields = [
    // "alternate_email" => "Permanent E-mail Address",
    "alternate_email" => "Ihre öffentliche E-Mail-Adresse für den Katalog",
    "birth_date" => "Geburtstag",
    "user_address_additional" => "Zusätzliche Adresszeile",
    "user_postcode" => "Postleitzahl",
    "user_city" => "Ort",
    // "phone_number" => "Telefon",
    "phone_number" => "Ihre intern für den Wettbewerb zu nutzende Telefonnummer (hier sind Sie zuverlässig zu erreichen)",
    "user_profession" => "Tatigkeit",
    "user_public-phonenumber" => "Ihre öffentliche Telefonnummer für den Katalog",
    "user_public-email" => "Ihre öffentliche E-Mail",
    "address_2" => "Permanent Address 2",
    "city" => "Stadt",
    "state" => "Land",
    "zip_code" => "Postleitzahl"
  ];

  foreach ($custom_fields as $key => $value) {

    $fields[ $key ] = array(
        'title' => $value,
        'metakey' => $key,
        'type' => 'select',
        'label' => $value,
    );

    apply_filters('um_account_secure_fields', $fields, 'general' );

    $field_value = get_user_meta(um_user('ID'), $key, true) ? : '';

    $html = '<div class="um-field um-field-'.$key.'" data-key="'.$key.'">
    <div class="um-field-label">
    <label for="'.$key.'">'.$value.'</label>
    <div class="um-clear"></div>
    </div>
    <div class="um-field-area">
    <input class="um-form-field valid "
    type="text" name="'.$key.'"
    id="'.$key.'" value="'.$field_value.'"
    placeholder=""
    data-validate="" data-key="'.$key.'">
    </div>
    </div>';

    echo $html;
  }
}

/* add new tab called "bildverwaltung" */

add_filter('um_account_page_default_tabs_hook', 'tab_bildverwaltung_um', 100 );
function tab_bildverwaltung_um( $tabs ) {
  $tabs[800]['bildverwaltung']['icon'] = 'um-faicon-pencil';
  $tabs[800]['bildverwaltung']['title'] = 'Bildverwaltung';
  $tabs[800]['bildverwaltung']['custom'] = true;
  return $tabs;
}

/* make our new tab hookable */

// add_action('um_account_tab__bildverwaltung', 'um_account_tab__bildverwaltung');
// function um_account_tab__bildverwaltung( $info ) {
// 	global $ultimatemember;
// 	extract( $info );
//
// 	$output = $ultimatemember->account->get_tab_output('bildverwaltung');
// 	if ( $output ) { echo $output; }
// }

/* Finally we add some content in the tab */

// add_filter('um_account_content_hook_bildverwaltung', 'um_account_content_hook_bildverwaltung');
// function um_account_content_hook_bildverwaltung( $output ){
// 	ob_start();
//
// 	echo '<div class="um-field">Bildverwaltung</div>';
//
// 	$output .= ob_get_contents();
// 	ob_end_clean();
// 	return $output;
// }


/* add new tab called "LOGOUT" */

add_filter('um_account_page_default_tabs_hook', 'tab_logout_um', 100 );
function tab_logout_um( $tabs ) {
  $tabs[800]['logout']['icon'] = 'um-faicon-pencil';
  $tabs[800]['logout']['title'] = 'Logout';
  $tabs[800]['logout']['custom'] = true;
  return $tabs;
}

/* make our new tab hookable */

// add_action('um_account_tab__logout', 'um_account_tab__logout');
// function um_account_tab__logout( $info ) {
// 	global $ultimatemember;
// 	extract( $info );
//
// 	$output = $ultimatemember->account->get_tab_output('logout');
// 	if ( $output ) { echo $output; }
// }

/* Finally we add some content in the tab */

add_filter('um_account_content_hook_logout', 'um_account_content_hook_logout');
function um_account_content_hook_logout( $output ){
  ob_start();
  ?>
  <div class="um-field">Logout</div>
  <?php
  $output .= ob_get_contents();
  ob_end_clean();
  return $output;
}
