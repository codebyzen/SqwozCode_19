import pandas as pd

from sqlalchemy import create_engine
import pymysql
from src.config import config_object

class mrn:

	df_users = None
	df_att = None
	df_groups_april = None

	def init(self, uid_real):
		# На вход можно подать реальный user_id
		# Работает долго, тк нужно открывать файлы, на запросах должен быстрее

		config = config_object()
		sqlEngine = create_engine(config.mysql_str(), pool_recycle=3600)
		dbConnection = sqlEngine.connect()
		

		self.df_users = pd.read_sql("select * from ml_users WHERE userid = "+str(uid_real), dbConnection)
		# self.df_users = pd.read_csv('../db/users_PROD.csv')

		df_user = self.df_users[['district', 'active_day_part', 'geocluster']]
		# df_user = self.df_users[self.df_users['userid'] == uid_real][['district', 'active_day_part', 'geocluster']]
		district = list(df_user['district'])[0]

		self.df_groups_april = pd.read_sql("select * from ml_groups_april WHERE district = '"+district+"'", dbConnection)
		# self.df_groups_april = pd.read_csv('../db/groups_april.csv')
		gid_list = list(self.df_groups_april['groupid'])
		# gid_list = list(self.df_groups_april[self.df_groups_april['district'] == district]['groupid'])

		
		z = []
		for i in gid_list:
			z.append('group_uid = '+str(i))

		
		sql = "select * from groups_top WHERE " + " OR ".join(z) + " ORDER BY count DESC"
		self.ff = pd.read_sql(sql, dbConnection)
		print(self.ff)


		self.df_att = pd.read_sql("select * from ml_attend WHERE uid = "+str(uid_real), dbConnection)
		
		# self.df_att = pd.read_csv('../db/attend_PROD.csv')



		user_been_gid_list = list(set(self.df_att['gid']))
		print(user_been_gid_list)

		print( str( len(set(user_been_gid_list).intersection(set(self.ff))) ) )
		# print(self.df_att['gid'])
		# user_been_gid_list = list(set(self.df_att[self.df_att['uid'] == uid_real]['gid']))

		# district_top100_groups = list(self.df_att[self.df_att['gid'].isin(gid_list)].groupby('gid')['uid'].count().reset_index(name='count').sort_values(['count'], ascending=False)['gid'].head(100))

		reclist = []

		for g in self.ff['group_uid']:
			if g not in user_been_gid_list:
				reclist.append(g)
			if len(reclist) == 10:
				break

		# dbConnection.close()

		return reclist