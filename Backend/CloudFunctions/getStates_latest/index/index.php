<?php


include('db.php');

function dbConnect($host,$port,$dbnm,$user,$pass){

    $conn = new db($host, $port, $dbnm, $user, $pass);

    return ["error"=>false,"conn"=>$conn,"message"=>null];

}

function getState($conn,$search) {
    $sql = "SELECT state FROM `groups` WHERE `state` LIKE :search GROUP BY `state`";
    return $conn->query($sql, ['search' => "%".$search."%"]);
}

function filter_string_polyfill(string $string): string {
	$str = $string;
	$str = urldecode($str);
	$str = html_entity_decode($str);
	$str = preg_replace('/\x00|<[^>]*>?/', '', $str);
	// $str = str_replace(["'", '"'], ['&#39;', '&#34;'], $str);
	return $str;
}

function post_parse_state($val, $search) {
    $splitted = explode(",",$val);
    $splitted = array_map(function($item) { return trim(str_replace("муниципальный округ","",$item)); }, $splitted);
    
    foreach($splitted as $k=>$v) {
        if (mb_stripos($v,$search)!==false) {
            return $v;
        }
    }
}


function handler($event, $context) {
    $host = $context -> getUserData('host');                                            //get host of mysql
    $dbnm = $context -> getUserData('dbnm');                                        //get database of mysql
    $user = $context -> getUserData('user');                                        //get username of mysql
    $pass = $context -> getUserData('pass');                                        //get password of mysql
    $port = $context -> getUserData('port');                                            //get port of mysql
    
    $statusCode = 200;
    $error = '';

    if (
        isset($event)
        &&
        isset($event->queryStringParameters)
        &&
        isset($event->queryStringParameters->search)
    ) {
        
        $search = filter_var($event->queryStringParameters->search, FILTER_UNSAFE_RAW);    
        $search = filter_string_polyfill($search);
        if ($search==NULL || $search===false) {
            $result = '';
            $error = 'SEARCH error';
            $statusCode = 400;
        } else {
            $conn = dbConnect($host,$port,$dbnm,$user,$pass);
            if ($conn['error']==false) {
                $result = getState($conn['conn'], $search);
                if (count($result)==0) {
                    $statusCode = 404;
                    $error = 'SEARCH Not Found';
                } else {
                    $statusCode = 200;
                }

                $states_all = [];
                foreach($result as $k=>$v) {
                    $states_all[] = post_parse_state($v->state,$search);
                }
                $states_all = array_unique($states_all);
                sort($states_all);
                $result = $states_all;
                

            } else {
                $logg = $context->getLogger();
                $error = 'Can not connect to DB!'."\n".$conn['message'];
                $logg->info($result);
                $statusCode = 500;
            }
        }
    } else {
        $error = 'No SEARCH in Event!';
        $statusCode = 400;
    }

    $output = array(
        "statusCode" => $statusCode,
        "headers" => array(
            "Content-Type" => "application/json",
        ),
        "isBase64Encoded" => false,
        "body" => json_encode(
            [
                'message'=>$result,
                'error'=>$error
            ],
            JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
        ),
    );

    return $output;
}