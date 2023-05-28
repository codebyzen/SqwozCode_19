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

function getUserByID($conn,$uid) {
    $sql = "SELECT u.*, ml_u.osm_adr, ml_u.district from `users` as u
        left join `ml_users` AS ml_u ON ml_u.userid = u.uid WHERE uid = :uid";
    
    $result = $conn->query($sql, ['uid' => $uid]);

    if ($result===false) {
        $sql = "SELECT u.*, ml_u.osm_adr, ml_u.district from `users` as u
        left join `ml_users` AS ml_u ON ml_u.userid = u.uid 
        ORDER BY RAND()
        LIMIT 1";
        $result = $conn->query($sql, ['uid' => $uid]);
    }

    return $result;
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
        isset($event->queryStringParameters->uid)
    ) {
        
        $uid = filter_var($event->queryStringParameters->uid, FILTER_VALIDATE_INT);    
        if ($uid===NULL || $uid===false) {
            $result = '';
            $error = 'UID error';
            $statusCode = 400;
        } else {
            $conn = dbConnect($host,$port,$dbnm,$user,$pass);
            if ($conn['error']==false) {
                $result = getUserByID($conn['conn'], $uid);
                if (count($result)==0) {
                    $statusCode = 404;
                    $error = 'UID Not Found';
                } else {
                    $statusCode = 200;
                }
            } else {
                $logg = $context->getLogger();
                $error = 'Can not connect to DB!'."\n".$conn['message'];
                $logg->info($result);
                $statusCode = 500;
            }
        }
    } else {
        $error = 'No UID in Event!';
        $statusCode = 400;
    }



    //$body = json_decode(base64_decode($event->body));
    $uid = $event->queryStringParameters->uid;

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