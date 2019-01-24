<? get_header();


$year = date('Y', strtotime('-1 year') );

$args = array(
  'post_type'	=> 'entry',
  'posts_per_page' => 1,
  'meta_query' => array(
    'relation' => 'AND',
    array(
      'key'     => 'photo_prize_first',
      'value'   => 'Yes'
    ),
    array(
      'key'     => 'year',
      'value'   => $year
    )
  )
);
$p_query = new WP_Query( $args );
if( $p_query->have_posts() ): while( $p_query->have_posts() ) : $p_query->the_post();
  $imageid = get_field('imageid');
  $name = ucwords(get_field('vorname'))." ".ucwords(get_field('nachname'));
?>
  <section class="winner-section section">
    <div class="columns">
      <div class="column is-7 photo">
        <a href="<? the_permalink(); ?>">
          <!-- <img src="<? the_entry_src($year, $imageid); ?>"/> -->
          <? showImage(get_the_ID()); ?>
        </a>
      </div>
      <div class="column is-5 info">
        <img class="badge" src="<? img(); ?>/winners/badge_photo.svg"/>
        <h2 class="title">
          <a href="#artist"><? echo $name; ?></a>
        </h2>
        <div class="description">
          <? the_field('caption'); ?>
        </div>
        <div class="date">
          <? echo get_field('location').', '.get_field('date'); ?>
        </div>
      </div>
    </div>
  </section>
<? endwhile; endif; wp_reset_query(); ?>

<?
$args = array(
  'post_type'  => 'entry',
  'posts_per_page' => 3,
  'order' => 'ASC',
  'meta_query' => array(
    'relation' => 'AND',
    array(
      'relation' => 'OR',
      // array(
      //   'key'     => 'photo_prize_first',
      //   'value'   => 'Yes'
      // ),
      array(
        'key'     => 'photo_prize_2',
        'value'   => 'Yes'
      ),
      array(
        'key'     => 'photo_prize_3',
        'value'   => 'Yes'
      ),
      array(
        'key'     => 'das_scharfe_sehen_1',
        'value'   => 'Yes'
      ),
      array(
        'key'     => 'das_scharfe_sehen_1',
        'value'   => 'Yes'
      ),
    ),
    array(
      'key'     => 'year',
      'value'   => $year
    )
  )
);

$p_query = new WP_Query( $args ); ?>
  <section class="runnerup-section section">
    <div class="columns is-multiline">
      <? if( $p_query->have_posts() ): while( $p_query->have_posts() ) : $p_query->the_post(); ?>
      <?
      $imageid = get_field('imageid');
      $name = ucwords(get_field('vorname'))." ".ucwords(get_field('nachname'));

      if(!empty(get_field('photo_prize_first'))) $winner = 'photo_prize_first';
      elseif(!empty(get_field('photo_prize_2'))) $winner = 'photo_prize_2';
      elseif(!empty(get_field('photo_prize_3'))) $winner = 'photo_prize_3';
      elseif(!empty(get_field('das_scharfe_sehen_1'))) $winner = 'das_scharfe_sehen_1';
      elseif(!empty(get_field('das_scharfe_sehen_2'))) $winner = 'das_scharfe_sehen_2';
      ?>
        <div class="column is-3 runnerup-item">
          <div class="inner">
            <?
              $badge_start = "<img class='badge' src='".get_template_directory_uri()."/assets/img";
              if($winner == 'photo_prize_first') {
                $badge = $badge_start."/winners/badge_photo.svg'>";
              }
              elseif($winner == 'das_scharfe_sehen_1') {
                $badge = $badge_start."/winners/badge_special_price.svg'>";
              }

              if($badge) echo $badge;
            ?>

            <a href="<? the_permalink(); ?>">
              <!-- <img src="<? the_entry_src($year, $imageid, true); ?>"/> -->
              <? showImage(get_the_ID()); ?>
            </a>
            <h3><a href="#honk"><? echo $name; ?></a></h3>
            <p><? the_field('caption'); ?></p>

          </div>
        </div>
      <? endwhile; endif; wp_reset_query(); ?>
    </div>
  </section>

<hr>

<?
$args = array(
  'post_type'  => 'entry',
  'posts_per_page' => 10,
  'order' => 'ASC',
  'meta_query' => array(
    'relation' => 'AND',
    array(
      'key'     => 'series_prize_1',
      'value'   => 'Yes'
    ),
    array(
      'key'     => 'year',
      'value'   => $year
    )
  )
);

$p_query = new WP_Query( $args );
$series = array();

if( $p_query->have_posts() ): while( $p_query->have_posts() ) : $p_query->the_post();
  $image = array();
  $imageid = get_field('imageid');

  // $image['image'] = get_entry_src($year, $imageid);
  $image['image'] = getImage(get_the_ID());
  
  $image['name'] = ucwords(get_field('vorname'))." ".ucwords(get_field('nachname'));
  $image['series'] = get_field('series_name');
  $image['location'] = get_field('location');
  $image['date'] = get_field('date');
  $image['caption'] = get_field('caption');
  $series[] = $image;
