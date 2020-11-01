<?

/**
 * Template Name: Debug
 **/
get_header();

global $post;
$current_page = $post->post_name;

?>

<style>
  #pre-header-spacer {
    height: 0 !important;
    min-height: 0 !important;
    overflow: hidden !important;
  }

  #header-sticky-wrapper,
  #footer,
  h1.title {
    display: none !Important;
  }
</style>


<section class="section user-list">
  <div class="columns">
    <div class="column">
      <h1 class='title'>Serienliste</h1>
    </div>
  </div>
  <?
  $user = wp_get_current_user();
  $allowed_roles = array('editor', 'administrator');
  if (array_intersect($allowed_roles, $user->roles)) :
    ?>
    <style>
      td {
        padding: 4px;
      }
    </style>
    <div class="columns">
      <div class="column">
        <table border="1" style="font-size: 14px;">
          <tr style="font-weight: bold;">
            <td>author</td>
            <td>series</td>
            <td>title</td>
            <td>time</td>
          </tr>
        <?


  $unique_users = [];
  $series_names = [];
  $both = [];

  // count total series
  $args = array(
    'posts_per_page' => -1,
    'year'          => date('Y'),
    // 'orderby'         => 'date',
    'orderby'         => 'author',
    'order'           => 'ASC',
  );
  $all_submissions = get_posts($args);
  $all_seris = array();
  
  $titleCount = 0;
  $unique_titles = [];
  
  foreach ($all_submissions as $sub) {
    $cf = get_post_custom($sub->ID);
    $kat = $cf['kategorie'][0];
    if ($kat == 'serie') {
      $sub->kat = $kat;
      $author = get_author_name($sub->post_author);
      $series_name = $cf['serienname'][0];
      $author_series = $author . "_" . $series_name;
      $array_place = sanitize_title($author_series);

      if (!in_array($author, $unique_users)) {
        $unique_users[] = $author;
        if (!in_array($series_name, $series_names)) $series_names[] = $author."\t".$series_name;
      }
      
      
      
      if ($series_name) if (!in_array($author_series, $both)) $both[] = $author_series;
      
      echo '<tr>';
        echo '<td>';
        echo $author;
        echo '</td>';
        echo '<td>';
        echo $series_name;
        echo '</td>';
        echo '<td>';
        echo get_the_title($sub->ID);
        echo '</td>';
        echo '<td>';
        echo gmdate('Y-m-d H:i:s', get_post_time('U', false, $sub->ID));
        echo '</td>';
      echo '</tr>';

      $n = $all_series[$array_place];
      if (!$n) {
        $n = 0;
      }
      if ($n == 0 || $n > 0) {
        $n = $n + 1;
      }
      // this array has an index which is a slug made of author name and series name, and contains the total count of images that user submitted in that series.
      $all_series[$array_place] = $n;
    }
  }

        ?>
        </table>
        
        <? debug($unique_users); ?>
        <? debug($series_names); ?>
        <? debug($both); ?>
        
      </div>
    </div>
</section>

<? else : ?>
  <section class='section'>
    <div class='content'>
      Zugang verweigert
    </div>
  </section>

<? endif; ?>

<style>
  .user {
    padding: 10px;
    margin: 10px;
    border: 1px #ddd solid;
  }

  #usertable {
    border: 1px #aaa solid;
    font-size: 0.86em;
  }

  #usertable td {
    padding: 6px 12px;
    border: 1px #AAA solid;
  }

  .zero {
    opacity: 0.4;
  }

  #pre-header-spacer {
    height: 0 !important;
    min-height: 0 !important;
    overflow: hidden !important;
  }
</style>

<? get_footer(); ?>