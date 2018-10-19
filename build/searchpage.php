<?php
/*
Template Name: Search Page
*/
?>
<? get_header(); ?>

<section>
	<div class="container" style="margin-top: 50px;">
		<form role="search" action="<?php echo site_url('/'); ?>" method="get" id="searchform">
			<input type="text" name="s" placeholder="Name..." value="<? echo $s; ?>" autocomplete="off"/>
			<input type="submit" alt="Search" value="Search" />
		</form>
	</div>
</section>
<section>
	<div class="container" style="margin-top: 50px;">
		<div class="columns is-multiline" id="results">
		</div>
	</div>
</section>

<? get_footer(); ?>
