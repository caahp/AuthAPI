const AWS = require('aws-sdk');
const User = require("../model/user.model");
const docClient = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});


class apiUser{
    async register(req, res) {
        const { email, password, firstName, lastName, about, region, selectedInstrument, instrument, personalSettings } = req.body;

        const params = {
            TableName: "UsersDatabase",
            Item: {
                "email": email,
                "password": password,
                "firstName": firstName,
                "lastName": lastName,
                "about": about,
                "region": region,
                "selectedInstrument": selectedInstrument,
                "instrument": instrument,
                "personalSettings": personalSettings
            }
        };

        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add user", email, ". Error JSON:", JSON.stringify(err, null, 2));
                res.status(500).send({ message: "Unable to add user" });
            } else {
                console.log("User created successfully:", email);
                res.status(201).send({ message: "User created successfully" });
            }
        });
    }

}