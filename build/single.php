<? get_header(); ?>

<?
$action = $_GET['action'];
$nonce = $_GET['nonce'];

// if (!is_user_logged_in() || !wp_verify_nonce($nonce) || $action !== 'edit') wp_redirect('/');

// echo $action." = ".$nonce."<br>";
// echo "<xmp>";
// print_r(wp_verify_nonce($nonce));
// echo "</xmp>";


?>
<? //wp_redirect('/'); ?>

<?php

// $year = date('Y', strtotime('-1 year') );
// $current_year = $year;

while ( have_posts() ) : the_post();

  $name = ucwords(get_field('vorname'))." ".ucwords(get_field('nachname'));
  $uid = get_field('vorname')."/".get_field('nachname');
  $year = get_field('year');
  $category = get_field('category');

  if(get_post_type() == 'post'):

    $cf = get_post_custom();
    ?>
    <xmp>
      <? print_r($cf); ?>
    </xmp>
    <?

  else:
    

    function showImage($content) {
      // echo get_the_content();
      if (strpos($content, '<img') !== false) {
        // image exists
        echo $content;
      } else {
        // $imgID = get_field('atttachment_id');
        $imgID = $content;
        $imgF = wp_get_attachment_image_src($imgID, 'full');
        $retina = wr2x_get_retina_from_url($imgF[0]);
        if($retina) {
          $pic = '<img src="'.$retina.'">';
        } else {
          $pic = wp_get_attachment_image($imgID, 'large');
        }
        echo $pic;
      }
    }
    

    if($category == 'Serie'): ?>

    <section class="single-image series section">
      <div class="container">
        <div class="columns">
          <div class="column is-10 is-offset-1">
            <div class="gallery owl-carousel">
              <?
              $args = array(
                'post_type' => 'entry',
                meta_query => array(
                  'key'		=> 'series_name',
                  'value'	=> get_field('series_name'),
                ),
                'orderby' => 'meta_value',
                'meta_key' => 'filename',
                'order' => 'ASC'
              );
              $q = new WP_Query($args);
            	if($q->have_posts()): while($q->have_posts()): $q->the_post(); ?>
                <div class="slide">
                  <div class="photo watermark">
                    <? 
                    $content = get_the_content();
                    showImage($content);
                    ?>
                  </div>
                  <div class="caption">
                    <? the_field('caption'); ?>
                  </div>
                </div>
              <? endwhile; wp_reset_postdata(); endif; ?>
            </div>
          </div>
        </div>
      </div>
    </section>

  <? else: ?>

    <section class="single-image section">
      <div class="container">
        <div class="columns">
          <div class="column is-10 is-offset-1 photo">
            <div class="watermark">
              <?
              $content = get_the_content();
              showImage($content);
              ?>
            </div>
          </div>
        </div>
      </div>
    </section>

  <? endif; ?>


  <section class="single-info section">
    <div class="container">
      <div class="columns">
        <div class="column is-1 arrow">
          <img src="<? img(); ?>/image_page/arrow_red_back.svg" class="back"/>
        </div>
        <div class="column is-6">
          <h2 class="author">
            <?  echo $name; ?>
          </h2>
          <p class="caption">
            <? if($category == 'Serie'):
              the_field('series_name');
            else:
              the_field('caption');
            endif; ?>
          </p>
          <p class="loc-date">
            <?
            $location = get_field('location');
            if($location) echo $location.", ";
            echo get_field('date');
            ?>
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- OTHER PHOTOS AND CARTOONS BY AUTHOR -->
  <section class="related photo-cartoon content-grid section">
    <div class="container">
      <hr>

      <div class="notice">
        Beiträge <? echo $year; ?> von <span class="name"><? echo $name;?></span>
      </div>

      <div class="columns is-multiline fetch" id="author-this-year" data-y="<? echo $year; ?>" data-uid="<? echo $uid; ?>">

      </div>
    </div>
  </section>



  <!-- OTHER SERIES BY AUTHOR -->


  <!-- <img class="series_icon" src = "<? img(); ?>/archive/icon_series.svg"> -->
  <!-- <section class="photo_series related section"> -->


      <!-- <div class="container">

        <div class="columns">
          <div class="column is-4 info">

            <h3><? //the_title(); ?></h3>
            <p class="description"><? //the_field('series_description'); ?></p>
            <p class="loc-date">
              <? //the_field('location'); ?>,
              <? // the_field('date'); ?>
            </p>
          </div>
          <div class="column is-6 is-offset-2 slider">
            <div class="owl-carousel gallery">
              <?
                // $imageid = get_field('imageid');
                // $image['image'] = get_entry_src($year, $imageid);
                // for ($i = 1; $i <= 6; $i++) {
                //   $img = get_field('image_'.$i);
                //   $caption = get_field('caption_'.$i);
                //   if ($img) {
                //     $img_src = $img['sizes']['medium'];
                //     echo '<div class="slider-item">';
                //     echo '<img src="'.$image['image'].'"/>';
                //     echo '<p class="caption">'.$caption.'</p>';
                //     echo '</div>';
                //   }
                // }
              ?>
            </div>
          </div>
        </div>

      </div>
    </section>
    <hr> -->


  <section class="section author-all-previous">
    <div class="container">
      <hr>
      <div class="past-years notice">
        <img src="<? img(); ?>/image_page/red_arrow_11x14.svg" class="arrow"/>
        Alle Beiträge der vergangenen Jahre von <span class="name"><? echo $name; ?></span>
      </div>

      <div class="columns is-multiline fetch wait" id="author-all-previous" data-uid="<? echo $uid; ?>" data-pp="100" data-current="<? echo $year; ?>">

    </div>
  </section>


    <!-- <section class="related content-grid past-years section">
      <div class="container">
      </div>
    </section> -->


  <? //endforeach;?>



<? endif; // if post type == post ?>

<?
endwhile; // End of the loop.
?>

<style media="screen">
#pre-header-spacer {
  height: 0 !important;
  min-height: 0 !important;
  overflow: hidden !important;
}
</style>

<? get_footer(); ?>
