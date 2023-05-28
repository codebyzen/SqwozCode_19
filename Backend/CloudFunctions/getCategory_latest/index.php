<?php
/*function initializer($context) {
	$output = 'hello Initializer';
    return $output;
}*/	

function dbConnect($host,$port,$dbnm,$user,$pass){

    try {
        $conn = new PDO("mysql:host=$host;port=$port;dbname=$dbnm", $user, $pass);      //connect to MYSQL
    } catch (PDOException $e) {
        return ["error"=>true,"conn"=>null,"message"=>"ErrorMessage: " . $e -> getMessage()];
    }

    $conn->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, false);

    return ["error"=>false,"conn"=>$conn,"message"=>null];

    // $unbufferedResult = $conn->query("SELECT * FROM users LIMIT 1");
    // $results = '';
    // foreach ($unbufferedResult as $row) {
    //     $results .= $row['uid'] . PHP_EOL;
    // }
    // return $results;
}

function getDictByIDs($conn,$levelid=[], $online) {
    if ($online==true) {
        $where_online = 'level2 LIKE "%онлайн%"';
    } elseif ($online==false) {
        $where_online = 'level2 NOT LIKE "%онлайн%"';
    } else {
        $where_online = null;
    }

    switch (count($levelid)) {
    case 1:
        $where = "WHERE ".implode(" AND ",array_filter(['id_level1 = :l1id', $where_online]));
        $sql = "SELECT type, id_level1, level1, id_level2, level2 FROM dict ".$where." GROUP BY id_level2";
        $params = ["l1id"=>$levelid[0]];
        break;
    case 2:
        $where = "WHERE ".implode(" AND ",array_filter(['id_level1 = :l1id', 'id_level2 = :l2id', $where_online]));
        $sql = "SELECT * FROM dict ".$where;
        $params = ["l1id"=>$levelid[0],"l2id"=>$levelid[1]];
        break;
    case 3:
        $where = "WHERE ".implode(" AND ",array_filter(['id_level1 = :l1id', 'id_level2 = :l2id', 'id_level3 = :l3id', $where_online]));
        $sql = "SELECT * FROM dict ".$where;
        $params = ["l1id"=>$levelid[0],"l2id"=>$levelid[1],"l3id"=>$levelid[2]];
        break;
    default:
        $where = $where_online != null ? ' WHERE '.$where_online : '';

        $sql = "select type, 0 as parent_id, id_level1 as id, level1 as name  from `dict` ".$where." GROUP BY id_level1 ORDER BY type";
        $params = null;
        break;
    }

    $sth = $conn->prepare($sql, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
    $sth->execute($params);

    $sth -> setFetchMode(PDO::FETCH_ASSOC);
    return $sth->fetchAll();
}

function handler($event, $context) {
    $host = $context -> getUserData('host');                                            //get host of mysql
    $dbnm = $context -> getUserData('dbnm');                                        //get database of mysql
    $user = $context -> getUserData('user');                                        //get username of mysql
    $pass = $context -> getUserData('pass');                                        //get password of mysql
    $port = $context -> getUserData('port');                                            //get port of mysql

    

    if (
        isset($event)
    ) {

        if (isset($event->queryStringParameters) && isset($event->queryStringParameters->parentIds)) {
            $pid = filter_var($event->queryStringParameters->parentIds, FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^([0-9,]+)$/")));
            if ($pid==NULL || $pid===false) {
                $pid = "";
            } 
        } else {
            $pid = "";
        }


        if (isset($event->queryStringParameters) && isset($event->queryStringParameters->online)) {
            $online = filter_var($event->queryStringParameters->online, FILTER_VALIDATE_BOOLEAN);
        } else {
            $online=null;
        }
        
        $conn = dbConnect($host,$port,$dbnm,$user,$pass);
        if ($conn['error']==false) {
            $pids = explode(",",trim($pid,","));
            if (empty($pids[0])) $pids = [];
            $result = getDictByIDs($conn['conn'], $pids, $online);
            $statusCode = 200;
        } else {
            $logg = $context->getLogger();
            $result = 'Can not connect to DB!'."\n".$conn['message'];
            $logg->info($result);
            $statusCode = 500;
        }

    } else {
        $statusCode = 400;
        $result = 'No parentIds in Event!';
    }


    // $output = array(
    //     "statusCode" => 200,
    //     "headers" => array(
    //         "Content-Type" => "application/json",
    //     ),
    //     "isBase64Encoded" => false,
    //     "body" => json_encode(
    //         [
    //             'event'=>$event,
    //             'message'=>$result
    //         ],
    //         JSON_UNESCAPED_UNICODE
    //     ),
    // );

    $output = array(
        "statusCode" => $statusCode,
        "headers" => array(
            "Content-Type" => "application/json",
        ),
        "isBase64Encoded" => false,
        "body" => json_encode(
            [
                'message'=>$result
            ],
            JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
        ),
    );

    return $output;
}