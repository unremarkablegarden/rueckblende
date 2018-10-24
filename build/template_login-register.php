<?
/**
 * Template Name: CMS Login / Register
 **/
get_header();

global $post;
$current_page = $post->post_name;
?>

<section class="login-register">
  <div class="columns">
    <div class="column is-3 form">
      <?
        if($current_page == 'login'){
          echo '<p>
                  Bitte geben Sie den von Ihnen ausgewählten Usernamen und das Passwort ein, um sich anzumelden.
                </p>';
          echo do_shortcode( '[ultimatemember form_id=20048]' );
          echo '<p>
                  Bitte denken Sie daran, unter „Anmeldung“ Ihre persönlichen Daten zu aktualisieren, damit wir Sie zuverlässig erreichen können.
                </p>
                <p>
                  Hier können Sie auch eine Mail- oder Webadresse und eine Telefonnummer zur Veröffentlichung im Katalog angeben.
                </p>';
        }
        elseif ($current_page == 'registrieren') {
          echo '<p>
                  Hier können Sie sich registrieren.
                  Sollten Sie bereits im letzten Jahr an der Rückblende teilgenommen haben, können Sie sich mit ihren damaligen Anmeldedaten über den Navigationspunkt Login anmelden!
                </p>
                <p>
                  Erst nach der Anmeldung können Sie Bilder hochladen.
                  Um am Wettbewerb teilnehmen zu können, benötigen wir Ihre Anmelde- und Kontaktdaten, über die wir Sie zuverlässig einreichen können:
                </p>';
                // <p>
                //   Die mit * gekennzeichneten Felder müssen ausgefüllt werden.
                // </p>';
          echo do_shortcode( '[ultimatemember form_id=20047]' );
        }
      ?>
    </div>
    <div class="column is-6 content">
      <? the_content(); ?>
    </div>
  </div>
</section>

<? get_footer(); ?>
