<?php

date_default_timezone_set("UTC");

$mysqli = null;
function get_mysqli_object()
{
	global $mysqli;
	if (isset($mysqli) && $mysqli != null)
	{
		mysqli_ping($mysqli);
		return $mysqli;
	}
	else
	{
		global $config;
		$mysqli = new mysqli("localhost", "root", "", "graphics_practical");

		if ($mysqli->connect_errno)
		{
			die("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
		}

		return $mysqli;
	}
}

function get_all_scores()
{
	$query = get_mysqli_object()->prepare("SELECT * FROM `highscores` ORDER BY `time` ASC");
	$query->execute();

	return $query->get_result()->fetch_all(MYSQLI_ASSOC);
}

function get_highscore()
{
	$query = get_mysqli_object()->prepare("SELECT * FROM `highscores` ORDER BY `time` ASC");
	$query->execute();

	$scores = $query->get_result()->fetch_all(MYSQLI_ASSOC);
	if (sizeof($scores) == 0)
		return "null";
	else
		return $scores[0];
}

function get_user_highscore($user)
{
	$query = get_mysqli_object()->prepare("SELECT * FROM `highscores` WHERE `user` = ? ORDER BY `time` ASC");
	$query->bind_param("s", $user);
	$query->execute();

	$scores = $query->get_result()->fetch_all(MYSQLI_ASSOC);
	if (sizeof($scores) == 0)
		return "null";
	else
		return $scores[0];
}

?>