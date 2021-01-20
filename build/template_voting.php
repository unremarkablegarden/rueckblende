<?
/**
 * Template Name: Voting
 **/
get_header();
?>
<section class="section">
  <div class="container">
		<div class='columns'>
			<div class='column is-8'>
					
				<h1>Showroom</h1>
				<br>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae suscipit consequuntur fugiat recusandae itaque quia voluptate eius voluptatem veniam excepturi ullam impedit provident quas fuga, accusamus, saepe reiciendis, consequatur nulla.</p>
			</div>
		</div>
	</div>
</section>
<?
$year = 2020;
// $year = 2017;

$Q_foto = array(
	'post_type'	=> 'entry',
	'posts_per_page' => -1,
	'meta_query'	=> array(
		'relation'		=> 'AND',
		array(
			'key'	 	=> 'shortlist',
			'value'	  	=> true
		),
		array(
			'key'	  	=> 'year',
			'value'	  	=> $year,
			'compare' 	=> '=',
		),
		array(
			'key' => 'category',
			'value' => 'foto'
		)
	),
	'meta_key' => 'nachname',
	'orderby' => 'meta_value',
	'order' => 'ASC',
);
$fotos = new WP_Query( $Q_foto );

$Q_karikatur = array(
	'post_type'	=> 'entry',
	'posts_per_page' => -1,
	'meta_query'	=> array(
		'relation'		=> 'AND',
		array(
			'key'	 	=> 'shortlist',
			'value'	  	=> true
		),
		array(
			'key'	  	=> 'year',
			'value'	  	=> $year,
			'compare' 	=> '=',
		),
		array(
			'key' => 'category',
			'value' => 'karikatur'
		)
	),
	'meta_key' => 'nachname',
	'orderby' => 'meta_value',
	'order' => 'ASC',
);
$karikaturen = new WP_Query( $Q_karikatur );

$Q_series = array(
	'post_type'	=> 'entry',
	'posts_per_page' => -1,
	'meta_query'	=> array(
		'relation'		=> 'AND',
		array(
			'key'	 	=> 'shortlist',
			'value'	  	=> true
		),
		array(
			'key'	  	=> 'year',
			'value'	  	=> $year,
			'compare' 	=> '=',
		),
		array(
			'key' => 'category',
			'value' => 'serie'
		)
	),
	'meta_key' => 'nachname',
	'orderby' => 'meta_value',
	'order' => 'ASC',
);
$serien = new WP_Query( $Q_series );


$sections = [
	$fotos,
	$karikaturen,
	$serien
];

// $query->query_vars['magic'] = true;
// $query->query_vars['custom_year'] = $_GET['y'];
// $query->query_vars['custom_category'] = $_GET['c'];
// $query->query_vars['winner'] = $_GET['w'];
// $query->query_vars['s'] = $_GET['search'];
// global $query;
// relevanssi_do_query($query);

?>
<? 
$i = 0;
$sectionTitles = [
	'Fotos',
	'Karikaturen',
	'Serien'
];
foreach($sections as $section):
?>

<section class="section">
  <div class="container">
    
			<h2><? echo $sectionTitles[$i]; ?></h2>
			
			<? if ($sectionTitles[$i] == 'Serien') {
				echo '<div class="is-hidden">';
				$series = true;
			} else {
				echo '<div class="columns is-multiline '.strtolower($sectionTitles[$i]).'">';
				$series = false;
			}?>
			
        
			<?
			$lastlastname = '';
			$seriesId = '';
			
			if($section->have_posts()): while($section->have_posts()) : $section->the_post();
			
				$imageid = get_field('imageid');
				$year = get_field('year');
				$name = ucwords(get_field('vorname'))." ".ucwords(get_field('nachname'));
				$lastname = get_field('nachname');
				$category = strtolower(get_field('category'));
				$caption = get_field('caption');
				$location = get_field('location');
				$date = get_field('date');
				$series_name = get_field('series_name');
				$postId = get_the_ID();
				
				// $img = get_entry_src($year, $imageid, false);
				// $thumb = get_entry_src($year, $imageid, true);
				$img = getImage($postId);
				$thumb = getImage($postId, 'medium');				
				
			
				if ($category == 'serie' && $lastlastname !== $lastname) {
					echo '</div>';
					echo '<h3>'.$name.'</h3>';
					echo '<h4>'.$series_name.'</h4>';
					echo '<div class="series-button">';
					echo '<button class="button is-small vote-open">Auswählen</button>';	
					?>
					<div class="vote-box is-hidden">
						<p>Bitte geben Sie Ihre E-Mail-Adresse ein, um Ihre Abstimmung zu bestätigen.</p>
						<input class="input email" type="email" placeholder="Deine E-Mail"><br/>
						<button class="button is-small is-primary vote" data-vote="<? echo $voteId; ?>" data-category="<? echo $category; ?>">Auswählen</button>
					</div>
					<?
					echo '</div>';
					
					echo '<div class="columns is-multiline serien">';
					$lastlastname = $lastname;
					$seriesId = $postId;
				} 
				
				if ($category == 'serie') {
					$voteId = $seriesId;
				} else {
					// not series
					$voteId = $postId;
				}
				
				$colW = 'is-4';
				if ($series) $colW = 'is-3';
				echo '<div class="entry column '.$colW.'">';
					echo '<div class="inner">';
						echo '<a class="zoom-img" href="#zoom" data-zoom="'.$img.'">';
							echo "<div class='thumb responsive'>";
								echo '<div class="inner" style="background-image: url('.$thumb.')"></div>';
							echo "</div>";
							// echo '<img src="'.$thumb.'" class="thumb zoom" />';
						
						echo '</a>';
					
						echo '<div class="meta">';
						
						if ($category !== 'serie') {
							echo "<strong>".$name."</strong>";	
						}
						if ($caption) echo '<div class="caption">'.$caption.'</div>';
						if ($location) {
							if ($date) $d = ', '.$date;
							else $d = '';
							echo '<div class="location">'.$location.$d.'</div>';
						}
						echo '</div>'; // meta
						
						// echo '<button class="button is-small vote-open">Auswählen '.$postId.'</button>';
						if ($category !== 'serie') {
							echo '<button class="button is-small vote-open">Auswählen</button>';	
							?>
							<div class="vote-box is-hidden">
								<p>Bitte geben Sie Ihre E-Mail-Adresse ein, um Ihre Abstimmung zu bestätigen.</p>
								<input class="input email" type="email" placeholder="Deine E-Mail"><br/>
								<button class="button is-small is-primary vote" data-vote="<? echo $voteId; ?>" data-category="<? echo $category; ?>">Auswählen</button>
							</div>
							<?
						}
					echo '</div>'; // inner
				echo '</div>'; // column
			
			endwhile; endif; ?>
				
		<? if (!$series) {
			echo '</div> <!-- columns -->';
		} ?>
		
		
	</div>  <!-- container -->
