<?
global $post;
$slug = $post->post_name;
?>

<div id="pre-header" class="flex-center">
	<? if ($slug === 'homepage'): ?>
		[the gallery for the homepage]

	<? elseif ($slug === 'preistraeger'): ?>
		<div class="badge">
			<img src="<? img(); ?>/badges/badge_winners.svg" alt="">
		</div>

	<? endif;?>
</div>
