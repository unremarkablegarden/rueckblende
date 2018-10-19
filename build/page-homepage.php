<?php get_header();

$year = date('Y', strtotime('-1 year') );
?>

    <section class="columns tight reversed-stack-mobile">

      <div id="katalog" class="column is-4">
        <? // GET ONE PAGE
        $q = new WP_Query(array( 'page_id' => get_ID_by_slug('homepage/jetzt-katalog-bestellen') ));
      	if($q->have_posts()): while($q->have_posts()): $q->the_post(); ?>
          <div class="cover">
            <? acf_extra_image('medium'); ?>
          </div>
          <h1 class="bold">
            <img src="<? img(); ?>/book/red_arrow_15x20.svg">
            <a href="/katalog"><? the_title(); ?></a>
          </h1>
          <p><? the_content(); ?></p>
        <? endwhile; wp_reset_postdata(); endif; ?>
      </div>

      <div id="intro" class="column is-8">

        <div class="text">
          <? // GET ONE PAGE
          $q = new WP_Query(array( 'page_id' => get_ID_by_slug('homepage/intro') ));
        	if($q->have_posts()): while($q->have_posts()): $q->the_post(); ?>
        		<? the_content(); ?>
          <? endwhile; wp_reset_postdata(); endif; ?>
        </div>

        <div class="buttons">
          <a href="/preistraeger/" class="button">Preisträger</a>
          <a href="/shortlist/" class="button">Shortlist</a>
          <a href="/teilnehmer/" class="button">Teilnehmer</a>
        </div>

      </div>

    </section>


    <section id="prizes-gallery">

      <? $q = new WP_Query(array( 'page_id' => get_ID_by_slug('homepage/prizes-gallery') ));
      if($q->have_posts()): while($q->have_posts()): $q->the_post(); ?>
        <?
        $gallery_items = get_post_gallery_images_with_info();
        ?>
      <? endwhile; wp_reset_postdata(); endif; ?>

      <div class="gallery owl-carousel home2 arrows-inside">
      	<? foreach($gallery_items as $item): ?>
      		<div class="gallery-item">
      			<div class="image watermark">
      				<img src="<? echo $item['src']; ?>"/>
      			</div>

      			<div class="gallery-caption">
      				<div class="name">
      					<a href="<? echo $item['description']; ?>">
      						<? echo $item['caption']; ?>
      					</a>
      				</div>
      				<div class="prize">
      					<? echo $item['alt']; ?>
      				</div>
      			</div>
      		</div>
      	<? endforeach; ?>
      </div>

    </section>


    <section id="events" class="columns is-multiline">

      <div class="column is-3 logo">
        <img src="<? img(); ?>/exhibitions.svg" alt="Ausstellungen"/>
      </div>

      <div class="column is-3 intro text">
        <? // GET ONE PAGE
        $q = new WP_Query(array( 'page_id' => get_ID_by_slug('homepage/exhibitions') ));
        if($q->have_posts()): while($q->have_posts()): $q->the_post(); ?>
          <? the_content(); ?>
        <? endwhile; wp_reset_postdata(); endif; ?>
      </div>

      <? // EVENTS
      // first current
      $args = array (
        'post_type' => 'event',
        'posts_per_page' => 1,
        'meta_key'	=> 'start_date',
      	'orderby'	=> 'meta_value_num',
      	'order'		=> 'ASC',
        'meta_query' => array(
      		array(
  	        'key'		=> 'end_date',
  	        'compare'	=> '>=',
  	        'value'		=> date('Ymd'),
    	    )
        )
      );
      $q = new WP_Query($args);
      if($q->have_posts()): while($q->have_posts()): $q->the_post(); ?>
        <div class="column is-3 image" style="background-image: url(<? echo acf_image('medium', true); ?>);"></div>
        <div class="column is-3 text">
          <h2>Aktuelle Ausstellung</h2>

          <div>
            <?
            $sdate = get_field('start_date', false, false);
            $edate = get_field('end_date', false, false);
            $sdate = new DateTime($sdate);
            $edate = new DateTime($edate);
            $date = $sdate->format('j.n.')." – ".$edate->format('j.n.Y');
            echo $date;
            ?>
          </div>

          <div class="med">
            <?
            $location = get_field('location');
            $link = get_field('external_link');
            if (strpos($location, ', ') !== false) {
              $l = explode(', ', $location);
              echo $l[0].",<br/><span class='red'>";
              if($link) echo "<a href='".$link."' target='_blank'>";
                echo $l[1];
              if($link) echo "</a>";
              echo "</span>";
            }
            else {
              if($link) echo "<a href='".$link."' target='_blank'>";
                echo $location;
              if($link) echo "</a>";
            }
            ?>
          </div>
          <div class="sm"><? the_field('text'); ?></div>
        </div>
      <? endwhile; wp_reset_postdata(); endif; ?>

      <? // the rest of the events
      $args = array (
        'post_type' => 'event',
        'posts_per_page' => 2,
        'offset' => 1,
        'meta_key'	=> 'start_date',
      	'orderby'	=> 'meta_value_num',
      	'order'		=> 'ASC',
        'meta_query' => array(
      		array(
  	        'key'		=> 'end_date',
  	        'compare'	=> '>=',
  	        'value'		=> date('Ymd'),
    	    )
        )
      );
      $q = new WP_Query($args);
      if($q->have_posts()): while($q->have_posts()): $q->the_post(); ?>
        <div class="column is-3 image bw is-hidden-desktop" style="background-image: url(<? echo acf_image('medium', true); ?>);"></div>
        <div class="column is-3 text">
          <div>
            <?
            $sdate = get_field('start_date', false, false);
            $edate = get_field('end_date', false, false);
            $sdate = new DateTime($sdate);
            $edate = new DateTime($edate);
            $date = $sdate->format('j.n.')." – ".$edate->format('j.n.Y');
            echo $date;
            ?>
          </div>
          <div class="med">
            <?
            $location = get_field('location');
            $link = get_field('external_link');
            if (strpos($location, ', ') !== false) {
              $l = explode(', ', $location);
              echo $l[0].",<br/><span class='red'>";
              if($link) echo "<a href='".$link."' target='_blank'>";
                echo $l[1];
              if($link) echo "</a>";
              echo "</span>";
            }
            else {
              if($link) echo "<a href='".$link."' target='_blank'>";
                echo $location;
              if($link) echo "</a>";
            }
            ?>
          </div>
          <div class="sm"><? the_field('text'); ?></div>
        </div>
        <div class="column is-3 image bw is-hidden-mobile" style="background-image: url(<? echo acf_image('medium', true); ?>);"></div>
      <? endwhile; wp_reset_postdata(); endif; ?>

    </section>




    <section id="logos" class="container has-text-centered">
      <? // GET ONE PAGE
      $q = new WP_Query(array( 'page_id' => get_ID_by_slug('homepage/logos') ));
      if($q->have_posts()): while($q->have_posts()): $q->the_post(); ?>
        <? the_content(); ?>
      <? endwhile; wp_reset_postdata(); endif; ?>
    </section>

<?php get_footer(); ?>
