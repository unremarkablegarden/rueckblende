<? get_header(); ?>

<section class="katalog">
  <div class="columns">
    <div class="column is-4 form">
      <h2>Katalogbestellung</h2>
      <?php
        echo do_shortcode( '[ninja_form id=2]' );
        // echo do_shortcode( '[contact-form-7 id="19767" title="Katalog 2"]' );
       ?>
    </div>
    <div class="column is-8 content">
      <? the_content(); ?>
    </div>
  </div>
</section>

<? get_footer(); ?>
