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

function getActivity($conn, $opt_id) {
    
    $dbg = '';

    $sql = "SELECT DISTINCT g.uid, d.type, g.type1,g.type2, g.type3, gt.picture, d.d_level1, dc.cluster as clusterId, g.schedule_active, g.schedule_closed, g.schedule_normal
    FROM groups_top as gt 
    LEFT JOIN `groups` AS g ON g.uid = gt.group_uid 
    LEFT JOIN `dict` AS d ON d.level1 = g.type1 AND d.level2 = g.type2 AND d.level3 = g.type3 
    LEFT JOIN `dict_clusters` AS dc ON dc.dir3 = g.type3
    WHERE g.uid = ".intval($opt_id).";";
    
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
        $result=''; $error='No Event';
        $logg->info($error);
        return output($result, $error);
    }

    if (!isset($event->queryStringParameters)) {
    	$error='No queryStringParameters';
        $logg->info($error);
        return output($result, $error);
    }

    if (isset($event->queryStringParameters->id)) {
        $opt_id = filter_var($event->queryStringParameters->id, FILTER_VALIDATE_INT);
        if ($opt_id === false || $opt_id == null) {
            $error='Incorrect ID';
            $logg->info($error);
            return output($result, $error);
        }
    } else {
        $error='ID not found!';
        $logg->info($error);
        return output($result, $error);
    }

    $conn = dbConnect($host,$port,$dbnm,$user,$pass);
    if ($conn['error']!==false) {
        $error='Can not connect to DB!'."\n".$conn['message'];
        $logg->info($error);
        return output($result, $error);
    }
    
    $result = getActivity($conn['conn'], $opt_id);
    
    if (count($result[0])==0) {
        $error = 'No categories found';
        return output($result[0], $error, ['preset-popular','event'=>$event->queryStringParameters, "sql"=>$result[1]]);
    }
    
    return output($result[0], $error, ['preset'=>$opt_preset, 'event'=>$event->queryStringParameters, 'sql'=>$result[1]]);
}