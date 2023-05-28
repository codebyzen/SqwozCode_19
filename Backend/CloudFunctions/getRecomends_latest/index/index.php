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
    	$result=''; $error='No queryStringParameters';
        $logg->info($error);
        return output($result, $error);
    }

    if (isset($event->queryStringParameters->ml)) {
        $opt_type = $event->queryStringParameters->ml;
        if ($opt_type!=null && $opt_type!=false && !empty($opt_type)) {
            if (!in_array($opt_type,['mrg','mrs','mrn'])) {
                $opt_type = null;
            }
        }
    } else {
        $result=''; $error='No ML type';
        $logg->info($error);
        return output($result, $error);
    }
    
	if (isset($event->queryStringParameters->id)) {
        $opt_id = filter_var($event->queryStringParameters->id, FILTER_VALIDATE_INT);
        if ($opt_id===false || $opt_id===null) {
            $result=''; $error='No ID';
            $logg->info($error);
            return output($result, $error);
        }
    } else {
        $result=''; $error='No ID';
        $logg->info($error);
        return output($result, $error);
    }

    $ecs = "http://192.168.0.164/api?ml=".$opt_type."&id=".$opt_id;

    $result_raw = file_get_contents($ecs);

    if ($result_raw==false) {
        $error='Can not recomend';
        $logg->info($error);
        return output($result, $error);
    }
    $result_raw = json_decode(json_decode($result_raw));

    $conn = dbConnect($host,$port,$dbnm,$user,$pass);
    if ($conn['error']!==false) {
        $error='Can not connect to DB!'."\n".$conn['message'];
        $logg->info($error);
        return output($result, $error);
    }

    $where_uid = [];
    foreach ($result_raw as $k=>$v) {
        $where_uid[] = "(g.uid = ".$v.")";
    }
    $where_sql = implode(" OR ",$where_uid);
    
    
    $sql = "SELECT DISTINCT g.uid, d.type, g.type1,g.type2, g.type3, gt.picture, d.d_level1, dc.cluster as clusterId, g.schedule_active, g.schedule_closed, g.schedule_normal
    FROM groups_top as gt 
    LEFT JOIN `groups` AS g ON g.uid = gt.group_uid 
    LEFT JOIN `dict` AS d ON d.level1 = g.type1 AND d.level2 = g.type2 AND d.level3 = g.type3 
    LEFT JOIN `dict_clusters` AS dc ON dc.dir3 = g.type3
    WHERE ".$where_sql."
    ORDER BY gt.count DESC;";
    
    

    $result = $conn['conn']->query($sql);
    foreach($result as $k=>$v) {
        if (mb_strpos($v->type2,"ОНЛАЙН")!==false || mb_strpos($v->type3,"ОНЛАЙН")!==false) {
            $result[$k]->online = true;
        } else {
            $result[$k]->online = false;
        }
    }

    $output = output($result,$error,[]);

    return $output;
}