endwhile; endif; wp_reset_query();
// debug($series);
?>

  <section class="photo_series section">
    <div class="columns">
      <div class="column is-4 info">
        <img class="series_icon" src = "<? img(); ?>/archive/icon_series.svg">
        <h3><? echo $series[0]['name']; ?></h3>
        <p class="description">
          <?
          if($series[0]['series_name']) echo $series[0]['series_name'];
          ?>
        </p>
        <p class="loc-date">
          <?
          if($series[0]['location']) echo $series[0]['location'].', ';
          echo $series[0]['date']; ?>
        </p>
      </div>
      <div class="column is-8">
        <div class="wrap">

          <img class="badge" src="<? img(); ?>/winners/badge_series.svg"/>
          <div class="owl-carousel gallery">
            <? foreach($series as $image): ?>
              <div class="slider-item">
                <div class="image" style="background-image: url(<? echo $image['image']; ?>)">&nbsp;</div>
                <p class="caption"><? echo $image['caption']; ?></p>
              </div>
            <? endforeach; ?>
          </div>

      </div>
    </div>
  </section>


<hr>


<?
$args = array(
  'post_type'	=> 'entry',
  'posts_per_page' => 1,
  'meta_query' => array(
    'relation' => 'AND',
    array(
      'key'     => 'cartoon_prize_1',
      'value'   => 'Yes'
    ),
    array(
      'key'     => 'year',
      'value'   => $year
    )
  )
);
$p_query = new WP_Query( $args );
if( $p_query->have_posts() ): while( $p_query->have_posts() ) : $p_query->the_post();
  $imageid = get_field('imageid');
  $name = ucwords(get_field('vorname'))." ".ucwords(get_field('nachname'));
?>
  <section class="winner-section section">
    <div class="columns">
      <div class="column is-7 photo">
        <a href="<? the_permalink(); ?>">
          <!-- <img src="<? the_entry_src($year, $imageid); ?>"/> -->
          <? showImage(get_the_ID()); ?>
        </a>
      </div>
      <div class="column is-5 info">
        <img class="badge" src="<? img(); ?>/winners/badge_cartoon.svg"/>
        <h2 class="title">
          <a href="#artist"><? echo $name; ?></a>
        </h2>
        <div class="description">
          <? the_field('caption'); ?>
        </div>
        <div class="date">
          <? echo get_field('location').', '.get_field('date'); ?>
        </div>
      </div>
    </div>
  </section>
<? endwhile; endif; wp_reset_query(); ?>

<?
$args = array(
  'post_type'  => 'entry',
  'order' => 'ASC',
  'posts_per_page' => 4,
  'meta_query' => array(
    'relation' => 'AND',
    array(
      'relation' => 'OR',
      // array(
      //   'key'     => 'cartoon_prize_1',
      //   'value'   => 'Yes'
      // ),
      array(
        'key'     => 'cartoon_prize_2',
        'value'   => 'Yes'
      ),
      array(
        'key'     => 'cartoon_prize_3',
        'value'   => 'Yes'
      ),
      array(
        'key'     => 'auszeichnung_karikatur',
        'value'   => 'Yes'
      )
    ),
    array(
      'key'     => 'year',
      'value'   => $year
    )
  )
);

$p_query = new WP_Query( $args ); ?>
  <section class="runnerup-section section">
    <div class="columns is-multiline">
      <? if( $p_query->have_posts() ): while( $p_query->have_posts() ) : $p_query->the_post(); ?>
      <?
      $imageid = get_field('imageid');
      $name = ucwords(get_field('vorname'))." ".ucwords(get_field('nachname'));

      if(!empty(get_field('cartoon_prize_1'))) $winner = 'cartoon_prize_1';
      elseif(!empty(get_field('cartoon_prize_2'))) $winner = 'cartoon_prize_2';
      elseif(!empty(get_field('cartoon_prize_3'))) $winner = 'cartoon_prize_3';
      elseif(!empty(get_field('auszeichnung_karikatur'))) $winner = 'auszeichnung_karikatur';
      ?>
        <div class="column is-3 runnerup-item">
          <div class="inner">
            <?
              $badge_start = "<img class='badge' src='".get_template_directory_uri()."/assets/img";

              if($winner == 'cartoon_prize_1') {
                $badge = $badge_start."/winners/badge_cartoon.svg'>";
              }
              elseif($winner == 'cartoon_prize_2') {
                $badge = $badge_start."/winners/badge_cartoon_2.svg'>";
              }
              elseif($winner == 'cartoon_prize_3') {
                $badge = $badge_start."/winners/badge_cartoon_3.svg'>";
              }

              if($badge) echo $badge;
            ?>

            <a href="#imagepage">
              <!-- <img src="<? the_entry_src($year, $imageid, true); ?>"/> -->
              <? showImage(get_the_ID()); ?>
            </a>
            <h3><a href="#honk"><? echo $name; ?></a></h3>
            <p><? the_field('caption'); ?></p>

          </div>
        </div>
      <? endwhile; endif; wp_reset_query(); ?>
    </div>
  </section>






<? get_footer(); ?>
