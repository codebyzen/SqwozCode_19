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

function getPopular($conn, $opt_search, $opt_online, $opt_limit, $opt_offset, $opt_dow, $opt_cluster_id, $opt_preset,$opt_type) {
    
    $dbg = '';

    $opt_offset = intval($opt_offset);
    $opt_limit = intval($opt_limit);

    $sql = "SELECT DISTINCT g.uid, d.type, g.type1,g.type2, g.type3, gt.picture, d.d_level1, dc.cluster as clusterId, g.schedule_active, g.schedule_closed, g.schedule_normal
    FROM groups_top as gt 
    LEFT JOIN `groups` AS g ON g.uid = gt.group_uid 
    LEFT JOIN `dict` AS d ON d.level1 = g.type1 AND d.level2 = g.type2 AND d.level3 = g.type3 
    LEFT JOIN `dict_clusters` AS dc ON dc.dir3 = g.type3
    %where% 
    ORDER BY gt.count DESC LIMIT ".$opt_offset.", ".$opt_limit.";";
    
    $where = [];

    if ($opt_preset!==null) {
        $where[] = "(d.type = '".$opt_preset."')";
    }

    if ($opt_search!=null && !empty($opt_search)) {
        $where[] = " 
        (g.type1 LIKE '%".$opt_search."%' OR 
        g.type2 LIKE '%".$opt_search."%' OR 
        g.type3 LIKE '%".$opt_search."%' OR 
        d.d_level1 LIKE '%".$opt_search."%')";
    }

    if ($opt_online==true) {
        $where[] = "(g.type2 LIKE '%ОНЛАЙН%' OR g.type3 LIKE '%ОНЛАЙН%')";
    }
    if ($opt_online===false) {
        $where[] = "(g.type2 NOT LIKE '%ОНЛАЙН%' OR g.type3 NOT LIKE '%ОНЛАЙН%')";
    }

	if ($opt_cluster_id!==null) {
        $where_clusters = [];
        foreach($opt_cluster_id as $cidk=>$cidv) {
		    $where_clusters[] = "dc.cluster = ".intval($cidv);
        }
        $where[] = "(".implode(" OR ",$where_clusters).")";
	}
	
    if ($opt_type!=null) {
        $dict_types = ['mind'=>'Для ума','soul'=>'Для души','health'=>'Для тела'];
        $where[] = "(d.type = '".$dict_types[$opt_type]."')";
    }

	if ($opt_dow!=null) {
        $where_dow = [];
        foreach($opt_dow as $dowk=>$dowv) {
		    $where_dow[] = "(g.schedule_active LIKE '%".$dowv."%' OR g.schedule_closed LIKE '%".$dowv."%'  OR g.schedule_normal LIKE '%".$dowv."%' )";
        }
        $where[] = "(".implode(" OR ",$where_dow).")";
	}

    if (count($where)>0) {
        $sql = str_replace("%where%", " WHERE ".implode(" AND ",$where), $sql);
    } else {
        $sql = str_replace("%where%", '', $sql);
    }

    $result = $conn->query($sql,[]);

    foreach ($result as $k=>$v) {
        if (mb_strpos($v->type2, "ОНЛАЙН")!==false) {
            $result[$k]->online = true;
        } else {
            $result[$k]->online = false;
        }
    }

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
    	$event->queryStringParameters = new stdClass();
        $event->queryStringParameters->opt_preset = null;
        $event->queryStringParameters->opt_search = null;
        $event->queryStringParameters->opt_online = null;
        $event->queryStringParameters->opt_limit = 100;
        $event->queryStringParameters->opt_offset = 0;
    }

    $type = ['soul'=>'Для души','health'=>'Для тела','mind'=>'Для ума', 'popular'=>null];
    if (isset($event->queryStringParameters->preset)) {
        if (in_array($event->queryStringParameters->preset, ['popular','health','mind','soul'])) {
            $opt_preset = $type[$event->queryStringParameters->preset];
        } else {
            $opt_preset = null;
        }
    } else {
        $opt_preset = null;
    }

    if (isset($event->queryStringParameters->search)) {
        $opt_search = filter_string_polyfill($event->queryStringParameters->search);
        $opt_search = empty($opt_search) ? null : $opt_search;
    } else {
        $opt_search = null;
    }

    if (isset($event->queryStringParameters->online)) {
        $opt_online = filter_var($event->queryStringParameters->online, FILTER_VALIDATE_BOOLEAN);
    } else {
        $opt_online = false;
    }

    if (isset($event->queryStringParameters->limit)) {
        $opt_limit = filter_var($event->queryStringParameters->limit, FILTER_VALIDATE_INT);
        $opt_limit = ($opt_limit==false || $opt_limit==null) ? 50 : $opt_limit;
    } else {
        $opt_limit = 50;
    }

    if (isset($event->queryStringParameters->offset)) {
        $opt_offset = filter_var($event->queryStringParameters->offset, FILTER_VALIDATE_INT);
        $opt_offset = ($opt_offset==false || $opt_offset==null) ? 0 : $opt_offset;
    } else {
        $opt_offset = 0;
    }

    if (isset($event->queryStringParameters->type)) {
        $opt_type = $event->queryStringParameters->type;
        if ($opt_type!=null && $opt_type!=false && !empty($opt_type)) {
            if (!in_array($opt_type,['mind','soul','health'])) {
                $opt_type = null;
            }
        }
    } else {
        $opt_type = 0;
    }
    
	if (isset($event->queryStringParameters->clusterIds)) {
        $opt_cluster_id = $event->queryStringParameters->clusterIds;
        if ($opt_cluster_id!=null && $opt_cluster_id!==false) {
            $opt_cluster_id = filter_string_polyfill($opt_cluster_id);
            $opt_cluster_id = explode(",",$opt_cluster_id);
        } else {
            $opt_cluster_id = null;
        }
    } else {
        $opt_cluster_id = null;
    }
    
    $dow = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
    if (isset($event->queryStringParameters->dayOfWeek)) {
        $opt_dow = $event->queryStringParameters->dayOfWeek;
        $opt_dow = explode(",",$opt_dow);
        foreach($opt_dow as $dowk=>$dowv) {
            if (intval($dowv)>7 || intval($dowv)<1) {
                unset($opt_dow[$dowk]);
            } else {
                $opt_dow[$dowk] = $dow[$dowv-1];
            }
        }
        if (count($opt_dow)==0) $opt_dow = null;
    } else {
        $opt_dow = null;
    }

    $conn = dbConnect($host,$port,$dbnm,$user,$pass);
    if ($conn['error']!==false) {
        $error='Can not connect to DB!'."\n".$conn['message'];
        $logg->info($error);
        return output($result, $error);
    }



    // preset? | popular, health, mind, soul, popular ['soul'=>'Для души','health'=>'Для тела','mind'=>'Для ума', 'popular'=>null]
    // search? | string
    // online? | boolean
    // limit? | integer
    // offset? | integer
    // dayOfWeek? | integer
    // clusterId? | integer

    
    $result = getPopular($conn['conn'], $opt_search, $opt_online, $opt_limit, $opt_offset, $opt_dow, $opt_cluster_id, $opt_preset,$opt_type);
    
    if (count($result[0])==0) {
        $error = 'No categories found';
        return output($result[0], $error, ['preset-popular','event'=>$event->queryStringParameters, "sql"=>$result[1]]);
    }
    
    return output($result[0], $error, ['preset'=>$opt_preset, 'event'=>$event->queryStringParameters, 'sql'=>$result[1]]);
}