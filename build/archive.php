<?php
/*
Template Name: Archives
*/
get_header(); ?>

<? // if (!is_user_logged_in()) wp_redirect('/'); ?>
<? wp_redirect('/'); ?>

<?
// $args = array(
//   'post_type' => 'post',
//   'ignore_sticky_posts' => 1,
//   'year'  => date('Y'),
// );
//
// $the_query = new WP_Query( $args );
//
// if ( $the_query->have_posts() ) :
//   while ( $the_query->have_posts() ) : $the_query->the_post();
//
// 			the_title();
//       the_content();
//
//   endwhile;
// endif;
//
// wp_reset_postdata();
?>
