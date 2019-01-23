<div id="entries">

<?
global $post;
$slug = $post->post_name;
$year = date('Y', strtotime('-1 year') );
$current_year = $year; // SETS THE CURRENT CONTEST'S YEAR

$y = $_POST['y'];
	if(!$y) $y = $_GET['y'];
$c = strtolower($_POST['c']);
	if(!$c) $c = strtolower($_GET['c']);
$w = $_POST['w'];
	if(!$w) $w = $_GET['w'];

$search = $_POST['search'];
	if(!$search) $search = $_GET['search'];

$paged = $_POST['pg'];
	if(!$paged) $paged = $_GET['$paged'];
	if(!$paged) $paged = 1;
$per_page = $_POST['pp'];
	if(!$per_page) $per_page = $_GET['pp'];
	if(!$per_page) $per_page = 20;

if(!$y) $y = $year;
// if(!$c) $c = 'Karikatur';

if($w == 'exclude' || $slug == 'teilnehmer') {
  $w_long = 'EXCLUDE,photo_prize_first,das_scharfe_sehen_1,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3';
  $winners = 'exclude';
}

if($w == 'winners') {
	// include means "get only these"...
  $w_long = 'INCLUDE,photo_prize_first,das_scharfe_sehen_1,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3';
  $winners = true;
} else {
  $winners = false;
  $all = true;
}

$url = '?search='.$search.'&y='.$y.'&c='.$c.'&w='.$w;

?>

<?
$args = array(
	'post_type'	=> 'entry',
	'posts_per_page' => $per_page,
	'paged' => $paged
);

global $Rquery;
$Rquery = new WP_Query( $args );
$Rquery->query_vars['magic'] = true;
$Rquery->query_vars['custom_year'] = $y;
$Rquery->query_vars['custom_category'] = $c;
$Rquery->query_vars['winner'] = $w;
$Rquery->query_vars['filter_series'] = true;
$Rquery->query_vars['per_page'] = $per_page;
$Rquery->query_vars['s'] = $search;

relevanssi_do_query($Rquery);

// debug($Rquery);

$series_names = array();

if($Rquery->have_posts()): while($Rquery->have_posts()) : $Rquery->the_post(); ?>
		<?
		$imageid = get_field('imageid');
		$year = get_field('year');
		$caption = get_field('caption');
		if( strlen($caption) > 100 ) {
			$caption = excerpt($caption, 100);
		}
		$series_name = get_field('series_name');
		$name = ucwords(get_field('vorname'))." ".ucwords(get_field('nachname'));
		$category = strtolower(get_field('category'));
		$year = get_field('year');
		$thumb = get_entry_src($year, $imageid, true);

		// if( !in_array($series_name, $series_names) || $category !== 'Serie' ):

			// if($category == 'Serie') $series_names[] = $series_name;
		?>

			<div class="entry column is-3">
				<a href="<? the_permalink(); ?>">
					<div class="image" style="background-image: url('<? echo $thumb; ?>')">&nbsp;</div>
					<div class="name">
						<? echo $name; ?>
					</div>
					<? if($series_name) { ?>
						<div class="series">
							<? echo $series_name; ?>
						</div>
					<? } if($caption) { ?>
						<div class="caption">
							<? echo $caption; ?>
						</div>
					<? }?>
				</a>
			</div>

		<?

		// endif;
endwhile; else:
	echo "Nada";
endif;
?>

</div>
