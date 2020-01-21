<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Rueckblende 2018</title>
		<style>
			html, body {
				height: 100vh;
				width: 100vw;
				overflow: hidden;
				background-color: rgb(235,235,235)
			}
			body {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
			}
			img {
				width: 400px;
				height: auto;
			}
			h1 {
				font-family: 'Arial';
				font-size: 30px;
				margin-bottom: 2em;
			}
			#logotop {
				position: fixed;
				top: 3rem;
				left: 3rem;
				width: 250px;
				height: auto;
			}
			@font-face{src:url(/wp-content/themes/rueckblende/build/assets/fonts/Bliss2L.otf);font-family:B;font-weight:300}
			@font-face{src:url(/wp-content/themes/rueckblende/build/assets/fonts/Bliss2R.otf);font-family:B;font-weight:400}
			@font-face{src:url(/wp-content/themes/rueckblende/build/assets/fonts/Bliss2M.otf);font-family:B;font-weight:500}
			@font-face{src:url(/wp-content/themes/rueckblende/build/assets/fonts/Bliss2B.otf);font-family:B;font-weight:700}
			body{font-family:B;font-weight:400; font-size: 18px;line-height: 2em; text-align: center;}
			.text {
				margin-top: 2em;
			}
		</style>
	</head>
	<body>

		<!-- <img src="https://rueckblende.rlp.de/wp-content/uploads/2018/01/logo_subline.svg" /> -->
		<img src="https://rueckblende.rlp.de/wp-content/themes/rueckblende/build/assets/img/logo_subline_2019.svg" id="logotop" />
		<img src="http://165.227.164.168/wp-content/uploads/2018/03/soon_here@2x.png" style="width: 150px; height: auto;">
		<div class='text'>
		Die neue Rückblende <? echo date('Y') - 1; ?> steht kurz bevor —<br/>
		nach der Preisverleihung am 27. Januar <? echo date('Y'); ?><br/>
		finden Sie hier ab 21 Uhr die neuen Webseiten.
		</div>
	</body>
</html>
