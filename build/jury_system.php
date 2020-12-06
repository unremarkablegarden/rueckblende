<?
/**
 * Template Name: Jury system
 **/
get_header();

$thisYear = 2020;

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
  .tagcount {
    background: #BBB;
    color: white;
    border-radius: 3px;
    font-size: 0.8em;
    padding: 1px;
    margin-left: 5px;
    margin-bottom: -4px;
    display: inline-block;
    width: 17px;
    overflow: hidden;
    text-align: center;
  }
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
    /* max-height: 95vh; */
    max-height: 80vh;
    max-width: 100%;
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
  .box .file {
    margin-top: 10px;
  }
  .box .file.hide {
    display: none;
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
    flex-direction: column;
    /* padding: 0 40px; */
    padding: 40px;
    margin: 10px;
    background: white;
    border-radius: 5px;
  }
  /* .modal-contet .button.is-light {
    background: #afb;
  } */
  .modal .edit {
    margin-bottom: -25px;
  }
  .modal-close {
    border: 1px white solid;
    background: black;
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
    /* bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    padding: 5px;
    border-radius: 25px;
     */
    /* background: rgba(0,0,0,0.8); */
    /* left: 50vw;
    top: 50vh; */
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255,255,255,0.5);
    z-index: 9999;
  }
  .loading img {
    position: fixed;
    left: 50vw;
    top: 50vh;
    width: 200px;
    height: auto;
    border-radius: 25px;
    -webkit-filter: invert(100%);
    filter: invert(100%);
    transform: translate(-50%, -50%);
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

    <?
    $user = wp_get_current_user();
    $allowed_roles = array('editor', 'administrator');
    if( array_intersect($allowed_roles, $user->roles) ):
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

      $f = $_GET['filter'];
      if( $f == 'foto' || $f == 'karikatur' || $f == 'serie' ):
    ?>

    <?
    $taglist = get_tags(array( 'hide_empty' => false));

    // COUNT THE NUMBER OF IMAGES IN EACH TAG
    $tagcount = array();
    foreach($taglist as $t) {
      $tid = $t->term_id;
      $args = array(
        'posts_per_page'  => -1,
        'post_type'       => 'post',
        'year'            => $thisYear, // date('Y'),
        'orderby'         => 'author',
        'order'           => 'ASC',
        'meta_key' => 'kategorie',
        'meta_value' => $_GET['filter'],
        'tag_id' => $tid
      );
      $taggedposts = get_posts($args);

      if ($f == 'serie') {
        // echo '<xmp>';
        $lastauthor = '';
        $seriescount = 0;
        foreach ($taggedposts as $p) {
          if ($p->post_author !== $lastauthor) {
            $seriescount++;
            $lastauthor = $p->post_author;
          }
        }
        $tagcount[$t->slug] = $seriescount;
        // echo '</xmp>';
        // echo '<xmp>';
        // print_r($taggedposts);
        // echo '</xmp>';
        // $tagcount[$t->slug] = count($taggedposts);
      } else {
        $tagcount[$t->slug] = count($taggedposts);
      }
    }
    ?>
    <!-- <xmp><? print_r($tagcount); ?></xmp> -->

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
          $i = 0;
          foreach($taglist as $t): ?>
            <a href="?filter=<? echo $_GET['filter']; ?>&tag=<? echo $t->slug; ?>" class="dropdown-item">
              <?
              echo $t->name." <span class='tagcount' data-tag='".$t->slug."'>".$tagcount[$t->slug]."</span>";
              $i++;
              // echo $t->name;
              ?>
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
        'year'            => $thisYear, // date('Y'),
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
        <input type="checkbox" class='showinfo' style='font-size: 20px; position: relative; top: -1px; left: -3px;'>
        Info
      </label>

      <label class="checkbox" style='float: right; padding-top: 0.3em; padding-right: 1em;'>
        <input type="checkbox" class='showfile' style='font-size: 20px; position: relative; top: -1px; left: -3px;'>
        Filename
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
            $title = "<div class='user' data-n='".$userN."'><a name='".$userN."' style='display: block; position: relative; top: -90px; visibility: hidden;'></a><h2 class='title name-on'>".$author."</h2><h2 class='title name-off'>Teilnehmer #".$userN.$seriestitle."<div style='display: inline-block; font-size: 12px; line-height: 1em; transform: translate(16px, -6px); border: 1px #ccc solid; padding: 2px 4px; border-radius: 3px; color: #777;'>ID ".$s->post_author."</div></h2>\n<div class='columns is-multiline'>";
            
            // $title = "<div class='user' data-n='".$userN."'><a name='".$userN."' style='display: block; position: relative; top: -90px; visibility: hidden;'></a><h2 class='title name-on'>".$author."</h2><h2 class='title name-off'>Teilnehmer #".$s->post_author.$seriestitle."</h2>\n<div class='columns is-multiline'>";
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

                <div class='edit'>
              <?
              $tags = array();
              $tagNames = array();
              $tagIds = array();
              $saved_tags = wp_get_post_tags($postID);
              $taglist = get_tags(array( 'hide_empty' => false));
              foreach($taglist as $t) {
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
                if ($_GET['tag']) {
                  $ct = '&tag='.$_GET['tag'];
                } else {
                  $ct = '';
                }
                if($isSaved) {
                  $val = 'false';
                  $href = '/edit-ajax/?filter='.$_GET['filter'].$ct.$ids.'&new_tag='.$t->slug.'&value=false#'.($userN-1);
                  echo '<a data-post_to_tag="'.$postID.'" data-new_tag="'.$t->slug.'" data-value="'.$val.'" class="button is-small is-light change-tag" href="'.$href.'"><span class="icon is-small"><i class="fas fa-check"></i></span><span>'.$t->name.' <span class="tagcount" data-tag="'.$t->slug.'">'.$tagcount[$t->slug].'</span></span></a>';
                } else {
                  $val = 'true';
                  $href = '/edit-ajax/?filter='.$_GET['filter'].$ct.$ids.'&new_tag='.$t->slug.'&value=true#'.($userN-1);
                  echo '<a data-post_to_tag="'.$postID.'" data-new_tag="'.$t->slug.'" data-value="'.$val.'" class="button is-small change-tag" href="'.$href.'"><span class="icon is-small is-hidden"><i class="fas fa-check"></i></span><span>'.$t->name.' <span class="tagcount"  data-tag="'.$t->slug.'">'.$tagcount[$t->slug].'</span></a>';
                }
              } ?>
            </div><!-- edit -->


                <? // echo $largeImg; ?>
              </div>
              <button class="modal-close is-large" aria-label="close"></button>
            </div>

            <div class="text hide"><!-- hide -->
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

            <div class="file hide">
              <?
              // * userID-category-ID
              $file = $user->ID.'-'.$_GET['filter'].'-'.$postID;
              echo "<b>Filename:</b>&nbsp;&nbsp;".$file;
              ?>
            </div>

            <div class='edit'>
              <?
              $tags = array();
              $tagNames = array();
              $tagIds = array();
              $saved_tags = wp_get_post_tags($postID);
              $taglist = get_tags(array( 'hide_empty' => false));
              foreach($taglist as $t) {
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
                if ($_GET['tag']) {
                  $ct = '&tag='.$_GET['tag'];
                } else {
                  $ct = '';
                }
                if($isSaved) {
                  $val = 'false';
                  $href = '/edit-ajax/?filter='.$_GET['filter'].$ct.$ids.'&new_tag='.$t->slug.'&value=false#'.($userN-1);
                  echo '<a data-post_to_tag="'.$postID.'" data-new_tag="'.$t->slug.'" data-value="'.$val.'" class="button is-small is-light change-tag" href="'.$href.'"><span class="icon is-small"><i class="fas fa-check"></i></span><span>'.$t->name.' <span class="tagcount" data-tag="'.$t->slug.'">'.$tagcount[$t->slug].'</span></span></a>';
                } else {
                  $val = 'true';
                  $href = '/edit-ajax/?filter='.$_GET['filter'].$ct.$ids.'&new_tag='.$t->slug.'&value=true#'.($userN-1);
                  echo '<a data-post_to_tag="'.$postID.'" data-new_tag="'.$t->slug.'" data-value="'.$val.'" class="button is-small change-tag" href="'.$href.'"><span class="icon is-small is-hidden"><i class="fas fa-check"></i></span><span>'.$t->name.' <span class="tagcount" data-tag="'.$t->slug.'">'.$tagcount[$t->slug].'</span></a>';
                }
              } ?>
            </div><!-- edit -->

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
