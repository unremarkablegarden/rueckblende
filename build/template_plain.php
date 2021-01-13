<?
/**
 * Template Name: Plain page
 **/

get_header();
?>

<section class="section">
  <div class="container">
    <div class="columns">
      <div class="column is-10 is-offset-1">
        <? the_content(); ?>        
      </div>
    </div>
  </div>
</section>

<style>
  .responsive { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .responsive iframe, .responsive object, .responsive embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
  h1, h2, h3, h4, h5, h6 {
    font-size: 150%;
    margin: 1rem 0;
    font-weight: bold;
  }
  p {
    margin: 1rem 0;
  }
</style>

<? get_footer(); ?>
