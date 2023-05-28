<?php

class db {
	public $dbh;
	private $config;

	function __construct($host, $port, $dbnm, $user, $pass) {
		$this->config = ['host'=>$host, 'port'=>$port, 'dbnm'=>$dbnm, 'user'=>$user, 'pass'=>$pass];
		$this->connect();
	}

	// функция соединения с БД
	function connect() {

        try {
            $this->dbh = new PDO("mysql:host=".$this->config['host'].";port=".$this->config['port'].";dbname=".$this->config['dbnm'], $this->config['user'], $this->config['pass']);      //connect to MYSQL
        } catch (PDOException $e) {
            return ["error"=>true,"conn"=>null,"message"=>"ErrorMessage: " . $e -> getMessage()];
        }
    
        $this->dbh->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, false);

	}

	function uncomment_query($query) {
		$sql_regex = '@
		    (([\'"]).*?[^\\\]\2) # $1 : Skip single & double quoted expressions
		    |(                   # $3 : Match comments
		        (?:\#|--).*?$    # - Single line comments
		        |                # - Multi line (nested) comments
		         /\*             #   . comment open marker
		            (?: [^/*]    #   . non comment-marker characters
		                |/(?!\*) #   . ! not a comment open
		                |\*(?!/) #   . ! not a comment close
		                |(?R)    #   . recursive case
		            )*           #   . repeat eventually
		        \*\/             #   . comment close marker
		    )\s*                 # Trim after comments
		    |(?<=;)\s+           # Trim after semi-colon
		    @msx';
		$clear_query = trim( preg_replace( $sql_regex, '$1', $query ) );
		preg_match_all( $sql_regex, $query, $comments );
		$comments = array_filter( $comments[ 3 ] );
		//d( $clear_query, $comments );
		return $clear_query;
	}

	function parse_query($q) {
		$q = str_replace(["\n","\r","\t"], [" "," "," "], $q);
		$q = preg_replace("/\/\*.*\*\//Uis",'',$q);
		$q = preg_replace("/\s+/is",' ',$q);
		$q = trim($q);
		$type = explode(" ",$q);
		$type = trim(mb_strtoupper($type[0],"UTF-8"));
		return $type;
	}
	
	// "SELECT * FROM :table", [":table"=>$table], return as array or as object
	function query($query,$params=[],$array=false) {
		
		$clear_query = $this->uncomment_query($query);
		$type = $this->parse_query($clear_query);
		
		if ($this->dbh==NULL) {
			echo $query;
			throw new \Exception('DB LINK ERROR!', 0);
		}

		try {
			$sth = $this->dbh->prepare($clear_query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
			
			foreach ($params as $param_key=>&$param_value) { // & need to pdo, pdo need value by reference!
				if (is_array($param_value)) {
					$param_item = &$param_value[0];
					$param_type = $param_value[1];
				} else {
					$param_item = &$param_value;
					if (is_float($param_item)) {
						$param_type = PDO::PARAM_STR;
					} elseif (is_numeric($param_item)) {
						$param_type = PDO::PARAM_INT;
					} elseif (is_bool($param_item)) {
						$param_type = PDO::PARAM_BOOL;
					} else {
						$param_type =  PDO::PARAM_STR;
					}
				}
				$sth->bindParam($param_key, $param_item, $param_type);
			}
			
			$sth->execute();
			$error = $sth->errorInfo();
			if ($error[0]!='0000') {
				throw new \Exception($error[2]."\n".$query, 0);
			}
		} catch(PDOException $e) {
			throw new \Exception($e -> getMessage()."\n".$query, 0);
		}
		if (in_array($type,array('SELECT', 'SHOW'))) {
			if ($array==true) {
				$sth->setFetchMode(\PDO::FETCH_ASSOC);
			} else {
				$sth->setFetchMode(\PDO::FETCH_OBJ);
			}
			while($row = $sth->fetch()) {
				$res[]=$row;
			}
			if (isset($res) && ($res==NULL || $res==false || !isset($res[0]) || $res[0]==false)) { $res = false; }
		} elseif(in_array($type,array('INSERT'))) {
			$res=$this->dbh->lastInsertId();
		}
		return (isset($res)) ? $res : false;
	}



}

?>