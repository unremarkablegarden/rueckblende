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
        <?  the_content(); ?>
      <? endwhile; wp_reset_postdata(); endif; ?>
<!--
      <p class="p1" style="text-align: center;">Wir bedanken uns bei Kooperationspartnern, Preisstiftern, Medien- und Ausstellungspartnern der Rückblende 2017</p>
<p><a href="https://landesvertretung.rlp.de/de/startseite/" target="_blank" rel="noopener"><img class="alignnone wp-image-145" src="http://165.227.164.168/wp-content/uploads/2018/01/1_RP.svg" alt="" width="99" height="45" /></a>          <a href="https://www.bdzv.de/" target="_blank" rel="noopener"><img class="alignnone wp-image-146" src="http://165.227.164.168/wp-content/uploads/2018/01/2.-BDZV-mitSchrift.svg" alt="" width="95" height="61" /></a>          <a href="http://de.leica-camera.com/" target="_blank" rel="noopener"><img class="alignnone wp-image-147" src="http://165.227.164.168/wp-content/uploads/2018/01/3_Leica.svg" alt="" width="54" height="54" /></a>         <a href="https://schneiderkreuznach.com/de" target="_blank" rel="noopener"><img class="alignnone wp-image-148" src="http://165.227.164.168/wp-content/uploads/2018/01/4_schneider.svg" alt="" width="106" height="23" /></a></p>
<p><a href="http://www.bundespressekonferenz.de/" target="_blank" rel="noopener"><img class="alignnone wp-image-150" src="http://165.227.164.168/wp-content/uploads/2018/01/1_BundespresseKonf.jpg" alt="" width="114" height="34" /></a>          <a href="https://www.fotofinder.com/#!/home" target="_blank" rel="noopener"><img class="alignnone wp-image-151" src="http://165.227.164.168/wp-content/uploads/2018/01/2_Fotofinder.svg" alt="" width="100" height="17" /></a>          <a href="https://www.dgph.de/" target="_blank" rel="noopener"><img class="alignnone wp-image-152" src="http://165.227.164.168/wp-content/uploads/2018/01/3_DGPH.svg" alt="" width="44" height="55" /></a>          <a href="https://www.freelens.com/" target="_blank" rel="noopener"><img class="alignnone wp-image-153" src="http://165.227.164.168/wp-content/uploads/2018/01/4_FREELENS.svg" alt="" width="102" height="16" /></a>          <a href="https://www.dpa.com/de/" target="_blank" rel="noopener"><img class="alignnone wp-image-154" src="http://165.227.164.168/wp-content/uploads/2018/01/5_dpa.svg" alt="" width="66" height="22" /></a></p>
<p><a href="http://www.tagesspiegel.de/" target="_blank" rel="noopener"><img class="alignnone wp-image-155" src="http://165.227.164.168/wp-content/uploads/2018/01/1_tagesspiegel.svg" alt="" width="99" height="25" /></a><a href="http://165.227.164.168/wp-content/uploads/2018/01/1_tagesspiegel.svg">          </a><a href="http://www.general-anzeiger-bonn.de/" target="_blank" rel="noopener"><img class="alignnone wp-image-156" src="http://165.227.164.168/wp-content/uploads/2018/01/2_GA.jpg" alt="" width="103" height="23" srcset="http://165.227.164.168/wp-content/uploads/2018/01/2_GA.jpg 536w, http://165.227.164.168/wp-content/uploads/2018/01/2_GA-360x81.jpg 360w" sizes="(max-width: 103px) 100vw, 103px" /></a><a href="http://165.227.164.168/wp-content/uploads/2018/01/1_tagesspiegel.svg">          </a><a href="https://www.volksfreund.de/" target="_blank" rel="noopener"><img class="alignnone wp-image-157" src="http://165.227.164.168/wp-content/uploads/2018/01/3_TV.jpg" alt="" width="119" height="18" srcset="http://165.227.164.168/wp-content/uploads/2018/01/3_TV.jpg 661w, http://165.227.164.168/wp-content/uploads/2018/01/3_TV-600x91.jpg 600w, http://165.227.164.168/wp-content/uploads/2018/01/3_TV-360x54.jpg 360w" sizes="(max-width: 119px) 100vw, 119px" /></a><a href="http://165.227.164.168/wp-content/uploads/2018/01/1_tagesspiegel.svg">          </a><a href="https://www.rheinpfalz.de/" target="_blank" rel="noopener"><img class="alignnone wp-image-158" src="http://165.227.164.168/wp-content/uploads/2018/01/4_Wir-leben-Pfalz.svg" alt="" width="82" height="35" /></a><a href="http://165.227.164.168/wp-content/uploads/2018/01/1_tagesspiegel.svg">          </a><a href="https://www.rhein-zeitung.de/" target="_blank" rel="noopener"><img class="alignnone wp-image-159" src="http://165.227.164.168/wp-content/uploads/2018/01/5_RZ.svg" alt="" width="109" height="19" /></a></p>
<p><a href="https://www.hdg.de/" target="_blank" rel="noopener"><img class="alignnone wp-image-160" src="http://165.227.164.168/wp-content/uploads/2018/01/1_HdG.svg" alt="" width="133" height="31" />          </a><a href="https://www.hdg.de/zeitgeschichtliches-forum/" target="_blank" rel="noopener"><img class="alignnone wp-image-161" src="http://165.227.164.168/wp-content/uploads/2018/01/2_zfl.svg" alt="" width="137" height="31" />          </a><a href="https://add.rlp.de/de/startseite/" target="_blank" rel="noopener"><img class="alignnone wp-image-162" src="http://165.227.164.168/wp-content/uploads/2018/01/3_ADD.svg" alt="" width="112" height="44" />          </a><a href="https://sgdsued.rlp.de/de/startseite/" target="_blank" rel="noopener"><img class="alignnone wp-image-163" src="http://165.227.164.168/wp-content/uploads/2018/01/4_SGD.svg" alt="" width="105" height="48" />          </a><a href="https://sgdnord.rlp.de/de/startseite/" target="_blank" rel="noopener"><img class="alignnone wp-image-164" src="http://165.227.164.168/wp-content/uploads/2018/01/5_SGD_Nord.svg" alt="" width="101" height="46" />          </a><a href="https://www.swr.de/" target="_blank" rel="noopener"><img class="alignnone wp-image-165" src="http://165.227.164.168/wp-content/uploads/2018/01/6_SWR.svg" alt="" width="123" height="36" /></a></p>
<p><a href="https://www.zugbruecke.de/" target="_blank" rel="noopener"><img class="alignnone wp-image-167" src="http://165.227.164.168/wp-content/uploads/2018/01/8_ZBG.svg" alt="" width="63" height="63" /></a>          <a href="http://bellevue-hotel.de/" target="_blank" rel="noopener"><img class="alignnone wp-image-166" src="http://165.227.164.168/wp-content/uploads/2018/01/7_Bellevue.svg" alt="" width="120" height="42" /></a></p>
    </section> -->

<?php get_footer(); ?>
