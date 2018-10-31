<?
/**
 * Template Name: Bildwervaltung
 **/
if (!is_user_logged_in()) {
  wp_redirect( '/login/' );
}

get_header();

global $post;
$current_page = $post->post_name;


$state = array();
$state['id'] = get_current_user_id();

$args = array(
  'author'        =>  get_current_user_id(),
  'orderby'       =>  'post_date',
  'order'         =>  'ASC',
  'posts_per_page' => -1,
  'year'          => date('Y'),
);
$submissions = get_posts( $args );

$state['total']['foto'] = 0;
$state['total']['serie'] = 0;
$state['total']['karikatur'] = 0;

foreach($submissions as $sub) {
  $cf = get_post_custom($sub->ID);
  $kat = $cf['kategorie'][0];

  if(!$state['serienname']) {
    $state['serienname'] = $cf['serienname'][0];
  }

  if(!$state['standort']) {
    $state['standort'] = $cf['standort'][0];
  }

  if($kat == 'foto') {
    $state['total']['foto'] = $state['total']['foto'] + 1;
  }
  else if($kat == 'serie') {
    $state['total']['serie'] = $state['total']['serie'] + 1;
  }
  else if($kat == 'karikatur') {
    $state['total']['karikatur'] = $state['total']['karikatur'] + 1;
  }
}

?>

