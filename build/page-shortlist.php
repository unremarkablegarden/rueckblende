<?
/**
 * Template Name: Shortlist
 **/

get_header();

?>

<div class="wrappy" id="<? echo $slug ?>">
  <div class="content-header">

    <div class="info-stuff">
      <h1><? the_title(); ?></h1>
      <div class="page-description"><? the_content(); ?></div>
    </div>

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

  <section class="section container" data-section="shortlist">
    <div class="columns is-multiline is-loading" id="results" data-state="empty">
      <? // load page-fetch with ajax ?>
    </div>
  </section>


  <!-- <section class="section archive" data-section="archive">
    <div class="container">
      <div class="columns is-multiline is-loading" id="results" data-state="empty">
      </div>
    </div>
  </section> -->


  <section class="section has-text-centered loadmore is-hidden" data-section="shortlist">
    <button type="button" name="load-more" id="load-more" class="button is-medium">Mehr laden</button>
  </section>

</div>
<? get_footer(); ?>
