db.createUser(
        {
            user: "oaAdmin",
            pwd: "root",
            roles: [
                {
                    role: "readWrite",
                    db: "oaDb"
                }
            ]
        }
);

db.createUser({user:"ekycis-demo", pwd:"root",roles:[{role:"readWrite",db:"ekycis-demo-db"}]});