<?
/**
 * Template Name: Jury system
 **/
get_header();

// einzel, karikatur
if ( is_user_logged_in() && isset( $_GET['post_to_tag']) && isset($_GET['new_tag'])  && $_GET['value'] == 'true' ) {
  wp_set_post_tags($_GET['post_to_tag'], $_GET['new_tag'], $_GET['value'] );
}

if ( is_user_logged_in() && isset( $_GET['post_to_tag']) && isset($_GET['new_tag'])  && $_GET['value'] == 'false' ) {
  wp_remove_object_terms( $_GET['post_to_tag'], $_GET['new_tag'], 'post_tag' );
}

// series
if ( is_user_logged_in() && isset( $_GET['series_to_tag']) && isset($_GET['new_tag'])  && $_GET['value'] == 'true' ) {
  $posts = $_GET['series_to_tag'];
  $posts = explode(',', $posts);
  // e.g. 20267,20269
  foreach($posts as $id) {
    wp_set_post_tags($id, $_GET['new_tag'], $_GET['value'] );
  }
}

if ( is_user_logged_in() && isset( $_GET['series_to_tag']) && isset($_GET['new_tag'])  && $_GET['value'] == 'false' ) {
  $posts = $_GET['series_to_tag'];
  $posts = explode(',', $posts);
  foreach($posts as $id) {
    wp_remove_object_terms( $id, $_GET['new_tag'], 'post_tag' );
  }
}




global $post, $wp_query;
$current_page = $post->post_name;

$action = $_GET['action'];
$pid = $_GET['pid'];
$showname = $_GET['showname'];

?>


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
  .box .zoom img {
    max-height: 20vw;
    width: auto;
  }
  .box img {

  }
  .box .text {
    margin: 1em 5px;
    font-size: 0.86em;
  }
  .box .edit {
    /* display: flex; */
    /* justify-content: space-between; */
    margin-top: 1em;
  }
  .box .edit .button {
    margin: 0 0.5em 0.5em 0;
  }
  .the-user-list {
    columns: 3;
  }
  .name-on {
    display: none;
  }
  .box .text.hide {
    display: none;
    /* display: block; */
    /* opacity: 0.5; */
  }
  .user {
    display: none;
  }
  .user.show {
    display: block;
  }
  /* .button.is-static {
    min-width: 3em;
  } */
  #header-sticky-wrapper, #footer {
    display: none !Important;
  }
  .modal-content {
    width: auto !important;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 40px;
  }
  .dropdown-item {
    cursor: pointer;
  }
  .serie .user.show .edit {
    display: none;
  }
  .serie .user.show .column:last-child .edit {
    display: block;
  }
  .serie .user.show {
    border: 1px #ccc solid;
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 2em;
    box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
  }
  .loading {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    padding: 5px;
    border-radius: 25px;
    background: rgba(0,0,0,0.8);
    z-index: 9999;
  }
  .loading img {
    width: 40px;
    height: auto;
    border-radius: 25px;
  }
