<?php
/*function initializer($context) {
	$output = 'hello Initializer';
    return $output;
}*/	

include('db.php');

function dbConnect($host,$port,$dbnm,$user,$pass){

    $conn = new db($host, $port, $dbnm, $user, $pass);

    return ["error"=>false,"conn"=>$conn,"message"=>null];

}

function saveSurvey($conn, $opt_user_id, $opt_cluster_id) {
    
    $dbg = '';

    $sql = "INSERT INTO `surveyresults` VALUES(NULL, ".intval($opt_user_id).", ".intval($opt_cluster_id).");";
    
    $result = $conn->query($sql,[]);

    return [$result, [$sql,$opt_cluster_id]];

}

function output($message, $error, $debug=[]) {
    $output = array(
        "statusCode" => 200,
        "headers" => array(
            "Content-Type" => "application/json",
        ),
        "isBase64Encoded" => false,
        "body" => json_encode(
            [
                'message'=>$message,
                'error'=>$error,
                'debug'=>$debug
            ],
            JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
        ),
    );
    return $output;
}

function filter_string_polyfill(string $string): string
{
	$str = $string;
	$str = urldecode($str);
	$str = html_entity_decode($str);
	$str = preg_replace('/\x00|<[^>]*>?/', '', $str);
	// $str = str_replace(["'", '"'], ['&#39;', '&#34;'], $str);
	return trim($str);
}

function handler($event, $context) {
    $host = $context -> getUserData('host');                                            //get host of mysql
    $dbnm = $context -> getUserData('dbnm');                                        //get database of mysql
    $user = $context -> getUserData('user');                                        //get username of mysql
    $pass = $context -> getUserData('pass');                                        //get password of mysql
    $port = $context -> getUserData('port');                                            //get port of mysql
    
    $logg = $context->getLogger();

    $error = '';
    $result = '';

    if (!isset($event)) {
        $error='No Event';
        $logg->info($error);
        return output($result, $error);
    }

    if (!isset($event->queryStringParameters)) {
    	$error='No queryStringParameters';
        $logg->info($error);
        return output($result, $error);
    }

    
    if (isset($event->queryStringParameters->userId)) {
        $opt_user_id = filter_var($event->queryStringParameters->userId, FILTER_VALIDATE_INT);
        if ($opt_user_id==NULL || $opt_user_id==false) {
            $error='userId corrupt';
            $logg->info($error);
            return output($result, $error);
        }
    } else {
        $error='No userId';
        $logg->info($error);
        return output($result, $error);
    }

    if (isset($event->queryStringParameters->clusterId)) {
        $opt_cluster_id = filter_var($event->queryStringParameters->clusterId, FILTER_VALIDATE_INT);
        if ($opt_cluster_id===NULL) {
            $error='clusterId corrupt';
            $logg->info($error);
            return output($result, $error);
        }
    } else {
        $error='No clusterId';
        $logg->info($error);
        return output($result, $error);
    }

    $conn = dbConnect($host,$port,$dbnm,$user,$pass);
    if ($conn['error']!==false) {
        $error='Can not connect to DB!'."\n".$conn['message'];
        $logg->info($error);
        return output($result, $error);
    }

    $result = saveSurvey($conn['conn'], $opt_user_id, $opt_cluster_id);
    
    return output($result[0], $error, ['event'=>$event->queryStringParameters, 'sql'=>$result[1]]);
}