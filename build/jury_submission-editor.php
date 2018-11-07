<?
/**
 * Template Name: Jury — Submission editor
 **/
get_header();

global $post;
$current_page = $post->post_name;
?>

  <section class="section user-list">
    <!-- <div class="columns">
      <div class="column">
        <h1 class='title'>Benutzerliste</h1>
      </div>
    </div> -->

    <?
    $user = wp_get_current_user();
    $allowed_roles = array('editor', 'administrator');
    if( array_intersect($allowed_roles, $user->roles ) ):
    ?>

    <div class="columns">
      <div class="column">
        sub editor
      </div>
    </div>
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
</style>

<? get_footer(); ?>
