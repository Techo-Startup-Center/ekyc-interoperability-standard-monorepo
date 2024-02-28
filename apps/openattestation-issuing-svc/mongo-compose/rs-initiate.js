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

rs.initiate();