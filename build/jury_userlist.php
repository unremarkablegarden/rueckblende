<?
/**
 * Template Name: Jury — User list
 **/
get_header();

global $post;
$current_page = $post->post_name;

if ($_GET['method'] == 'export') {
  $export = true;
} else {
  $export = false;
}

if ($_GET['series'] == 'true') {
  $series_only = true;
  $series_count = 0;
  $series_count2 = 0;
  $series_users = [];
}

if ($_GET['filter'] == 'empty') {
  $filterempty = true;
} else {
  $filterempty = false;
}
?>

<? if($export || $filterempty): ?>
<style>
#pre-header-spacer {
  height: 0 !important;
  min-height: 0 !important;
  overflow: hidden !important;
}
#header-sticky-wrapper, #footer, h1.title {
  display: none !Important;
}
</style>
<? endif; ?>

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
      
      // echo "<xmp>";
      // print_r($users);
      // echo "</xmp>";

      $userlist = array();
      $blankusers = array();
      $participants = array();
      
      $allTotal['foto'] = 0;
      $allTotal['series'] = 0;
      $allTotal['karikatur'] = 0;

      foreach($users as $user) {

        $id = $user->data->ID;
        $name = um_get_display_name($id);
        if(!$name) $name = $user->data->user_nicename;
        um_fetch_user($id);
        $usermeta = get_user_meta($id);
        $email = $usermeta['e-mail'][0];
        if(!$email) $email = $user->data->user_email;

        // if ($id == 347) {
        //   echo "<xmp>";
        //   echo $name;
        //   echo "\n";
        //   print_r($usermeta);
        //   echo "\n";
        //   echo $email;
        //   echo "</xmp>";
        // }
        
        if (!$user->caps['administrator'] && $usermeta['first_name'][0]) {
          // $usermeta['_wp_http_referer'][0] == '/registrieren/'
          // not admin, has firstname (* required at signup), signed up from registration page

          // echo '<xmp>';
          // print_r($usermeta);
          // echo '</xmp>';

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
          
          // echo "<xmp>";
          // print_r($submissions);
          // echo "</xmp>";

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
              $allTotal['foto']++;
            }
            else if($kat == 'serie') {
              $state['total']['serie'] = $state['total']['serie'] + 1;
              $allTotal['series']++;
            }
            else if($kat == 'karikatur') {
              $state['total']['karikatur'] = $state['total']['karikatur'] + 1;
              $allTotal['karikatur']++;
            }
          }

          // set user array
          $user = array(
            'first_name' => $usermeta['first_name'][0],
            'last_name' => $usermeta['last_name'][0],
            'full_name' => $usermeta['first_name'][0]." ".$usermeta['last_name'][0],
            'type' => $usermeta['user_profession'][0],
            'e-mail' => $email,
            'count' => $state['total'],
            'meta' => $usermeta
          );
          
          // echo "<xmp>";
          // echo $state['total']['foto']." ".$state['total']['serie']." ".$state['total']['karikatur'];
          // echo "</xmp>";
          
          if ($state['total']['foto'] == 0 && $state['total']['serie'] == 0 && $state['total']['karikatur'] == 0) {
            $blankusers[] = $user;
          } else {
            $participants[] = $user;
          }

          $userlist[] = $user;
        }

      }
      ?>

      <? if(!$filterempty && !$export): ?>
      Total fotos: <? echo $allTotal['foto'] ?><br/>
      Total series fotos: <? echo $allTotal['series'] ?><br/>
      Total karikaturen: <? echo $allTotal['karikatur'] ?><br/>
      Total entries (alle): <? echo $allTotal['foto']+$allTotal['series']+$allTotal['karikatur'] ?><br/>
      <br/>
      Users total: <? echo count($userlist) ?><br/>
      Users without entries: <? echo count($blankusers) ?><br/>
      Users with entries: <? echo count($participants) ?><br/>
      <br/>
      <? endif; ?>
      
      
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
      // print_r($users);
      // echo '</xmp>';
      
      ?>

      <?
      if($filterempty) {
        $people = $participants;  
      } else {
        $people = $userlist;  
      }
      
      $sortArray = array();
      foreach($people as $person){
          foreach($person as $key=>$value){
              if(!isset($sortArray[$key])){
                  $sortArray[$key] = array();
              }
              $sortArray[$key][] = $value;
          }
      }
      $orderby = "last_name";
      array_multisort($sortArray[$orderby],SORT_ASC,$people);
      $userlist = $people;
      ?>

      <? if(!$export): ?>

        <table id='usertable' width='100%'>
          <tr>
            <td><b>#</b></td>
            <td><b>Name</b></td>
            <td><b>Type</b></td>
            <td><b>E-Mail</b></td>
            <td><b>Foto #</b></td>
            <td><b>Serie #</b></td>
            <td><b>Karikatur #</b></td>
          </tr>
          <? $i = 0; ?>
          <? foreach($userlist as $user): ?>
            <tr>
              <td width='2%'>
                <? $i++; echo $i; ?>
              </td>
              <td width='20%'>
                <? echo $user['full_name']; ?>
              </td>
              <td width='10%'>
                <? 
                $usr = $user['type']; 
                if ($usr) {
                  $usr = explode('"', $usr);
                  echo $usr[1];
                }
                ?>
              </td>
              <td width='40%'>
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
                else {
                  echo '<b>'.$c.'</b>';
                  if ($series_only) {
                    $series_count++;
                    $series_names[] = $user['full_name'];
                  }
                }
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

      <? else: ?>

        <?
        $fields = array(
          'country',
          'user_profession',
          'birth_date',
          'user_street',
          'user_address_additional',
          'user_postcode',
          'user_city',
          'phone_number',
          'user_public-phonenumber',
          'user_public-email'
        );
        ?>

        <table id='usertable' width='100%'>
          <tr>
            <td><b>Name</b></td>
            <td><b>E-Mail</b></td>
            <? foreach($fields as $field) {
              echo "<td><b>".$field."</b></td>";
            } ?>
          </tr>
          <? foreach($userlist as $user): ?>
            <tr>
              <td width='8%'>
                <? echo $user['full_name']; ?>
              </td>
              <td width='8%'>
                <? echo $user['e-mail']; ?>
              </td>

              <? foreach($fields as $field) {
                $data = $user['meta'][$field][0];

                if (strpos($data, 'Karikaturist') !== false) { $data ='Karikaturist'; }
                if (strpos($data, 'Fotograf') !== false) { $data ='Fotograf'; }
                // if (strpos($data, '') !== false) { $data =''; }
                
                echo "<td width='8%'>".$data."</td>";
              } ?>

            </tr>
          <? endforeach; ?>
        </table>

      <? endif; ?>
      <? if($series_only): ?>
        <h1>series count: <? echo $series_count; ?></h1>
        <? debug($series_names); ?>
      <?endif;?>
    </div>
  </div>
</section>

<? else: ?>
  <section class='section'>
    <div class='content'>
      Zugang verweigert
    </div>
  </section>

<? endif; ?>

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
  #pre-header-spacer {
    height: 0 !important;
    min-height: 0 !important;
    overflow: hidden !important;
  }
</style>

<? get_footer(); ?>