<section class="upload-page">
  <div class="columns">
    <div class="column is-3 side-menu">
      <? include('cms-menu.php');  ?>
    </div>
    <div class="column is-9 main">

      <?php

      function get_first_image($size) {
          $attachment = get_children(
              array(
                  'post_parent'    => get_the_ID(),
                  'post_type'      => 'attachment',
                  'post_mime_type' => 'image',
                  'order'          => 'DESC',
                  'numberposts'    => 1,
              )
          );
          if ( ! is_array( $attachment ) || empty( $attachment ) ) { return; }
          $attachment = current( $attachment );
          // echo wp_get_attachment_url( $attachment->ID, $size);
          $url = wp_get_attachment_image_src($attachment->ID, $size);
          return $url[0];
      }


      $post_type = 'post';
      global $userdata;

      $userdata = get_userdata( $userdata->ID ); //wp 3.3 fix

      global $post;

      $pagenum = isset( $_GET['pagenum'] ) ? intval( $_GET['pagenum'] ) : 1;

      // delete post
      if ( isset( $_REQUEST['action'] ) && $_REQUEST['action'] == "del" ) {

          // $nonce = $_REQUEST['_wpnonce'];
          // if ( !wp_verify_nonce( $nonce, 'wpuf_del' ) ) {
          //     die( "Security check" );
          // }

          //check, if the requested user is the post author
          $maybe_delete = get_post( $_REQUEST['pid'] );

          if ( ($maybe_delete->post_author == $userdata->ID) || current_user_can( 'delete_others_pages' ) ) {
              wp_delete_post( $_REQUEST['pid'] );

              //redirect
              $redirect = add_query_arg( array( 'section' => 'posts', 'msg' => 'deleted'), get_permalink() );
              wp_redirect( $redirect );
          } else {
              echo '<div class="error">' . __( 'Nicht erlaubt.', 'wpuf' ) . '</div>';
          }
      }

      // show delete success message
      if ( isset( $_GET['msg'] ) && $_GET['msg'] == 'deleted' ) {
          echo '<div class="success">' . __( 'Eintrag gelöscht', 'wpuf' ) . '</div>';
      }

      $args = array(
          'author' => get_current_user_id(),
          'post_status' => array('draft', 'future', 'pending', 'publish', 'private'),
          'post_type' => $post_type,
          'posts_per_page' => wpuf_get_option( 'per_page', 'wpuf_dashboard', 10 ),
          'paged' => $pagenum
      );

      $original_post = $post;
      $dashboard_query = new WP_Query( apply_filters( 'wpuf_dashboard_query', $args ) );
      $post_type_obj = get_post_type_object( $post_type );

      ?>


      <?php do_action( 'wpuf_account_posts_top', $userdata->ID, $post_type_obj ) ?>

      <?php
      if ( $dashboard_query->have_posts() ):

        ?>
        <div class="columns">
          <div class="column is-12 content">

            <?
            if( ($state['total']['foto'] < 2 && $state['total']['foto'] > 0) || ($state['total']['serie'] < 4 && $state['total']['serie'] > 0) || ($state['total']['karikatur'] < 2 && $state['total']['karikatur'] > 0) ){ ?>
              <p>Bitte achten Sie auf die jeweiligen Hinweise, die Ihnen u.a. die Anzahl der hochzuladenden Beiträge vorgeben:</p>
              <ul>
            <?
            }
            ?>

            <? if($state['total']['foto'] < 2 && $state['total']['foto'] > 0): ?>
              <li>
              Sie müssen für die Kategorie Fotografie/Einzelfoto <b>mindestens</b> zwei Bilddateien hochladen, <b>höchstens</b> können Sie vier Bilddateien hochladen.

                <!-- <br/>You have <? echo $state['total']['foto']; $warn = true; ?> pictures -->
            <? endif;

            if($state['total']['serie'] > 0) { ?>
              <li>Nachdem Sie einer <b>Serie</b> mehr als <b>ein</b> Bild hinzugefügt haben, können Sie <b>den Namen nicht mehr bearbeiten</b>.</li>
            <? }

            if($state['total']['serie'] < 4 && $state['total']['serie'] > 0):
              ?>
              <? if($warn) echo "</li>"; ?>
              <li>
              Sie müssen für die Kategorie Fotografie/Serie <b>mindestens</b> vier Bilddateien hochladen, <b>höchstens</b> können Sie sechs Bilddateien hochladen.

              <!-- <br/>You have <? echo $state['total']['serie']; $warn = true; ?> pictures -->
            <? endif; if($state['total']['karikatur'] < 2 && $state['total']['karikatur'] > 0): ?>
              <? if($warn) echo "</li>"; ?>
              <li>
              Sie müssen für die Kategorie Karikatur <b>mindestens</b> zwei Bilddateien hochladen, <b>höchstens</b> können Sie vier Bilddateien hochladen.

              <!-- <br/>You have <? echo $state['total']['karikatur']; $warn = true; ?> pictures -->
            <? endif; ?>
            <?
            if($warn) { ?>
              <br/><a href="/einreichen">Noch mehr einreichen</a>!
              </li>
              </ul>
            <? } else { ?>
              <p>
                <b>Sie nehmen jetzt am Wettbewerb teil. </b>
                <a href="/einreichen">Noch mehr einreichen</a>?
                <!-- Sie können noch max X Bilder hochladen. -->
              </p>
            <? }
            ?>
          </div>
        </div>
        <?

        $featured_img = wpuf_get_option( 'show_ft_image', 'wpuf_dashboard' );
        $featured_img_size = wpuf_get_option( 'ft_img_size', 'wpuf_dashboard' );
        $current_user    = wpuf_get_user();
        global $post;

        echo '<div class="columns entries is-multiline">';


        while ( $dashboard_query->have_posts() ) : $dashboard_query->the_post(); ?>

          <div class="column entry is-3">
            <div class="image" style="background-image: url(<? echo get_first_image('medium'); ?>); background-size: contain; background-position: center; height: 18vw; background-repeat: no-repeat; background-color: #f5f5f3; border-radius: 5px; border: 1px #ccc solid;">
              <!-- <img src="<? echo get_first_image('medium'); ?>" /> -->
            </div>
            <div class="text">

              <? $meta = get_post_meta(get_the_ID()); ?>

              <div>
                <label><strong>Kategorie: </strong></label>
                <?
                // echo ucwords($meta['kategorie'][0]);
                $kat = $meta['kategorie'][0];
                if ($kat == 'foto') echo "Fotografie/Einzelfoto";
                if ($kat == 'serie') echo "Fotografie/Serie";
                if ($kat == 'karikatur') echo "Karikatur";
                ?>
              </div>

              <? if($meta['serienname'][0] && $meta['kategorie'][0] == 'serie'): ?>
                <div>
                  <label><strong>Serienname: </strong></label>
                  <? echo $meta['serienname'][0]; ?>
                </div>
            <? endif; ?>

              <div>
                <label><strong>Titel: </strong></label>
                <? echo get_the_title(); ?>
              </div>

              <div>
                <label><strong>Datum: </strong></label>
                <? echo $meta['datum'][0]; ?>
              </div>

              <div>
                <label><strong>
                  <?
                  if($meta['kategorie'][0] == 'karikatur') {
                    echo "Verleger: ";
                  } else {
                    echo "Ort: ";
                  }
                  ?>
                </strong></label>
                <? echo $meta['standort'][0]; ?>
              </div>


              <?
              $edit_page = (int) wpuf_get_option( 'edit_page_id', 'wpuf_frontend_posting' );
              $url = add_query_arg( array('pid' => $post->ID), get_permalink( $edit_page ) );
              ?>
              <a  class="button" href="<?php echo wp_nonce_url( $url, 'wpuf_edit' ); ?>"><?php _e( 'Edit', 'wpuf' ); ?></a>

              <?
              $del_url = add_query_arg( array('action' => 'del', 'pid' => $post->ID) );
              $message = __( 'Wirklich löschen?', 'wpuf' );
              ?>
              <a class="button" href="<?php echo wp_nonce_url( $del_url, 'wpuf_del' ) ?>" onclick="return confirm('<?php echo $message ?>');">
                <?php _e( 'Delete', 'wpuf' ); ?>
              </a>
            </div>
          </div>

        <?
        endwhile;
        wp_reset_postdata();

      else:
        // printf( '<div class="wpuf-message">' . __( 'Keine Einträge gefunden', 'wpuf' ) . '</div>', $post_type_obj->label );
        // do_action( 'wpuf_account_posts_nopost', $userdata->ID, $post_type_obj );

        // $your_query = new WP_Query( 'page_id=20091' );
        // while ( $your_query->have_posts() ) : $your_query->the_post();
        //   echo '<section class="hinweise">';
        //     the_content();
        //   echo '</section>';
        // endwhile;
        // wp_reset_postdata();
        ?>
        <script>
          // window.location.replace('/startseite/')
          window.location.replace('/einreichen/')
        </script>
        <?

      endif;

      wp_reset_postdata();
      ?>

      </div> <? // columns ?>


    </div>
  </div>
</section>

<script>
var $buoop = {required:{e:-4,f:-3,o:-3,s:-1,c:-3},insecure:true,unsupported:true,mobile:false,api:2018.10,test:false };
function $buo_f(){
 var e = document.createElement("script");
 e.src = "//browser-update.org/update.min.js";
 document.body.appendChild(e);
};
try {document.addEventListener("DOMContentLoaded", $buo_f,false)}
catch(e){window.attachEvent("onload", $buo_f)}
</script>


<? get_footer(); ?>
