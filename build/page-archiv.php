<?
get_header();

global $post;
$slug = $post->post_name;
$year = date('Y', strtotime('-1 year') );
$current_year = $year; // SETS THE CURRENT CONTEST'S YEAR
// $first_year = 2006;
$first_year = 2003;
$last_year = $current_year;
$total_years = $last_year - $first_year;

?>

<div class="wrappy" id="<? echo $slug ?>" data-section="winners">
  <div class="content-header">

    <div class="info-stuff">
      <h1>
        <span class="preistraeger" data-section="winners">Preisträger-Archiv</span>
        <span class="archiv" data-section="archive">Gesamt-Archiv</span>
      </h1>
      <div class="page-description"><? the_content(); ?></div>
    </div>



    <div class="tabs-search">
      <div class="tabs is-centered">
        <ul>
          <li data-tab="winners">
            <a>Preisträger-Archiv</a>
          </li>
          <li data-tab="archive">
            <a>Gesamt-Archiv</a>
          </li>
        </ul>
      </div>
      <div class="search" data-section="archive">
        <form class="search-field" id="searchform">
          <input name="s" type="text" name="" placeholder="Suche..." autocomplete="off">
          <button type="submit" alt="Search" value="Search">
            <img class="search-icon" src="<? img(); ?>/search_participators/icon_search_l.svg">
          </button>
        </form>
      </div>
    </div>


  </div>

    <div class="container slider-section">
      <div class="columns is-mobile">
        <div class="column is-3-mobile is-2-desktop has-text-right">
          <output class="year" for="yearFilter" id="filterYear"><? echo $last_year; ?></output>
        </div>
        <div class="column is-8-mobile is-offset-1-mobile is-10-desktop">
          <input class="slider is-fullwidth is-large is-circle has-output" step="1" min="<? echo $first_year; ?>" max="<? echo $last_year; ?>" value="<? echo $last_year; ?>" type="range" id="yearFilter">
        </div>
      </div>
    </div>


    <div class="archive-filter-wrap" data-section="archive">
      <div class="tabs archive-filter">
        <ul>
          <li data-category="foto" class="is-active">
            <a>Fotografie</a>
          </li>
          <li data-category="karikatur">
            <a>Karikatur</a>
          </li>
          <li data-category="serie" class='series_archive_wrapper'>
            <a>Serie</a>
          </li>
        </ul>
      </div>
    </div>



    <section class="section winners" data-section="winners">
      <div class="container">

        <strong class="pad">Fotografie</strong>

        <div class="columns is-multiline is-loading">
          <div class="column is-3" data-prize="photo_prize_first"></div>
          <div class="column is-3" data-prize="photo_prize_2"></div>
          <div class="column is-3" data-prize="photo_prize_3"></div>
          <div class="column is-3" data-prize="das_scharfe_sehen_1"></div>
          <div class="column is-3" data-prize="das_scharfe_sehen_2"></div>
          <div class="column is-3" data-prize="series_prize_1"></div>
          <div class="column is-3" data-prize="photo_public"></div>
        </div>

        <hr>

        <strong class="pad">Karikatur</strong>
        <div class="columns is-multiline is-loading">
          <div class="column is-3" data-prize="cartoon_prize_1"></div>
          <div class="column is-3" data-prize="cartoon_prize_2"></div>
          <div class="column is-3" data-prize="cartoon_prize_3"></div>
          <div class="column is-3" data-prize="cartoon_public"></div>
        </div>

        

        <div class='series_archive_wrapper'>
          <hr>
          <strong class="pad">Serie</strong>
          <div class="columns is-multiline is-loading">
            <div class="column is-3" data-prize="series_prize_1"></div>
            <!-- <div class="column is-3" data-prize="cartoon_prize_2"></div>
            <div class="column is-3" data-prize="cartoon_prize_3"></div>
            <div class="column is-3" data-prize="cartoon_public"></div> -->
          </div>
        </div>

      </div>
    </section>


    <section class="section archive" data-section="archive">
      <div class="container">
        <div class="columns is-multiline is-loading" id="results" data-state="empty">
          <? // load page-fetch with ajax ?>
        </div>
      </div>
    </section>

    <!-- <div class="pagination">
      <a class="arrow prev" data-dir="prev"><</a>
      <a class="arrow next" data-dir="next">></a>
    </div> -->

    <section class="section has-text-centered loadmore is-hidden" data-section="archive">
      <button type="button" name="load-more" id="load-more" class="button is-medium">Mehr laden</button>
    </section>

</div>
<? get_footer(); ?>
