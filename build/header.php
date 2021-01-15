<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<!-- <title><?php wp_title( '-', true, 'right' ); ?><?php bloginfo( 'name' ); ?></title> -->
<title><? wp_title(); ?></title>
<link rel="profile" href="http://gmpg.org/xfn/11" />
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
<!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.1/css/bulma.min.css"> -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.2/css/bulma.min.css">
<?php wp_head(); ?>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.2.1/assets/owl.carousel.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.2.1/assets/owl.theme.default.min.css">

<link rel="apple-touch-icon" sizes="180x180" href="/wp-content/themes/rueckblende/favicon/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/wp-content/themes/rueckblende/favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/wp-content/themes/rueckblende/favicon/favicon-16x16.png">
<link rel="manifest" href="/wp-content/themes/rueckblende/favicon/manifest.json">
<link rel="mask-icon" href="/wp-content/themes/rueckblende/favicon/safari-pinned-tab.svg" color="#5bbad5">
<link rel="shortcut icon" href="/wp-content/themes/rueckblende/favicon/favicon.ico">
<meta name="msapplication-config" content="/wp-content/themes/rueckblende/favicon/browserconfig.xml">
<meta name="theme-color" content="#ffffff">

</head>
<body <?php body_class(); ?>>
  <div id="page" class="hfeed site">

    <? 
    
    if ($_SERVER['REQUEST_URI'] == '/') { // is_home() not working?
      // include('pre-header-submissions.php');   
    }
    ?>
    
    
    <? include('pre-header.php'); ?>

    <header id="header" class="flex-space-between">
      <!-- <nav class="navbar" role="navigation" aria-label="main navigation"> -->


      <div class="flex-spacer">&nbsp;</div>
      <div class="site-branding">
        <h1 class="site-title">
          <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
            <?
            if ($slug === 'login' ||
              $slug === 'register' ||
              $slug === 'passwort' ||
              $slug === 'konto' ||
              $slug === 'bildverwaltung' ||
              $slug === 'konto' ||
              $slug === 'einreichen' ||
              $slug === 'guestlist' || 
              $slug === 'registrieren' || 
              $slug === 'preise' || 
              $slug === 'teilnahmebedingungen' || 
              $slug === 'fotos-preview' || 
              $slug === 'karikatur-preview' || 
              $slug === 'series-preview'
            ): ?>
              <img src="<? img(); ?>/logo_subline_2020.svg" alt="">
            <? else: ?>

              <? // GET ONE PAGE by slug
              // $q = new WP_Query(array( 'page_id' => get_ID_by_slug('header-logo') ));
              // if($q->have_posts()): while($q->have_posts()): $q->the_post();
              //   echo get_the_content();
              // endwhile; wp_reset_postdata(); endif;
              ?>
              <img src="<? img(); ?>/logo_subline.svg" alt="">

            <? endif; ?>
          </a>
        </h1>
      </div>

      <button class="button navbar-burger">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- </nav> -->
    </header>


    <nav id="menu" class="main-menu">

      <div class="badge">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><img src="<? img(); ?>/nav-badge.svg"/></a>
      </div>

      <div class="close">
        <img src="<? img(); ?>/menu-close.svg"/>
      </div>

      <div class="menu-wrapper">
        <div class="inner">
          
          <!-- <a href="/login/">
            <img src="<? img(); ?>/competition2020.svg" style="width: 380px; margin-right: -54px;"/>
          </a>
          <hr/> -->

          <div id="responsive-menu"><?php wp_nav_menu( array( 'theme_location' => 'header', 'menu_id' => 'menu-header', 'menu_class' => 'menu-inline' ) ); ?></div>

          <hr/>

          <div class="small-links">
            <a href="/impressum">Impressum</a><br/>
            <a href="/datenschutz">Datenschutz</a>
          </div>

        </div>
      </div>

    </nav>

    <div id="main">
