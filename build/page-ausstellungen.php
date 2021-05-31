<?php get_header(); ?>

  <section id="events" class="columns is-multiline events-grid">

    <? // the rest of the events
    $args = array (
      'post_type' => 'event',
      'meta_key'	=> 'start_date',
    	'orderby'	=> 'meta_value_num',
    	'order'		=> 'ASC',
      // 'meta_query' => array(
    	// 	array(
	    //     'key'		=> 'end_date',
	    //     'compare'	=> '>=',
	    //     'value'		=> date('Ymd'),
  	  //   )
      // )
    );

    $q = new WP_Query($args);
    $i = 0; if($q->have_posts()):  while($q->have_posts()): $q->the_post(); ?>

      <?
      if ($i % 4 < 2) $oddeven = 'odd';
      else $oddeven = 'even';
      ?>

      <?
      $sdate = get_field('start_date', false, false);
      $edate = get_field('end_date', false, false);
      $sdate = new DateTime($sdate);
      $edate = new DateTime($edate);
      $date = $sdate->format('j.n.')." – ".$edate->format('j.n.Y');
      ?>

      <div class="column is-6 event-item <? echo $oddeven; ?>">
        <div class="inner">

        <?
        if ( strtotime($edate->format('j.n.Y')) < time() ) {
          $past = 'bw';
        } else {
          $past = '';
        }
        ?>

        <div class="square image <? echo $past; ?>" style="background-image: url(<? echo acf_image('medium', true); ?>);">&nbsp;</div>

        <div class="square text">
          <div class="date">
            <?
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
            
            <div class="eventtext" style="font-size: 0.9em; margin-top: 1em;"><? the_field('text'); ?></div>
          </div>
          <div class="bottom">
            <? 
            $info2 = get_field('info_2');
            $info2 = preg_replace('~(^|[\s\.,;\n\(])([a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})~',  '$1<a href="mailto:$2">$2</a>', $info2); 
            ?>
            <div class="info _1"><? the_field('info_1'); ?></div>
            <div class="info _2"><? echo $info2; ?></div>
          </div>
        </div>  <!-- end square text -->

        </div><!-- end .inner -->
      </div> <!-- end column is-6 -->

    <? $i++; endwhile; wp_reset_postdata(); endif; ?>

  </section>

<?php get_footer(); ?>
