<?
/**
 * Template Name: CMS Account
 **/
get_header();

global $post;
$current_page = $post->post_name;
?>
<!-- <section class="account"> -->
<section class="upload-page account">
  <div class="columns">
    <div class="column is-3 side-menu">
      <? include('cms-menu.php');  ?>
    </div>
    <div class="column is-9 main content">
      <? echo wpautop(do_shortcode(get_the_content())); ?>
    </div>
  </div>
</section>

<? get_footer(); ?>
