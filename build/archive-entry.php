<?php
get_header();?>
<section class="container">
	<div class="columns is-multiline">





	<? if(have_posts()) : while(have_posts()) : the_post(); ?>

	<div class=" column is-3">
		<?
		$id = get_field('imageid');
		$year = get_field('year');
		?>
		<img src="/wp-content/photos/<? echo $year; ?>/thumbs/<? echo $id; ?>.jpg">
		<p>
			<? the_title(); ?>
		</p>
	</div>



	<? endwhile; endif; ?>

</div>
</section>

<? get_footer(); ?>
