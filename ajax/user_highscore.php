<?php

include "func.php";

echo get_user_highscore($_GET["user"])["time"];
