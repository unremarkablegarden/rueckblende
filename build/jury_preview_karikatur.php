<?
/**
 * Template Name: Jury — Karikatur preview
 **/
get_header();

global $post, $wp_query;
$current_page = $post->post_name;

$action = $_GET['action'];
$pid = $_GET['pid'];
?>

  <section class="section user-list">

    <div class="columns">
      <div class="column is-10 is-offset-1">

    <?
    $user = wp_get_current_user();
    $allowed_roles = array('editor', 'administrator');
    // if( array_intersect($allowed_roles, $user->roles ) ):
    // if ( ! post_password_required($post) ) :
    if( $post->post_password && !post_password_required() ):

    ?>

      <?
      $seriesNames = array();

      // get all submissions
      $args = array(
        'posts_per_page'  => -1,
        'post_type'       => 'post',
        'year'            => date('Y'),
        'orderby'         => 'author',
        'order'           => 'ASC',
        'meta_key' => 'kategorie',
        'meta_value' => 'karikatur'
      );
      $submissions = get_posts($args);
      $last_author = '';
      $first = true;

      $series = array();

      $last = '';
      $first = true;
      $counter = 1;

      echo "<div class='series-wrapper jury-preview owl-carousel'>";

      foreach($submissions as $s):
        $postID = $s->ID;
        $meta = get_post_meta($s->ID);


        if ($meta['kategorie'][0] == 'karikatur'):
          // is series

          $imgID = get_post_meta( $s->ID, 'datei', true );
          $medium = wp_get_attachment_image_src($imgID, 'medium');
          $large = wp_get_attachment_image_src($imgID, 'large');
          $retina = wr2x_get_retina_from_url($large[0]);
          if($retina) { $large[0] = $retina; }
          // echo "retina: ".$retina;

          $d = array();
          $d['title'] = get_the_title($s->ID);
          $d['standort'] = $meta['standort'][0];
          $d['datum'] = $meta['datum'][0];
          // $d['serienname'] = $meta['serienname'][0];

          $author = $s->post_author;
          // $current = $d['serienname'];
          $current = $author;

          $entry = "<div class='series'><h1>#".$counter."</h1><div class='inner columns is-multiline'>";

          if($last !== $current) {
          // if($last !== $author) {
            if($first) {
              $counter++;
              echo $entry;
              $first = false;
            } else {
              echo "</div></div>";
              $counter++;
              echo $entry;
            }
            $last = $current;
            // $last = $s->post_author;
          }

          echo '<div class="column is-4 series-image">';
            echo '<a class="zoom" data-zoom="'.$large[0].'" target="_blank">';
              echo '<div class="img-wrapper">';
                echo '<img src="'.$medium[0].'" />';
              echo '</div>';
            echo '</a>';
          echo '</div>';

        endif;
      endforeach;

      echo "</div></div>";
      ?>

      </div>
    </div>

    <div id="zoom">
      <div class="close">
        <a class='button' href="#close">X</a>
      </div>
      <div class="image">
      </div>
    </div>


  </section>


<? else: ?>
  <section class='section'>
    <div class='content'>
      <!-- Zugang verweigert -->
      <? echo get_the_password_form(); ?>
    </div>
  </section>
<? endif; ?>

<style>
  #pre-header-spacer {
    height: 0 !important;
    min-height: 0 !important;
    overflow: hidden !important;
  }
  .box .img-wrapper {
    background: #EEE;
    line-height: 0;
    font-size: 0;
    text-align: center;
    border: 1px #ddd solid;
  }
  .box img {
    max-height: 20vw;
    width: auto;
  }
  .box .text {
    margin: 1em 5px;
  }
  .box .edit {
    display: flex;
    /* justify-content: space-between; */
  }
  .box .edit .button {
    margin-right: 1em;
  }
  .owl-stage {
    /* background: pink; */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h1 {
    font-weight: bold;
    font-size: 1.5em;
    text-align: center;
    margin-bottom: 1em;
  }
  .series {
    padding: 1em;
  }

  .img-wrapper {
    background: #f0f0f0;
    border: 1px #ccc solid;
    width: 20vw;
    height: 20vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .img-wrapper img {
    max-width: 100%;
    max-height: 100%;
    width: auto !important;
  }

  #zoom {
    display: none;
    position: fixed;
    /* top: 0; */
    left: 0;
    width: 100vw;
    /* height: 100vh; */
    /* background: black; */
    z-index: 1000;
  }
  #zoom .close {
    position: fixed;
    right: 25px;
    top: 118px;
    z-index: 1001;
  }
  #zoom .close .button {
    color: #C33;
    font-weight: bold;
  }
  #zoom .image {
    width: 100vw;
    max-height: calc(100vh - 100px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #zoom .image img {
    max-height: calc(100vh - 130px);
    margin: -10px 30px 0 30px;
    width: auto;
    background-color: black;
    /* border: 1px #bbb solid; */
    padding: 20px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,0.5);
    /* border: 20px white solid; */
  }
  #zoom {
    /* opacity: 0.1; */
  }
  .series-image.current {
    /* border: 2px red solid; */
  }

  #pre-header-submissions, #pre-header-spacer, #footer {
    display: none !important;
  }
</style>

<? get_footer(); ?>
