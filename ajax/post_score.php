<?php

include "func.php";

$user = $_GET["user"];
$newScore = intval($_GET["time"]);

$oldScore = get_user_highscore($user);
if ($oldScore == "null" || $newScore < $oldScore)
{
	$query = get_mysqli_object()->prepare("DELETE FROM `highscores` WHERE `user` = ?");
	$query->bind_param("s", $user);
	$query->execute();

	$query = get_mysqli_object()->prepare("INSERT INTO `highscores` (`user`, `time`) VALUES (?, ?)");
	$query->bind_param("si", $user, $newScore);
	$query->execute();
}
