<?
/**
 * Template Name: CMS Account
 **/
get_header();

global $post;
$current_page = $post->post_name;
?>
<!-- <section class="account"> -->
<section class="upload-page account">
  <div class="columns">
    <div class="column is-3 side-menu">
      <? include('cms-menu.php');  ?>
    </div>
    <div class="column is-9 main content">

      <? //$form = '[ultimatemember form_id="20049"]';  ?>
      
        <? //echo(do_shortcode($form)); ?>
      <? // echo wpautop(do_shortcode(get_the_content())); ?>
      
      <? the_content(); ?>

    </div>
  </div>
</section>

<script>
var $buoop = {required:{e:-4,f:-3,o:-3,s:-1,c:-3},insecure:true,unsupported:true,mobile:false,api:2018.10,test:false };
function $buo_f(){
 var e = document.createElement("script");
 e.src = "//browser-update.org/update.min.js";
 document.body.appendChild(e);
};
try {document.addEventListener("DOMContentLoaded", $buo_f,false)}
catch(e){window.attachEvent("onload", $buo_f)}
</script>


<? get_footer(); ?>
