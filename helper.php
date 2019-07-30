<?php
/*
	Keleti pályaudvar - the game
	server side controller for debug and test area
	
	version 0.7 from 0th May 2018
	author: András Gálffy, andrisgalffy@gmail.com, matricula number: 5584124
*/

//php internal settings
error_reporting(E_ALL);
ini_set("display_errors", true);
date_default_timezone_set('Europe/Berlin');
define("ANALYSISCITY_PATH","analysyscities/");

//register Request/Response interfaces
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

//load classes
require '../vendor/autoload.php';
spl_autoload_register(function($classname) {
	require_once('helper/CoordinatesHelper.php');
	require_once('translator/TranslatorHelper.php');
});
//define config params
$config['displayErrorDetails'] = true;
$config['addContentLengthHeader'] = false;

//create app
$app = new \Slim\App(["settings" => $config]);
//container for dependencies and global registers
$container = $app->getContainer();

//global parameters
$container['coordinatesHelper'] = function ($container) {
	$coordinatesHelper = new CoordinatesHelper();
	return $coordinatesHelper;
};
$container['translationHelper'] = function ($container) {
	$translationHelper = new TranslatorHelper();
	return $translationHelper;
};

//request handling section
$app->post('/enterCoordinates', function (Request $request, Response $response) {
	try {
		$body = $response->getBody();
		$body->write($this->coordinatesHelper->enterCoordinates($request->getParsedBody()));
		return $response;
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

$app->get('/getUnassignedActions/{town}', function(Request $request, Response $response) {
	try {
		return $response->withJson($this->coordinatesHelper->getUnassignedActions($request->getAttribute("town")));
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//translator area
$app->post('/enterTranslation', function (Request $request, Response $response) {
	try {
		$body = $response->getBody();
		$body->write($this->translationHelper->enterTranslation($request->getParsedBody()));
		return $response;
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

$app->get('/getUndoneTranslations', function(Request $request, Response $response) {
	try {
		return $response->withJson($this->translationHelper->getUndoneTranslations());
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

$app->run();

?>