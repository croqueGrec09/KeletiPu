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
	require_once('debug/XMLTester.php');
});
//define config params
$config['displayErrorDetails'] = true;
$config['addContentLengthHeader'] = false;

//create app
$app = new \Slim\App(["settings" => $config]);
//container for dependencies and global registers
$container = $app->getContainer();

//global parameters
$container['xmlTester'] = function ($container) {
	$xmlTester = new XMLTester();
	return $xmlTester;
};

//request handling section
$app->get('/', function (Request $request, Response $response) {
	try {
		$document = new DOMDocument();
		$document->load('questList.xml');
		$xpath = new DOMXPath($document);
		$document->schemaValidate('questData.xsd');
		$body = $response->getBody();
		$body->write(print_r($xpath->query("//quest[@id='qzd1']/parent::*")->item(0)->nodeName,true));
		return $response;
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

$app->get('/emptyElementReplacalTest', function (Request $request, Response $response) {
	try {
		return $response->withJson($this->xmlTester->emptyElemReplacalTest());
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