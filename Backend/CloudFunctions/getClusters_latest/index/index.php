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

function getClusters($conn, $opt_clusterId, $offset=0, $limit=100) {
    $sql = "SELECT dc.cluster as clusterId, dc.name, d.type FROM `dict_clusters` AS dc 
LEFT JOIN `dict` AS d ON d.level3 = dc.dir3 
%where%
GROUP BY dc.name 
ORDER BY dc.cluster
LIMIT :offset, :limit;";
    
    $where = [];

	if ($opt_clusterId!==null) {
		$where[] = "(cluster = ".$opt_clusterId.")";
	}

    if ($offset===null) { $offset = 0; }
    if ($limit===null) { $limit = 100; }
	
    if (count($where)>0) {
        $sql = str_replace("%where%", " WHERE ".implode(" AND ",$where), $sql);
    } else {
        $sql = str_replace("%where%", '', $sql);
    }

    $result = $conn->query($sql,[':offset'=>$offset,':limit'=>$limit]);
    
    $result = array_map(function($value){ 
        $types = ['Для души'=>'soul','Для тела'=>'health','Для ума'=>'mind'];
        $value->type = $types[$value->type]; 
        return $value; 
    }, $result);

    return $result;

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
    	$event->queryStringParameters = new stdClass();
        $event->queryStringParameters->clusterId = null;
    }

    if (isset($event->queryStringParameters->clusterId)) {
        $opt_clusterId = filter_var($event->queryStringParameters->clusterId, FILTER_VALIDATE_INT);
    } else {
        $opt_clusterId = null;
    }

    if (isset($event->queryStringParameters->offset)) {
        $opt_offset = filter_var($event->queryStringParameters->offset, FILTER_VALIDATE_INT);
    } else {
        $opt_offset = null;
    }

    if (isset($event->queryStringParameters->limit)) {
        $opt_limit = filter_var($event->queryStringParameters->limit, FILTER_VALIDATE_INT);
    } else {
        $opt_limit = null;
    }

    $conn = dbConnect($host,$port,$dbnm,$user,$pass);
    if ($conn['error']!==false) {
        $error='Can not connect to DB!'."\n".$conn['message'];
        $logg->info($error);
        return output($result, $error);
    }


    $result = getClusters($conn['conn'], $opt_clusterId, $opt_offset, $opt_limit);
    if (count($result)==0) {
        $error = 'No clusters found';
        return output($result, $error);
    }

    
    return output($result, $error);
}