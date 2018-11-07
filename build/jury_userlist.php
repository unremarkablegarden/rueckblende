<?
/**
 * Template Name: Jury — User list
 **/
get_header();

global $post;
$current_page = $post->post_name;
?>

<section class="section user-list">
  <div class="columns">
    <div class="column">
      <h1 class='title'>Benutzerliste</h1>
    </div>
  </div>

  <?
  $user = wp_get_current_user();
  $allowed_roles = array('editor', 'administrator');
  if( array_intersect($allowed_roles, $user->roles ) ):
  ?>

  <div class="columns">
    <div class="column">
      <?
      $args = array(
        // 'role' => 'level_1',
        // 'role__in' => array('level_1'),
        'role__not_in' => array('level_2', 'level_3', 'level_4', 'level_5', 'level_6', 'level_7', 'level_8', 'level_9', 'level_10'),
        'orderby' => 'nicename',
        'order' => 'ASC',
        'number' => '999',
      );
      $users = get_users( $args );

      $userlist = array();

      foreach($users as $user) {

        $id = $user->data->ID;
        $name = um_get_display_name($id);
        if(!$name) $name = $user->data->user_nicename;
        um_fetch_user($id);
        $usermeta = get_user_meta($id);
        $email = $usermeta['e-mail'][0];
        if(!$email) $email = $user->data->user_email;

        if (!$user->caps['administrator'] && $usermeta['first_name'][0]) {
          // not admin, has firstname (* required at signup)

          // count images
          $args = array(
            'author'        =>  $id,
            'orderby'       =>  'post_date',
            'order'         =>  'ASC',
            'posts_per_page' => -1,
            'year'          => date('Y'),
          );
          $submissions = get_posts( $args );

          $state = array();
          $state['total']['foto'] = 0;
          $state['total']['serie'] = 0;
          $state['total']['karikatur'] = 0;

          foreach($submissions as $sub) {
            $cf = get_post_custom($sub->ID);
            $kat = $cf['kategorie'][0];
            if(!$state['serienname']) {
              $state['serienname'] = $cf['serienname'][0];
            }
            if(!$state['standort']) {
              $state['standort'] = $cf['standort'][0];
            }
            if($kat == 'foto') {
              $state['total']['foto'] = $state['total']['foto'] + 1;
            }
            else if($kat == 'serie') {
              $state['total']['serie'] = $state['total']['serie'] + 1;
            }
            else if($kat == 'karikatur') {
              $state['total']['karikatur'] = $state['total']['karikatur'] + 1;
            }
          }

          // set user array

          $user = array(
            'first_name' => $usermeta['first_name'][0],
            'last_name' => $usermeta['last_name'][0],
            'full_name' => $usermeta['first_name'][0]." ".$usermeta['last_name'][0],
            'e-mail' => $email,
            // '' => $usermeta[''][0],
            'count' => $state['total'],
          );

          $userlist[] = $user;
        }

      }
      ?>


      <?
      // [0] => Array
      // (
      //     [first_name] => Christiane
      //     [last_name] => Nehring
      //     [full_name] => Christiane Nehring
      //     [e-mail] => info@christiane-nehring.com
      //     [count] => Array
      //         (
      //             [foto] => 0
      //             [serie] => 0
      //             [karikatur] => 0
      //         )
      // )

      // echo '<xmp> ';
      // print_r($userlist);
      // echo '</xmp>';
      ?>
      <table id='usertable' width='100%'>
        <tr>
          <td><b>Name</b></td>
          <td><b>E-Mail</b></td>
          <td><b>Foto #</b></td>
          <td><b>Serie #</b></td>
          <td><b>Karikatur #</b></td>
        </tr>
        <? foreach($userlist as $user): ?>
          <tr>
            <td width='20%'>
              <? echo $user['full_name']; ?>
            </td>
            <td width='50%'>
              <? echo $user['e-mail']; ?>
            </td>
            <td width='10%'>
              <?
              $c = $user['count']['foto'];
              if($c == 0) echo '<span class="zero">'.$c.'</span>';
              else echo '<b>'.$c.'</b>';
              ?>
            </td>
            <td width='10%'>
              <?
              $c = $user['count']['serie'];
              if($c == 0) echo '<span class="zero">'.$c.'</span>';
              else echo '<b>'.$c.'</b>';
              ?>
            </td>
            <td width='10%'>
              <?
              $c = $user['count']['karikatur'];
              if($c == 0) echo '<span class="zero">'.$c.'</span>';
              else echo '<b>'.$c.'</b>';
              ?>
            </td>
          </tr>
        <? endforeach; ?>
      </table>

    </div>
  </div>
</section>


<style>
  .user {
    padding: 10px; margin: 10px; border: 1px #ddd solid;
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
</style>

<? else: ?>
  <section class='section'>
    <div class='content'>
      Zugang verweigert
    </div>
  </section>

<? endif; ?>

<? get_footer(); ?>