</section>

<? 
$i++;
endforeach; 
?>

<div class="modal zoom">
  <div class="modal-background"></div>
  <div class="modal-content">
  </div>
  <button class="modal-close zoom is-large" aria-label="close"></button>
</div>

<!-- <div class="modal vote">
  <div class="modal-background"></div>
  <div class="modal-content">
		FORM
		<button class="button is-small is-primary vote">Vote</button>
  </div>
  <button class="modal-close vote is-large" aria-label="close"></button>
</div> -->


<script type='text/javascript'>
function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

// zoom
$('.zoom-img').on('click', function (e) {
	var img = $(this).data('zoom');
	var image = "<img src='"+img+"'/>";
	var meta = $(this).closest('.entry').find('.meta').clone();
	$('.modal.zoom .modal-content').html(image).append(meta);
	$('.modal.zoom').addClass('is-active');
	e.preventDefault();
});

// vote
$('button.vote-open').on('click', function(e){
	console.log('vote');
	// $('.modal.vote').addClass('is-active');
	$(this).addClass('is-hidden')
	$(this).next().removeClass('is-hidden');
});

$('button.vote').on('click', function(e){
	var email = $(this).parent().find('.email').val();
	var vote = $(this).data('vote');
	var category = $(this).data('category');
	if (!isEmail(email)) {
		alert('Bitte geben Sie eine gültige E-Mail-Adresse ein!');
	} else {
		// alert('Vote for ' + vote + " " + category);
		var votingURL = '/vote/?vote='+vote+'&email='+email+'&category='+category;
		// var win = window.open(votingURL, '_blank');
		// win.focus();
		window.location.href = votingURL;
	}
});

</script>

<style>
.sticky-wrapper {
	z-index: 2 !important;
}
h2 {
  font-size: 1.4em;
  color: #ab002c;
	margin-bottom: 2rem;
	padding-bottom: 1rem;
	border-bottom: 2px #ab002c solid;
}
h3 {
	font-weight: bold;
}
.series-button {
	width: 300px;
	margin-bottom: 2rem;
}
.caption {
	margin-top: 0.5rem;
	font-size: 0.9rem;
}
.location {
	margin-top: 0.5rem;
	font-size: 0.8rem;
	opacity: 0.66;
}
.entry {
	margin-bottom: 2rem;
}
.serien .entry {
	margin-bottom: 0;
}
.serien {
	margin-bottom: 3rem !important;
}
h1 {
	font-size: 2rem;
	font-weight: bold;
}
.modal-content {
	padding: 2rem;
	border-radius: 1rem;
	background: white;
}
.modal-card, .modal-content {
	width: auto;
	max-width: 90vw;
}
.modal-content img {
	max-height: 75vh;
	
}
.button {
	font-weight: bold;
	margin-top: 1rem;
}
.button.is-primary {
	background: #ab002c;
}
.button.is-primary:hover {
	background: #bb103c;
}
.vote-box {
	margin-top: 1rem;
	font-size: 0.9rem;
	background: #e5e5e5;
	padding: 1em;
	border-radius: 0.5rem;
}
input {
	margin-top: 1rem;
}
.thumb {
	position: relative; padding-bottom: 66.67%; height: 0; overflow: hidden; max-width: 100%; 
	margin-bottom: .7rem;
} 
.thumb .inner { 
	position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
	/* background-color: #e5e5e5; */
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
}
</style>

<? get_footer(); ?>
