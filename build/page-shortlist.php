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
          <li data-category="Karikatur" class="<? if($c == 'Karikatur') echo 'is-active'; ?>">
              <a>Karikatur</a>
          </li>

          <li data-category="Foto" class="<? if($c == 'Foto') echo 'is-active'; ?>">
              <a>Fotografie</a>
          </li>

          <li data-category="Serie" class="<? if($c == 'Serie') echo 'is-active'; ?>">
              <a>Serie</a>
          </li>
      </ul>
    </div>
  </div>

    <!-- <section class="content-grid paddy"> -->
    <section class=" section container">
      <div class="columns is-multiline is-loading" id="results" data-state="empty">
        <? // load page-fetch with ajax ?>
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

</div>
<? get_footer(); ?>