</style>


  <section class="section user-list <? echo $_GET['filter']; ?>">

    <?
    function activeCat($cat) {
      if ($cat == $_GET['filter']) {
        echo 'is-selected is-dark';
      }
    }
    ?>

    <div class="buttons has-addons" style="float: left; margin-right: 1.5em;">
      <?
      $tagurl = '';
      if($_GET['tag']) { $tagurl = "&tag=".$_GET['tag']; }
      ?>
       <a class="button <? activeCat('foto'); ?>" href="?filter=foto<? echo $tagurl; ?>">Einzelfotos</a>
       <a class="button <? activeCat('serie'); ?>" href="?filter=serie<? echo $tagurl; ?>">Series</a>
       <a class="button <? activeCat('karikatur'); ?>" href="?filter=karikatur<? echo $tagurl; ?>">Karikaturen</a>
    </div>

    <?
    $user = wp_get_current_user();
    $allowed_roles = array('editor', 'administrator');
    if( array_intersect($allowed_roles, $user->roles) ):

      $f = $_GET['filter'];
      if( $f == 'foto' || $f == 'karikatur' || $f == 'serie' ):
    ?>

    <?
    $taglist = get_tags(array( 'hide_empty' => false));
    ?>

    <div class="dropdown" style="float: left; margin-right: 1em;">
      <div class="dropdown-trigger">
        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
          <span>
            <? if(!$_GET['tag']) { ?>
              Tag filter
            <? } else {
              foreach($taglist as $t) {
                if($t->slug == $_GET['tag']) {
                  echo $t->name;
                }
              }
            } ?>
          </span>
          <span class="icon is-small">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div class="dropdown-menu" id="dropdown-menu" role="menu">
        <div class="dropdown-content">
          <a href="?filter=<? echo $_GET['filter']; ?>&tag=" class="dropdown-item">
            (Alle)
          </a>
          <?
          foreach($taglist as $t): ?>
            <a href="?filter=<? echo $_GET['filter']; ?>&tag=<? echo $t->slug; ?>" class="dropdown-item">
              <? echo $t->name; ?>
            </a>
          <? endforeach;?>
        </div>
      </div>
    </div>



    <!-- <ul class='the-user-list'> -->
    <div class="the-user-list2 hideOnTag" style="display: inline-block;">

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
        'meta_value' => $_GET['filter'],
        'tag' => $_GET['tag']
      );
      $submissions = get_posts($args);
      $last_author = '';
      $first = true;

      $shown = array();
      $userN = 1;

      ?>

      <div class="dropdown">
        <div class="dropdown-trigger">
          <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
            <span>Teilnehmer auswählen</span>
            <span class="icon is-small">
              <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
          <?
          $shown = array();
          $userN = 1;
          foreach($submissions as $s):
            $user = get_userdata($s->post_author);
            $author = $user->display_name;
            if( !in_array($author, $shown) ): ?>
                <div class="dropdown-content">
                  <a href="#<? echo $userN; ?>" class="dropdown-item">
                    <span class='name-off'>Teilnehmer #<? echo $userN; ?> </span>
                    <span class='name-on'><? echo $author; ?></span>
                    <? $userN++; $shown[] = $author; ?>
                  </a>
                </div>
            <? endif;
          endforeach; ?>
        </div>
      </div>


      <button type="button" name="previous" class='button pager prev'>
        <span class="icon">
          <i class="fas fa-arrow-left"></i>
        </span>
      </button>
      <a class="button counter is-static">
        <span class='count'>0</span> / <span class='total'>0</span>
      </a>
      <button type="button" name="next" class='button pager next'>
        <span class="icon">
          <i class="fas fa-arrow-right"></i>
        </span>
      </button>

    </div>

    <span style="float: right; ">
      <label class="checkbox" style='float: right; padding-top: 0.3em; padding-right: 1em;'>
        <input type="checkbox" class='showname' style='font-size: 20px; position: relative; top: -1px; left: -3px;'>
        Name anzeigen
      </label>

      <label class="checkbox" style='float: right; padding-top: 0.3em; padding-right: 1em;'>
        <input type="checkbox" class='showinfo' style='font-size: 20px; position: relative; top: -1px; left: -3px;' checked>
        Info
      </label>
    </span>
    <!-- </ul> -->

    <? // ---------------------------------------------------------------------------- ?>

    <hr style="clear: both; float: none;"/>

    <? if($_GET['tag']) echo '<div class="columns is-multiline">'; ?>


      <?
      $userN = 1;

      foreach($submissions as $s):
        $postID = $s->ID;
        $meta = get_post_meta($s->ID);
        $imgID = get_post_meta( $s->ID, 'datei', true );
        $img = wp_get_attachment_image($imgID, 'medium');
        // $largeImg = wp_get_attachment_image($imgID, 'large');

        $large = wp_get_attachment_image_src($imgID, 'large');
        $retina = wr2x_get_retina_from_url($large[0]);
        if($retina) { $large = $retina; }
        else { $large = $large[0]; }


        $user = get_userdata($s->post_author);
        $author = $user->display_name;
        $details = array();
        // $details['meta'] = $meta;
        $details['titel'] = get_the_title($s->ID);
        // $details['kategorie'] = $meta['kategorie'][0];
        $details['standort'] = $meta['standort'][0];
        $details['datum'] = $meta['datum'][0];
        if ($_GET['tag']) {
          $details['teilnehmer'] = $author;
        }
        if ($meta['kategorie'][0] == 'serie') {
          $details['serienname'] = $meta['serienname'][0];
        }

        $seriestitle = '';
        if ($_GET['filter'] == 'serie') {
          $seriestitle = ' — '.$meta['serienname'][0];
        }


        if ($author !== $last_author) {
          $last_author = $author;
          if (! $_GET['tag'] || $_GET['filter'] == 'serie') {
            $title = "<div class='user' data-n='".$userN."'><a name='".$userN."' style='display: block; position: relative; top: -90px; visibility: hidden;'></a><h2 class='title name-on'>".$author."</h2><h2 class='title name-off'>Teilnehmer #".$userN.$seriestitle."</h2>\n<div class='columns is-multiline'>";
          }
          $userN++;
          if ($first) {
            $seriesIDs = array();
            $first = false;
            echo $title;
          } else {
            $seriesIDs = array();
            if (! $_GET['tag'] || $_GET['filter'] == 'serie') {
              echo '</div></div>';
            }

            echo $title;
          }
        }
        ?>

        <div class="column is-3">
          <div class='box wrapper'>
            <div class="img-wrapper">
              <a class='zoom' href="#zoom">
                <? echo $img; ?>
              </a>
            </div>

            <div class="modal">
              <div class="modal-background"></div>
              <div class="modal-content">
                <img data-src="<? echo $large; ?>">
                <? // echo $largeImg; ?>
              </div>
              <button class="modal-close is-large" aria-label="close"></button>
            </div>

            <div class="text"><!-- hide -->
              <?
              foreach($details as $key => $d):
                if($key == 'teilnehmer') {
                  echo '<span class="name-on">';
                  echo '<strong>'.ucfirst($key).'</strong>: ';
                  echo $d;
                  echo "<br>";
                  echo '</span>';
                } else {
                  echo '<span class="">';
                  echo '<strong>'.ucfirst($key).'</strong>: ';
                  echo $d;
                  echo "<br>";
                  echo '</span>';
                }
              endforeach;
              ?>
            </div>
            <div class='edit'>

            <?
            // if ($_GET['filter'] !== 'serie'):
              $tags = array();
              $tagNames = array();
              $tagIds = array();
              $saved_tags = wp_get_post_tags($postID);
              $taglist = get_tags(array( 'hide_empty' => false));

              foreach($taglist as $t): ?>
                <?
                $isSaved = false;
                foreach($saved_tags as $s) {
                  if($s->term_id == $t->term_id) {
                    // tag is saved
                    $isSaved = true;
                    break;
                  }
                }

                if ($_GET['filter'] == 'serie') {
                  if (!in_array($postID, $seriesIDs)) {
                    $seriesIDs[] = $postID;
                  }
                  $seriesString = implode(',', $seriesIDs);
                  $ids = '&series_to_tag='.$seriesString;
                }
                else {
                  $ids = '&post_to_tag='.$postID;
                }
                ?>

                <? if($isSaved):

                  $href = '?filter='.$_GET['filter'].$ids.'&new_tag='.$t->slug.'&value=false#'.($userN-1);
                  ?>
                  <a class="button is-small is-light change-tag" href="<? echo $href; ?>">
                    <span class="icon is-small">
                      <i class="fas fa-check"></i>
                    </span>
                    <span><? echo $t->name;?></span>
                  </a>
                <? else: ?>
                  <?
                  $href = '?filter='.$_GET['filter'].$ids.'&new_tag='.$t->slug.'&value=true#'.($userN-1);
                  ?>
                  <a class="button is-small change-tag" href="<? echo $href; ?>"><? echo $t->name;?></a>
                <? endif;?>



              <? endforeach; ?>


              <? // endif; // if not series?>

            </div>
          </div>
        </div>
        <?
      endforeach;

      endif;
      ?>
    <? if($_GET['tag']) echo "</div>"; ?>

  </section>

<div class="loading">
  <img src="https://samherbert.net/svg-loaders/svg-loaders/puff.svg">
</div>

<? else: ?>
  <section class='section'>
    <div class='content'>
      Zugang verweigert
    </div>
  </section>
<? endif; ?>

<script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>

<? get_footer(); ?>
