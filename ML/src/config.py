class config_object:
    host = "localhost"
    port = "3306"
    user = "root"
    passw = "root"
    dbnm = "activities"

    def mysql_str(self):
        return 'mysql+pymysql://'+self.user+':'+self.passw+'@'+self.host+':'+self.port+'/'+self.dbnm