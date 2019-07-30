<!DOCTYPE Html>
<html>
	<head>
		<meta charset="UTF-8">
	</head>
	<body>
	<?php
	if(isset($_POST["test"])){
		echo $_POST["name"]."<br>";
		echo $_POST["mail"];
	}
	else { ?>
		<form name="test" action="form_experiment1.php" method="post">
			<input type="text" id="name" name="name">
			<input type="text" id="mail" name="mail">
			<input type="submit" id="test" name="test" value="RVK K&ouml;ln!">
		</form>
	<?php } ?>
	</body>
</html>