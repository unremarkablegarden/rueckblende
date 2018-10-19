<?  // get_header(); ?>

<?

$paged = $_GET['pg'];
if(!$paged) $paged = 1;
$args = array(
	'post_type'	=> 'entry',
	'posts_per_page' => 20,
	'paged' => $paged
);
$query = new WP_Query( $args );
$query->query_vars['magic'] = true;
$query->query_vars['custom_year'] = $_GET['y'];
$query->query_vars['custom_category'] = $_GET['c'];
$query->query_vars['winner'] = $_GET['w'];
$query->query_vars['s'] = $_GET['search'];
global $query;
relevanssi_do_query($query);

if($query->have_posts()): while($query->have_posts()) : $query->the_post();
	echo '<li>'.get_the_title().' — '.get_field('category').'</li>';
	// $imageid = get_field('imageid');
	// $year = get_field('year');
	// $name = get_field('vorname')." ".get_field('nachname');
	// $category = get_field('category');
	// $year = get_field('year');
	// $img = get_entry_src($year, $imageid, true);
	// echo '<div class="column is-2">';
	// echo '<div class="inner" style="background-color: #FFE; font-size: 12px; line-height: 1.2em;">';
	// echo '<img src="'.$img.'" />';
	// echo $name."<br/>";
	// echo $category.' ('.$year.')';
	// echo '</div></div>';
endwhile; endif;

?>

<? // get_footer(); ?>
