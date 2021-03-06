<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title><?php wp_title( '-', true, 'right' ); ?><?php bloginfo( 'name' ); ?></title>
<link rel="profile" href="http://gmpg.org/xfn/11" />
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.1/css/bulma.min.css">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
  <div id="page" class="hfeed site">

    <div id="logos">
      <div class="logo left">
        <img src="<? img(); ?>/index/logos/1_RP.svg" alt="RheinlandPlfalz">
      </div>
      <div class="logo right">
        <img src="<? img(); ?>/index/logos/2_BDZV.svg" alt="BDZV">
      </div>
    </div>

    <? include('pre-header.php'); ?>

    <header id="header" class="flex-space-between">
      <!-- <nav class="navbar" role="navigation" aria-label="main navigation"> -->


      <div class="flex-spacer">&nbsp;</div>
      <div class="site-branding">
        <h1 class="site-title">
          <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
            <? // GET ONE PAGE by slug
            $q = new WP_Query(array( 'page_id' => get_ID_by_slug('header-logo') ));
            if($q->have_posts()): while($q->have_posts()): $q->the_post();
              echo get_the_content();
            endwhile; wp_reset_postdata(); endif; ?>
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
