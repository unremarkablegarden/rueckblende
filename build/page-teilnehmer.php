<?
/**
 * Template Name: Teilnehmer
 **/

get_header();

?>

<div class="wrappy" id="<? echo $slug ?>">
  <div class="content-header">

    <div class="search">
      <form class="search-field" id="searchform">
        <input name="s" type="text" name="" placeholder="Suche..." autocomplete="off">
        <button type="submit" alt="Search" value="Search">
          <img class="search-icon" src="<? img(); ?>/search_participators/icon_search_l.svg">
        </button>
      </form>
    </div>
    <div class="phonebook">
      <div class="inner">
        <a href="/telefonbuch">Alle Teilnehmer</a>
      </div>
    </div>

    <!-- <div class="info-stuff">
      <h1><? the_title(); ?></h1>
      <div class="page-description"><? the_content(); ?></div>
    </div> -->

    <div class="tabs is-centered">
      <ul>
          <li data-category="karikatur" class="<? if($c == 'karikatur') echo 'is-active'; ?>">
              <a>Karikatur</a>
          </li>

          <li data-category="foto" class="<? if($c == 'foto') echo 'is-active'; ?>">
              <a>Fotografie</a>
          </li>

          <li data-category="serie" class="<? if($c == 'serie') echo 'is-active'; ?>">
              <a>Serie</a>
          </li>
      </ul>
    </div>
  </div>

    <!-- <section class="content-grid paddy"> -->
    <section class="section">
      <div class="container">
        <div class="columns is-multiline is-loading" id="results" data-state="empty">
          <? // load page-fetch with ajax ?>
        </div>
      </div>
    </section>

    <!-- </section> -->

    <!-- <div class="pagination is-hidden">
      <a class="arrow prev" data-dir="prev">
        <img src="<? img(); ?>/image_page/arrow_red_back.svg" alt="">
      </a>
      <div class="page">
        <span>1</span>
      </div>
      <a class="arrow next" data-dir="next">
        <img src="<? img(); ?>/image_page/arrow_red_forward.svg" alt="">
      </a>
    </div> -->

    <section class="section has-text-centered loadmore is-hidden" data-section="archive">
      <button type="button" name="load-more" id="load-more" class="button is-medium">Mehr laden</button>
    </section>

</div>
<? get_footer(); ?>
