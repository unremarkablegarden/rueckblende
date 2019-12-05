<?
/**
 * Template Name: Edit Ajax
 **/
// get_header();

// $filter = $_GET['filter'];
// $new_tag = $_GET['new_tag'];
// $value = $_GET['value'];

// echo $filter;
// echo '<br>';
// echo $new_tag;
// echo '<br>';
// echo $value;
// echo '<br>';

if ( is_user_logged_in() && isset( $_GET['post_to_tag']) && isset($_GET['new_tag'])  && $_GET['value'] == 'true' ) {
  wp_set_post_tags($_GET['post_to_tag'], $_GET['new_tag'], $_GET['value'] );
  echo 'true';
}
else if ( is_user_logged_in() && isset( $_GET['post_to_tag']) && isset($_GET['new_tag'])  && $_GET['value'] == 'false' ) {
  wp_remove_object_terms( $_GET['post_to_tag'], $_GET['new_tag'], 'post_tag' );
  echo 'true';
}

// series
else if ( is_user_logged_in() && isset( $_GET['series_to_tag']) && isset($_GET['new_tag'])  && $_GET['value'] == 'true' ) {
  $posts = $_GET['series_to_tag'];
  $posts = explode(',', $posts);
  // e.g. 20267,20269
  foreach($posts as $id) {
    wp_set_post_tags($id, $_GET['new_tag'], $_GET['value'] );
  }
  echo 'true';
}

else if ( is_user_logged_in() && isset( $_GET['series_to_tag']) && isset($_GET['new_tag'])  && $_GET['value'] == 'false' ) {
  $posts = $_GET['series_to_tag'];
  $posts = explode(',', $posts);
  foreach($posts as $id) {
    wp_remove_object_terms( $id, $_GET['new_tag'], 'post_tag' );
  }
  echo 'true';
}
else {
  echo 'false';
}


// get_footer(); ?>
