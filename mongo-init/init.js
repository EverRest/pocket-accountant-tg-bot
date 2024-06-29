db = db.getSiblingDB('admin');
db.createUser({
    user: "root",
    pwd: "password",
    roles: [ "root" ]
});