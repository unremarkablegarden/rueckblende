<?php get_header(); ?>

    <section class="columns">

      <div id="katalog" class="column is-4">
        <? // GET ONE PAGE by slug
        $q = new WP_Query(array( 'page_id' => get_ID_by_slug('homepage/jetzt-katalog-bestellen') ));
      	if($q->have_posts()): while($q->have_posts()): $q->the_post(); ?>
          <? acf_extra_image('medium'); ?>
          <h1 class="bold">
            <img src="<? img(); ?>/book/red_arrow_15x20.svg">
            <? the_title(); ?>
          </h1>
          <p><? the_content(); ?></p>
        <? endwhile; wp_reset_postdata(); endif; ?>
      </div>

      <div id="intro" class="column is-8">
        <? // GET ONE PAGE by slug
        $q = new WP_Query(array( 'page_id' => get_ID_by_slug('homepage/intro') ));
      	if($q->have_posts()): while($q->have_posts()): $q->the_post(); ?>
      		<p><? the_content(); ?></p>
        <? endwhile; wp_reset_postdata(); endif; ?>
      </div>

    </section>

    <section>
      hello 2
    </section>

<?php get_footer(); ?>
