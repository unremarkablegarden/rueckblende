<?
/**
 * Template Name: Jury — Submission editor
 **/
get_header();

global $post, $wp_query;
$current_page = $post->post_name;

$action = $_GET['action'];
$pid = $_GET['pid'];
?>

  <section class="section user-list">

    <strong>Filter:</strong>

    <ul>
      <li><a href="?filter=foto">Einzelfotos</a></li>
      <li><a href="?filter=serie">Series</a></li>
      <li><a href="?filter=karikatur">Karikaturen</a></li>
    </ul>

    <hr>

    <!-- <h2><? echo $action." = ".$pid; ?></h2> -->

    <?
    $user = wp_get_current_user();
    $allowed_roles = array('editor', 'administrator');
    if( array_intersect($allowed_roles, $user->roles) ):

      $f = $_GET['filter'];
      if( $f == 'foto' || $f == 'karikatur' || $f == 'serie' ):
    ?>

    <ul class='the-user-list'>

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
        'meta_value' => $_GET['filter']
      );
      $submissions = get_posts($args);
      $last_author = '';
      $first = true;

      $shown = array();
      foreach($submissions as $s):
        $user = get_userdata($s->post_author);
        $author = $user->display_name;
        if( !in_array($author, $shown) ) {
          echo "<li><a href='#$author'>$author</a></li>";
          $shown[] = $author;
        }
      endforeach;
      ?>

    </ul>

    <hr />

      <?
      foreach($submissions as $s):
        $postID = $s->ID;
        $meta = get_post_meta($s->ID);
        $imgID = get_post_meta( $s->ID, 'datei', true );
        $img = wp_get_attachment_image($imgID, 'medium');
        $user = get_userdata($s->post_author);
        $author = $user->display_name;
        $details = array();
        // $details['meta'] = $meta;
        $details['title'] = get_the_title($s->ID);
        $details['kategorie'] = $meta['kategorie'][0];
        $details['standort'] = $meta['standort'][0];
        $details['datum'] = $meta['datum'][0];
        if ($details['kategorie'] == 'serie') {
          $details['serienname'] = $meta['serienname'][0];
        }

        if ($author !== $last_author) {
          $last_author = $author;
          $title = "<a name='".$author."' style='display: block; position: relative; top: -90px; visibility: hidden;'></a><h2 class='title'>".$author."</h2>\n<div class='columns is-multiline'>";
          if ($first) {
            $first = false;
            echo $title;
          } else {
            echo '</div>';
            echo '<hr>';
            echo $title;
          }
        }
        ?>

        <div class="column is-3">
          <div class='box'>
            <div class="img-wrapper">
              <? echo $img; ?>
            </div>
            <div class="text">
              <?
              foreach($details as $key => $d):
                echo '<strong>'.ucfirst($key).'</strong>: ';
                echo $d;
                echo "<br>";
                // echo "<xmp>";
                // var_dump($d);
                // echo "</xmp>";
              endforeach;
              ?>
            </div>
            <div class='edit'>

              <a href="/edit/?action=juryedit&pid=<? echo $postID."&_wpnonce".wp_create_nonce(); ?>"  class='button'>Bearbeiten</a>

              <a href="<? echo wp_nonce_url("/wp-admin/post.php?post=".$postID."&action=delete", 'delete-post_'.$postID); ?>" class='button is-danger' onclick="return confirm('Möchten Sie dieses Bild wirklich löschen?')">Löschen</a>

            </div>
          </div>
        </div>
        <?
      endforeach;

      else:
        ?>
        <!-- <li><a href="?filter=karikatur">Karikatur</a></li> -->
        <?
      endif;
      ?>

  </section>


<? else: ?>
  <section class='section'>
    <div class='content'>
      Zugang verweigert
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
  .the-user-list {
    columns: 3;
  }
</style>

<? get_footer(); ?>
