<? get_header(); ?>

<?
$args = array('post_type'	=> 'photo', 'meta_key' => 'winner', 'meta_value'	=> 'first');
$p_query = new WP_Query( $args );
if( $p_query->have_posts() ): while( $p_query->have_posts() ) : $p_query->the_post();
?>
  <section class="photo_winner">
    <div class="columns container">
      <div class="column is-8 photo">
        <? acf_image('large'); ?>
      </div>
      <div class="column is-4 info">
        <img class="badge" src="<? img(); ?>/badges/badge_winners.svg"/>
        <h2 class="title">
          <a href="<? the_permalink(); ?>"><? the_creator(); ?></a>
        </h2>
        <div class="description">
          <? the_title(); ?> — <? the_field('caption'); ?>
        </div>
        <div class="date">
          <?
            $date = get_field('date');
            $datetime = DateTime::createFromFormat('dmY', $date);
            $date_formatted = $datetime->format('d.m.Y');
            echo $date_formatted;
          ?>
        </div>
      </div>
    </div>
  </section>
<? endwhile; endif; wp_reset_query(); ?>

<?
$args = array(
  'post_type'  => 'photo',
  'meta_query' => array(
    'relation' => 'OR',
    array(
      'key'     => 'winner',
      'value'   => 'second'
    ),
    array(
      'key'     => 'winner',
      'value'   => 'third'
    )
  )
);

$p_query = new WP_Query( $args ); ?>
  <section class="photo_runnerup">
    <div class="columns is-multiline container">
      <? if( $p_query->have_posts() ): while( $p_query->have_posts() ) : $p_query->the_post(); ?>
        <div class="column is-3 runnerup-item">
          <?
            $prize = get_field('winner');
            if ($prize == 'second'){
              echo '<img class="badge" src="';
              img();
              echo '/badges/winners/badge_special_price.svg">';
            }
            elseif ($prize == 'third'){
              echo '<img class="badge" src="';
              img();
              echo '/badges/winners/badge_audience.svg">';
            }
          ?>
          <? acf_image('thumbnail'); ?>
          <h3><? the_title(); ?></h3>
          <p><? the_field('caption'); ?></p>
        </div>
      <? endwhile; endif; wp_reset_query(); ?>
    </div>
  </section>


<?
$args = array('post_type'	=> 'series', 'meta_key' => 'winner', 'meta_value'	=> 'first');
$p_query = new WP_Query( $args ); ?>
<? if( $p_query->have_posts() ): while( $p_query->have_posts() ) : $p_query->the_post(); ?>

  <section class="photo_series">
    <div class="columns container">
      <div class="column is-4">
        <h3><? the_title(); ?></h3>
        <p><? the_field('caption'); ?></p>
      </div>
      <div class="column is-8">
        <ul class="slider">
          <li>
            <?
              $img = get_field('image_1');
              $img_src = $img['sizes']['large'];
              echo '<img src="'.$img_src.'"/>';
            ?>
            <p class="slider"><? the_field('caption'); ?></p>
          </li>
        </ul>
      </div>
    </div>
  </section>

<? endwhile; endif; wp_reset_query(); ?>

<? get_footer(); ?>
