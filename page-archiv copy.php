<?

get_header();

global $post;
$slug = $post->post_name;
$year = date('Y', strtotime('-1 year') );
$current_year = $year; // SETS THE CURRENT CONTEST'S YEAR
$y = $_GET['y'];
$c = $_GET['c'];
$w = $_GET['w'];
$search = $_GET['search'];

if(!$y) $y = $year;
if(!$c) $c = 'Karikatur';

if($w == 'exclude' || $slug == 'teilnehmer') {
  $w_long = 'EXCLUDE,photo_prize_first,das_scharfe_sehen_1,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3';
  $winners = 'exclude';
}

if($w == 'winners') {
  $w_long = 'INCLUDE,photo_prize_first,das_scharfe_sehen_1,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3';
  $winners = true;
} else {
  $winners = false;
  $all = true;
}

$url = '?search='.$search.'&y='.$y.'&c='.$c.'&w='.$w;

?>

<div class="wrappy" id="<? echo $slug ?>">
  <div class="content-header">

    <? if ($slug === 'teilnehmer'): ?>

      <div class="search">
        <form class="search-field" id="searchform">
          <input name="search" type="text" name="" placeholder="Suche..." value="<? echo $search; ?>" autocomplete="off">
          <? if($slug !== 'teilnehmer'): ?>
            <input type="hidden" name="y" value="<? echo $y; ?>">
          <? endif; ?>
          <input type="hidden" name="c" value="<? echo $c; ?>">
          <? if($slug !== 'teilnehmer'): ?>
            <input type="hidden" name="w" value="<? echo $w; ?>">
          <? endif; ?>
          <button type="submit" alt="Search" value="Search">
            <img class="search-icon" src="<? img(); ?>/search_participators/icon_search_l.svg">
          </button>
        </form>
      </div>
    <? else: ?>
      <div class="info-stuff">
        <h1><? the_title(); ?></h1>
        <div class="page-description"><? the_content(); ?></div>
      </div>

    <? endif; ?>
    <div class="tabs is-centered">
      <ul>
        <? if ($slug === 'archiv'): ?>
          <li data-category="winners" class="<? if($winners) echo 'is-active'; ?>"><a>Preisträger</a></li>
          <li data-category="all" class="<? if($all) echo 'is-active'; ?>"><a>Archiv</a></li>
        <? else: ?>
          <li data-category="Karikatur" class="<? if($c == 'Karikatur') echo 'is-active'; ?>"><a href="<? echo  '?search='.$search.'&c=Karikatur'; ?>">Karikatur</a></li>
          <li data-category="Foto" class="<? if($c == 'Foto') echo 'is-active'; ?>"><a href="<? echo '?search='.$search.'&c=Foto'; ?>">Fotografie</a></li>
          <li data-category="Serie" class="<? if($c == 'Serie') echo 'is-active'; ?>"><a href="<? echo '?search='.$search.'&c=Serie'; ?>">Serie</a></li>
        <? endif; ?>
      </ul>
    </div>
  </div>

  <?
  if ($slug == 'archiv'): // ARCHIV
  ?>
    <?
    $total_years = $current_year - 2003;
    ?>

    <div class="columns slider-section paddy">
      <div class="column is-1 is-offset-3 year">
        <? echo $year; ?>
      </div>
      <div class="column is-5 slider-wrappy">
        <input class="slider is-fullwidth is-large is-circle" step="1" min="0" max="<? echo $total_years; ?>" value="<? echo $total_years; ?>" type="range">
      </div>
    </div>


    <?
    $types = array('Foto', 'Serie', 'Karikatur');
    foreach($types as $type):
    ?>
      <section class="content-grid paddy">
        <h2 class="section-title">
          <?
            if($type == 'Foto') echo 'Fotografie';
            if($type == 'Karikatur') echo 'Karikatur';
            if($type == 'Serie') echo 'Serien';
          ?>
        </h2>
        <div class="columns is-multiline">
          <?
          $args = array(
          	'post_type'      =>  'entry',
          	'posts_per_page' =>  20,
            'meta_query'     =>  array(
              'relation'  =>  'AND',
              'key'       =>  'category',
              'value'     =>  $type,
              'key'       =>  'year',
              'value'     =>  $current_year
            )
          );

          $query = new WP_Query( $args );
          $query->query_vars['magic'] = true;
          $query->query_vars['custom_year'] = $_GET['y'];
          $query->query_vars['custom_category'] = $_GET['c'];
          $query->query_vars['winner'] = $_GET['w'];
          $query->query_vars['s'] = $_GET['search'];
          global $query;
          relevanssi_do_query($query);

          if( $query->have_posts() ): while( $query->have_posts() ) : $query->the_post();

            $imageid = get_field('imageid');
            $year = get_field('year');
            $caption = get_field('caption');
            if( strlen($caption) > 100 ) {
              $caption = excerpt($caption, 100);
            }
            $series_name = get_field('series_name');
            $name = get_field('vorname')." ".get_field('nachname');
            $category = get_field('category');
            $year = get_field('year');
            $thumb = get_entry_src($year, $imageid, true);

            // if(get_field('photo_prize_first' == 'yes'){
            //   $prize = 'Photo prize 1';
            // }
            // elseif(get_field('photo_prize_2' == 'yes'){
            //   $prize = 'Photo prize 2';
            // }
            // elseif(get_field('photo_prize_3' == 'yes'){
            //   $prize = 'Photo prize 3';
            // }
            // elseif(get_field('das_scharfe_sehen_1' == 'yes'){
            //   $prize = 'Das Scharfe Sehen 1';
            // }
            // elseif(get_field('das_scharfe_sehen_2' == 'yes'){
            //   $prize = 'Das Scharfe Sehen 2';
            // }
            // elseif(get_field('cartoon_prize_1' == 'yes'){
            //   $prize = 'Karikatur prize 1';
            // }
            // elseif(get_field('cartoon_prize_2' == 'yes'){
            //   $prize = 'Karikatur prize 2';
            // }
            // elseif(get_field('cartoon_prize_3' == 'yes'){
            //   $prize = 'Karikatur prize 3';
            // }
            // elseif(get_field('auszeichnung_karikatur' == 'yes'){
            //   $prize = 'Auszeichungs Karikatur';
            // }

          ?>

            <div class="column is-3 content-item <? echo $category; ?>" data-type="<? echo $category; ?>" data-year="<? //echo $year; ?>">
              <a href="<? the_permalink(); ?>">
                <div class="image" style="background-image: url('<? echo $thumb; ?>')">&nbsp;</div>
              </a>
              <div class="prize"><? echo $prize; ?> prize</div>
              <h3><a href="<? the_permalink(); ?>"><? echo $name; ?></a></h3>
              <p class="caption">
                <? the_field('caption');  ?>
              </p>
            </div>

          <? endwhile; endif; wp_reset_query(); ?>
        </div>
      </section>
      <hr>
    <? endforeach;?>

  <? endif; // END ARCHIV ?>

</div>
<? get_footer(); ?>
