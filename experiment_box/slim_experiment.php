<?php
error_reporting(E_ALL);
ini_set("display_errors", true);
date_default_timezone_set('Europe/Berlin');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';
spl_autoload_register(function($classname) {
	require_once('Class1.php');
	require_once('Class2.php');
});

$config['displayErrorDetails'] = true;
$config['addContentLengthHeader'] = false;

$app = new \Slim\App(["settings" => $config]);
$container = $app->getContainer();

$app->get('/', function (Request $request, Response $response) {
	$class1 = new Class1();
	return $response->withJson($class1->method1());
});

$app->run();
?>