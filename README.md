# CS232.SY2017.PRJ1.YABUT-JABONETE
CS 232 Project Repository 1

Note: This is a pre-requisite steps before loading the dataset.

How to setup the Replicate sets

//Installing MongoDB
	//Download from link: https://www.mongodb.com/download-center#enterprise 
	//Extract to location: Desktop <created new folder for it> 
	//Created new folder 'db' inside the mongodb folder on Desktop. 
	//Inside 'db' created another folder /data/db <mkdir /data/db> 
//Open new terminal: run daemon ~> ~/Desktop/mongodb/bin/mongod 
//Open new terminal: run shell ~> ~/Desktop/mongodb/bin/mongo 

1. [CONFIG SERVER] + [RS0]
[Open [1.0] terminal]: //from ~/desktop/mongodb/bin 
$./mongod --port 27017 --configsvr --dbpath ~/desktop/mongodb/bin/db0 --replSet rs0 
// --port = port number 
// --configsvr = dictates as config server 
// --dbpath = dedicated folder location 
// --replSet = replica set name / tag 
[Open [1.1] tab]: //from [[1.0] terminal]
$./mongo --port 27017 
// -- new terminal to access the config server 

>rs.initiate({
		_id: "rs0", configsvr: true, members: 
		[{ _id: 0, host: "localhost:27017"}]
	})
> rs.conf() 
// -- verified setup 
> db.isMaster() 
// -- verified if "isMaster: true" 
[Open [1.2] tab]: //from [[1] terminal]
> ./mongod --port 27018 --configsvr --dbpath ~/desktop/mongodb/bin/db1 --replSet rs0 
[Open [1.3] tab]: 
> ./mongod --port 27019 --configsvr --dbpath ~/desktop/mongodb/bin/db2 --replSet rs0 
[Open [1.4] tab]: 
> ./mongod --port 27020 --configsvr --dbpath ~/desktop/mongodb/bin/db3 --replSet rs0 
[Open [1.5] tab]: 
> ./mongod --port 27021 --configsvr --dbpath ~/desktop/mongodb/bin/db4 --replSet rs0 
[Go back to [1.0] tab]
> rs.add("localhost:27018")
> rs.add("localhost:27019")
> rs.add("localhost:27020")
> rs.add("localhost:27021")
// {"ok":1} system confirmation x4 
> rs.slaveOk() //x4 on ports 18,19,20 & 21
// -- go back to PRIMARY
> cfg = rs.conf()
> cfg.members[0].priority = 1
> cfg.members[1].priority = 0.5
> cfg.members[2].priority = 0.5
> cfg.members[3].priority = 0.5
> cfg.members[4].priority = 0.5
> rs.reconfig(cfg) 


How to shard the MapReduce collection

2. [SHARD SERVER] + [RS1]
[Open [2.0] terminal]: //from ~/desktop/mongodb/bin 
> ./mongod --port 37017 --shardsvr --dbpath ~/desktop/mongodb/bin/xy0 --replSet rs1 
[Open [2.1] tab]: //from [[2.0] terminal]
> ./mongo --port 37017 
> ./rs.initiate({ 
		_id: "rs1", configsvr: false, members: 
		[{ id: 0, host: "localhost:37017"}]
	})
> rs.conf()
// -- verified setup 
> db.isMaster() 
// -- verified if "isMaster: true"
[Open [2.2] tab]: //from [[2.0] terminal]
> ./mongod --port 37018 --configsvr --dbpath ~/desktop/mongodb/bin/xy1 --replSet rs1 
[Open [2.3] tab]: 
> ./mongod --port 37019 --configsvr --dbpath ~/desktop/mongodb/bin/xy2 --replSet rs1 
[Go back to [2.0] tab]
> rs.add("localhost:37018")
> rs.add("localhost:37019")
// {"ok":1} system confirmation x4 
> rs.slaveOk() //x4 on ports 18 & 19
// -- go back to PRIMARY
> cfg = rs.conf()
> cfg.members[0].priority = 1
> cfg.members[1].priority = 0.5
> cfg.members[2].priority = 0.5
> rs.reconfig(cfg) 

3. [SHARD SERVER] + [RS2]
[Open [3.0] terminal]: //from ~/desktop/mongodb/bin 
> ./mongod --port 47017 --shardsvr --dbpath ~/desktop/mongodb/bin/yz0 --replSet rs2 
[Open [3.1] tab]: //from [[3.0] terminal]
> ./mongo --port 47017 
> ./rs.initiate({ 
		_id: "rs2", configsvr: false, members: 
		[{ id: 0, host: "localhost:47017"}]
	})
