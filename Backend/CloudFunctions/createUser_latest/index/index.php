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

function getEmptyUsers($conn,$dob){

    $ymd = explode("-", $dob);
    if ($ymd[0]=='1955') {
        $sql = 'SELECT users.*
        FROM `users`
        LEFT JOIN attend AS att ON users.uid = att.user_uid
        WHERE att.user_uid IS NULL LIMIT 100';
    } else {
        $sql = 'SELECT users.*
        FROM `users`
        LEFT JOIN attend AS att ON users.uid = att.user_uid
        WHERE att.user_uid IS NOT NULL LIMIT 100';
    }

    
    $sth = $conn->prepare($sql, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
    $sth->execute();
    $sth -> setFetchMode(PDO::FETCH_ASSOC);
    $all = $sth->fetchAll();
    shuffle($all);

    return $all[0];
}

function getUser($conn,$dob,$fn,$mn,$ln) {
    $sql = 'SELECT u.*, ml_u.osm_adr, ml_u.district from `users` as u
        left join `ml_users` AS ml_u ON ml_u.userid = u.uid 
        WHERE u.f_name = :f_name AND u.m_name = :m_name AND u.l_name = :l_name AND u.birth_date = :dob';
    
    $result = $conn->query($sql,['f_name'=>$fn, 'm_name'=>$mn, 'l_name'=>$ln, 'dob'=>$dob]);
    
    return $result;
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
        $error = 'Event not found!';
        $logg->info($error);
        return output($result,$error);
    }

    if (!isset($event->body)) {
        $error = 'Event->body not found!';
        $logg->info($error);
        return output($result,$error);
    }
        
    $query_body = json_decode(base64_decode($event->body));
    if (json_last_error_msg()!='No error'){
        $error = "JOSN Syntax Error!";
        $result = '';
        return output($result,$error);
    }

    if (
        !isset($query_body->f_name) || 
        !isset($query_body->m_name) || 
        !isset($query_body->l_name) || 
        !isset($query_body->dob)
    ){
        $error = "Error in body params!";
        $result = '';
        return output($result,$error);
    }

    $dob_matched = preg_match("/^([\d]{4}-[\d]{2}-[\d]{2})$$/", $query_body->dob, $dob_matches);
    if ($dob_matched==false) {
        $error = ":dob is broken! Need (YYYY-MM-DD)";
        $result = '';
        return output($result,$error);
    }

    
    $opt_f_name = filter_string_polyfill($query_body->f_name);
    $opt_m_name = filter_string_polyfill($query_body->m_name);
    $opt_l_name = filter_string_polyfill($query_body->l_name);

    $conn = dbConnect($host,$port,$dbnm,$user,$pass);
    if ($conn['error']!=false) {
        $error = 'Can not connect to DB!'."\n".$conn['message'];
        $logg->info($error);
        return output($result,$error);
    }

    $result = getUser($conn['conn'],$dob_matches[1], $opt_f_name, $opt_m_name, $opt_l_name);

    //$result = getEmptyUsers($conn['conn'],$dob_matches[1]);

    return output($result,$error);

}