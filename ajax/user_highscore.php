<?php

include "func.php";

$userInfo = get_user_highscore($_GET["user"]);

if ($userInfo == "null")
	echo "null";
else
	echo $userInfo["time"];