> rs.conf()
// -- verified setup 
> db.isMaster() 
// -- verified if "isMaster: true"
[Open [3.2] tab]: //from [[3.0] terminal]
> ./mongod --port 37018 --configsvr --dbpath ~/desktop/mongodb/bin/yz1 --replSet rs2
[Open [3.3] tab]: 
> ./mongod --port 37019 --configsvr --dbpath ~/desktop/mongodb/bin/yz2 --replSet rs2 
[Go back to [3.0] tab]
> rs.add("localhost:47018")
> rs.add("localhost:47019")
// {"ok":1} system confirmation x4 
> rs.slaveOk() //x4 on ports 18 & 19
// -- go back to PRIMARY
> cfg = rs.conf()
> cfg.members[0].priority = 1
> cfg.members[1].priority = 0.5
> cfg.members[2].priority = 0.5
> rs.reconfig(cfg) 

4. [SHARD SERVER] + [RS3]
[Open [4.0] terminal]: //from ~/desktop/mongodb/bin 
> ./mongod --port 57017 --shardsvr --dbpath ~/desktop/mongodb/bin/eb0 --replSet rs3 
[Open [4.1] tab]: //from [[2.0] terminal]
> ./mongo --port 57017 
> ./rs.initiate({ 
		_id: "rs3", configsvr: false, members: 
		[{ id: 0, host: "localhost:57017"}]
	})
> rs.conf()
// -- verified setup 
> db.isMaster() 
// -- verified if "isMaster: true"
[Open [4.2] tab]: //from [[4.0] terminal]
> ./mongod --port 57018 --configsvr --dbpath ~/desktop/mongodb/bin/eb1 --replSet rs3 
[Open [4.3] tab]: 
> ./mongod --port 57019 --configsvr --dbpath ~/desktop/mongodb/bin/eb2 --replSet rs3 
[Go back to [4.0] tab]
> rs.add("localhost:57018")
> rs.add("localhost:57019")
// {"ok":1} system confirmation x4 
> rs.slaveOk() //x4 on ports 18 & 19
// -- go back to PRIMARY
> cfg = rs.conf()
> cfg.members[0].priority = 1
> cfg.members[1].priority = 0.5
> cfg.members[2].priority = 0.5
> rs.reconfig(cfg) 

5. [MONGOS] + [SHARDED CLUSTER] 
[Open [5.0] terminal]: //from ~/desktop/mongodb/bin 
./mongos --port 28000 --configdb rs0/localhost:27017,localhost:27018,localhost:27019,localhost:27020,localhost:27021  
[Open [5.1] tab]: //from [[5.0] terminal]
> ./mongo --port 28000 
// -- add the 3 replica set as shards: 
> sh.addShard("rs1/localhost:37017")
> sh.addShard("rs2/localhost:47017") 
> sh.addShard("rs3/localhost:57017")
// -- system confirmation { ok : 1 }
// -- enable sharding on target DB 
// -- go to target: PRIMARY of all shards and create a DB
// -- also created the collections for target of mapReduce outputs 
> sh.enableSharding("GT") 
// -- GT being the DB name 
// -- you may need to set manually: 
// -- since system assigned the DB to rs1 but I wanted it to be placed on rs3 
// -- because during testing and setup i named all the DB name from the other 
// -- shardsvrs the same
> use admin 
> db.runCommand ({ movePrimary: "your_target_DB_name", to: "your_target_replSet_name"})
// -- System confirmation: "primary" : path { "ok" : 1 } 
// -- start sharding collections: 
> use GT // -- DB name
> sh.shardCollection("GT.mR0",{_id:1}, true)
> sh.shardCollection("GT.mR1",{_id:1}, true)
> sh.shardCollection("GT.mR2",{_id:1}, true)
> sh.shardCollection("GT.mR3",{_id:1}, true)
> sh.shardCollection("GT.mR4",{_id:1}, true)
> sh.shardCollection("GT.mR5",{_id:1}, true)
// -- System confirmation: {"collectionsharded" : "GT.mR0", "ok" : 1}
> db.mR0.createIndex({category:1},{collation:{locale: "en"}})
> db.mR1.createIndex({category:1},{collation:{locale: "en"}})
> db.mR2.createIndex({category:1},{collation:{locale: "en"}})
> db.mR3.createIndex({category:1},{collation:{locale: "en"}})
> db.mR4.createIndex({category:1},{collation:{locale: "en"}})
> db.mR5.createIndex({category:1},{collation:{locale: "en"}})
> db.mR0.getIndexes()
> db.mR1.getIndexes()
> db.mR2.getIndexes()
> db.mR3.getIndexes()
> db.mR4.getIndexes()
> db.mR5.getIndexes()
// -- check sharding status: 
> sh.status() 


How to load the dataset

" To load the dataset, go to the bin folder of the mongodb database program in your computer. 
Since the research was done using a MAC computer, this is how the researchers executed the 
command to import the file in MongoDB: 

~/Desktop/mongodb/bin/mongoimport --db DB_name --collection Collection_Name 
--file filename.json --jsonArray --type json --host rs3/localhost:57017 "

