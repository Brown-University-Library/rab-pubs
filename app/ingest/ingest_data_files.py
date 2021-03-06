"https://pymotw.com/2/sqlite3/"

import sys
import csv
import os
import sqlite3

def writeSql(tableName, columnList):
	sql_template = """
				insert into {0}
				({1})
				values ({2})
				"""
	cStr = ",".join(columnList)
	qStr = ",".join(["?" for c in columnList])
	return sql_template.format(tableName, cStr, qStr)

def updateTable(cursor, tDict):
	with open(tDict["file"], 'rt') as csv_file:
		csv_reader = csv.reader(csv_file)
		seeds = [ tuple(row) for row in csv_reader ]
	sql = writeSql(tDict['table'],tDict['columns'])
	cursor.executemany(sql, seeds)

def main(dbDir, loadDir):
	db_filename = os.path.join(dbDir,'rabpubs.db')
	tables = {
		"users": {
			"file": os.path.join(loadDir,"users.csv"),
			"table": "users",
			"columns": ["rabid","short_id"]
		},
		"harvest_exids": {
			"file": os.path.join(loadDir,"hrv_exids.csv"),
			"table": "harvest_exids",
			"columns": ["exid","event_id","user_rabid","source_rabid", "status"]
		}
	} 

	with sqlite3.connect(db_filename) as conn:
			print 'DELETING DATA'

			cursor = conn.cursor()
			delete_script = """
							DELETE FROM {0}
							"""
			for tDict in tables.values():
				cursor.execute(delete_script.format(tDict['table']))
			cursor.execute("VACUUM")

			print "Seeding database"

			for tDict in tables.values():
				updateTable(cursor, tDict)

if __name__ == "__main__":
	main(sys.argv[1], sys.argv[2])