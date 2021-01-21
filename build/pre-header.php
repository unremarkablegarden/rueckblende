<?
global $post;
$slug = $post->post_name;

$slugswithheader = array(
  'homepage',
  'archiv',
  'katalog',
  'ausstellungen',
  'preistraeger',
  'teilnehmer',
  'shortlist',
  'login',
  'register',
  'passwort',
  'konto',
  'bildverwaltung',
  'einreichen',
  'guestlist',
  'registrieren',
  'preise',
  'teilnahmebedingungen',
  'video',
  'showroom'
);

$post_type = get_post_type();

if( in_array($slug, $slugswithheader) || $post_type == 'entry' ) $bigheader = true;
else $bigheader = false;
?>

<div id="header-logos">
  <div class="logo left">
    <a href="https://landesvertretung.rlp.de/de/startseite/" target="_blank">
      <img src="<? img(); ?>/index/logos/1_RP.svg" alt="RheinlandPlfalz">
      </a>
  </div>
  <div class="logo right">
    <a href="https://www.bdzv.de/" target="_blank">
      <img src="<? img(); ?>/index/logos/2_BDZV.svg" alt="BDZV">
    </a>
  </div>
</div>


<div id="pre-header-spacer" class="<? if(!$bigheader) echo "small"; ?>">&nbsp;</div>
<div id="pre-header" class="flex-center <? if(!$bigheader) echo "small"; ?>">

  <? if($bigheader): ?>

    <? // HOMEPAGE
    if ($slug === 'homepage'): ?>

      <?
      $id = get_ID_by_slug('homepage/header-gallery');
      $gallery_items = get_post_gallery_images_with_info($id);
      // debug($gallery_items);
      // $gallery_items = array();
      ?>
      <div class="gallery owl-carousel home1 autoplay">
        <?
        $class[0] = 'photo_winner';
        $class[1] = 'cartoon_winner';
        $class[2] = 'cartoon_public';
        $class[3] = 'photo_public';
        $i = 0;
        foreach($gallery_items as $item): ?>
          <div class="gallery-item <? echo $class[$i]; ?>">
            <div class="image">
              <div class="watermark">
                <img src="<? echo $item['src']; ?>"/>
              </div>
            </div>
            <div class="gallery-caption">
              <a href="<? echo $item['description']; ?>">
                <? echo $item['caption']; ?>
              </a>
            </div>
          </div>
        <? $i++; endforeach; ?>
      </div>

      <!-- wp query too slow. manual gallery -->
      <!-- <div class="gallery owl-carousel home1 autoplay">
        <div class="gallery-item photo_winner">
          <div class="image">
            <div class="watermark">
              <img src="/wp-content/photos/2017/38E534021E685D49.jpg"/></div>
          </div>
          <div class="gallery-caption">
            <a href="/entry/2017-herzau-andreas-38e534021e685d49/">
              Preis für die beste Fotografie 2017: Andreas Herzau
            </a>
          </div>
        </div>
        <div class="gallery-item cartoon_winner">
          <div class="image">
            <div class="watermark">
              <img src="/wp-content/photos/2017/A106A33527CED712.jpg"/></div>
          </div>
          <div class="gallery-caption">
            <a href="/entry/2017-wurster-miriam-a106a33527ced712/">
              Preis für die beste Karikatur 2017: Miriam Wurster
            </a>
          </div>
        </div>
      </div> -->


    <? // PREISTRÄGER
    elseif ($slug === 'preistraeger'): ?>
      <div class="badge">
        <img src="<? img(); ?>/badges/badge_winners.svg" alt="">
      </div>

    <? // TEILNEHMER
    elseif ($slug === 'teilnehmer'): ?>
      <div class="badge">
        <img src="<? img(); ?>/badges/badge_teilnehmer.svg" alt="">
      </div>

    <? // SHORTLIST
    elseif ($slug === 'shortlist'): ?>
      <div class="badge">
        <img src="<? img(); ?>/badges/badge_shortlist.svg" alt="">
      </div>

    <? // AUSSTELLUNG
    elseif ($slug === 'ausstellungen'): ?>
      <div class="badge">
        <!-- <img src="<? img(); ?>/badges/badge_tournee.svg" alt=""> -->
        <!-- <img src="<? img(); ?>/badges/badge_tournee@2x.png" alt=""> -->
        <img src="/wp-content/themes/rueckblende/2020/badge_tour.svg" alt="">
        
      </div>

    <? // KATALOG
    elseif ($slug === 'katalog'): ?>
      <div class="badge katalog">
        <img src="<? img(); ?>/badges/badge_book.png" alt="">
        <!-- <img src='https://rueckblende.rlp.de/wp-content/uploads/2021/01/katalog2020-600x586-600x586.jpg'/> -->
      </div>

    <? // ARCHIV
    elseif ($slug === 'archiv'): ?>
      <div class="badge">
        <img src="<? img(); ?>/badges/badge_archive.svg" alt="">
      </div>

    <? // PHOTO SINGLE

    elseif ($post_type === 'entry'): ?>
      <div class="badge">
        <img src="<? img(); ?>/badges/badge_imagepage_search.svg" alt="">
      </div>

    
    <? 
    // VOTING
    elseif ($slug == 'showroom'): ?>
      <div class="badge">
        <img src="<? img(); ?>/badges/badge_audience.svg" alt="">
      </div>
      
    <? // IMPRESSUM / DATENSCHUTZ
    elseif ($slug === 'impressum' || $slug === 'datenschutz'): ?>
      <div class="badge">
        <img src="<? img(); ?>/badge.svg" alt="">
      </div>


    <?
    elseif ($slug === 'login' || 
    $slug === 'register' ||
    $slug === 'passwort' ||
    $slug === 'konto' ||
    $slug === 'bildverwaltung' ||
    $slug === 'konto' ||
    $slug === 'einreichen' ||
    $slug === 'guestlist' || 
    $slug === 'registrieren' || 
    $slug === 'preise' || 
    $slug === 'teilnahmebedingungen'
    ): ?>
      <div class="badge">
        <img src="<? img(); ?>/badges/badge_2020.svg" alt="">
      </div>

    <? // SEARCH
    // elseif (is_search() || $slug === 'search'): ?>
      <?
      // global $query_string;
      // wp_parse_str( $query_string, $search_query );
      // $s = $search_query['s'];
      ?>
      <!-- <form role="search" action="<?php echo site_url('/'); ?>" method="get" id="searchform">
        <input type="text" name="s" placeholder="Name..." value="<? echo $s; ?>" autocomplete="off"/>
        <input type="submit" alt="Search" value="Search" />
      </form> -->
    <? else: ?>
      <!-- <div class="badge">
        <img src="<? img(); ?>/badges/badge_2020.svg" alt="">
      </div> -->
    <? endif;?>
  <? endif;?>
</div>
