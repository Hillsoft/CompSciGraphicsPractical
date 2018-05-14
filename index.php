<?php
include "ajax/func.php";
?>

<html>
	<head>
		<title>Graphics</title>

		<link href="https://fonts.googleapis.com/css?family=Titillium+Web" rel="stylesheet">

		<script src="lib/jquery-1.11.2.min.js"></script>
		<script src="lib/utils.js"></script>

		<!-- Engine -->
		<script src="camera.js"></script>
		<script src="collision.js"></script>
		<script src="input.js"></script>
		<script src="level.js"></script>
		<script src="light.js"></script>
		<script src="main.js"></script>
		<script src="material.js"></script>
		<script src="render.js"></script>
		<script src="scene.js"></script>

		<!-- Game logic -->
		<script src="game/constants.js"></script>
		<script src="game/hud.js"></script>
		<script src="game/level.js"></script>
		<script src="game/ship.js"></script>
		<script src="game/trackManager.js"></script>
		<script src="game/wall.js"></script>
	</head>
	<body style="margin: 0; padding: 0; font-family: 'Titillium Web';">
		<div id="setup" style="width: 100%; text-align: center; vertical-align: middle; padding-top: 200px;">
			Username: <input type="text" id="username" /><br />
			Press a on your controller to start
			<br />
			<br />
			<br />
			<table style="margin-left: auto; margin-right: auto;">
				<tr>
					<td style="text-align: center;">User</td>
					<td style="text-align: center;">Time</td>
					<td style="text-align: center;">Date achieved</td>
				</tr>
				<?php
				$scores = get_all_scores();
				for ($i = 0; $i < sizeof($scores); $i++)
				{
					$mins = floor($scores[$i]["time"] / 60000);
					$secs = str_pad(($scores[$i]["time"] / 1000) % 60, 2, "0", STR_PAD_LEFT);
					$millis = str_pad($scores[$i]["time"] % 1000, 3, "0", STR_PAD_LEFT);
					?>
					<tr>
						<td style="text-align: right; padding-right: 5px;"><?php echo $scores[$i]["user"]; ?></td>
						<td style="padding-left: 5px;"><?php echo $mins . ":" . $secs . "." . $millis; ?></td>
						<td style="padding-left: 15px; padding-right: 15px;"><?php echo substr($scores[$i]["date_set"], 0, 10); ?></td>
					</tr>
					<?php
				}
				?>
			</table>
		</div>
		<div id="display" style="width: 1920px; height: 1080px; display: none;">
			<div style="width: 100%; height: 100%; position: relative;">
				<canvas width="1280" height="720" style="width: 1920px; height: 1080px" id="canvas"></canvas>
				<div id="statsBox" style="position: absolute; right: 20px; top: 20px; background-color: rgba(0.3, 0.3, 0.3, 0.6); color: #fff; padding: 5px; width: 150px;">
					Frame time: <span id="frameTime"></span><br />
					FPS: <span id="fps"></span><br />
					Triangles: <span id="tris"></span><br />
					Lights: <span id="lights"></span><br />
				</div>
				<div id="timingBox" style="position: absolute; left: 20px; top: 20px; background-color: rgba(0.3, 0.3, 0.3, 0.6); color: #fff; padding: 5px; width: 200px;">
					Current Lap: <span id="lapTime"></span><br />
					Checkpoints: <span id="checkpoints"></span><br />
					Session record: <span id="bestLap"></span><br />
					Your record: <span id="userBest"></span><br />
					World record: <span id="worldBest"></span><br />
				</div>
				<div id="speedBox" style="position: absolute; right: 20px; bottom: 20px; background-color: rgba(0.3, 0.3, 0.3, 0.6); color: #fff; padding: 5px; width: 350px; font-size: 5em; text-align: right;">
					<span id="speed"></span>
				</div>
				<div id="controlBox" style="position: absolute; left: 20px; bottom: 20px; background-color: rgba(0.3, 0.3, 0.3, 0.6); color: #fff; padding: 5px; width: 200px;">
					Motion assist: <span id="motionAssist"></span><br />
					Rotation assist: <span id="rotationAssist"></span><br />
				</div>
				<div id="notification" style="position: absolute; left: 25%; top: 20%; background-color: rgba(0.3, 0.3, 0.3, 0.6); color: #fff; padding: 5px; width: 50%; font-size: 5em; text-align: center; display: none;">
					<span id="notificationText"></span>
				</div>
			</div>
		</div>

		<script>
			var highscore = <?php echo get_highscore()["time"]; ?>;
			var highscoreText = highscore == null ? "" : parseTime(highscore);
			var userHighscore = null;
			var userHighscoreText = "";
			var username = "";

			function checkStart()
			{
				var gp = navigator.getGamepads()[0];
				if (typeof(gp) != "undefined" && gp != null && gp.buttons[0].pressed)
				{
					$("#setup").css("display", "none");
					$("#display").css("display", "block");

					username = $("#username").val();
					$.ajax("ajax/user_highscore?user=" + username)
					.done(function(data) {
						if (!isNaN(parseInt(data)))
						{
							userHighscore = parseInt(data);
							userHighscoreText = parseTime(userHighscore);
						}
					});

					graphicsInit("display", "canvas");
				}
				else
				{
					setTimeout(checkStart, 100);
				}
			}

			checkStart();
		</script>
	</body>
</html>