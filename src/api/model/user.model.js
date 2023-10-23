const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();
const dynamodb = new AWS.DynamoDB.DocumentClient();

const userSchema = {
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: false
    },
    region: {
        type: String,
        required: true
    },
    selectedInstrument:{
        type: String, //TODO: change to class Instrument
        required: true
    },
    instrument: {
        type: [],
        required: true
    },
    personalSettings: {
        type: String, //TODO: change to class personalSettings
    }
};

const createUser = async (email, password, firstName, lastName, about, region, selectedInstrument, instrument, personalSettings) => {
    const params = {
        UserPoolId: 'YOUR_USER_POOL_ID',
        Username: email,
        MessageAction: 'SUPPRESS',
        TemporaryPassword: password,
        UserAttributes: [
            {
                Name: 'email',
                Value: email
            },
            {
                Name: 'password',
                Value: password
            },
            {
                Name: 'firstName',
                Value: firstName
            },
            {
                Name: 'lastName',
                Value: lastName
            },
            {
                Name: 'about',
                Value: about
            },
            {
                Name: 'region',
                Value: region
            },
            {
                Name: 'selectedInstrument',
                Value: selectedInstrument
            },
            {
                Name: 'instrument',
                Value: instrument
            },
            {
                Name: 'personalSettings',
                Value: personalSettings
            }
        ]
    };

    const userItem = {
        email,
        firstName,
        lastName,
        about,
        region,
        selectedInstrument,
        instrument,
        personalSettings
    };

    const userParams = {
        TableName: 'UsersDatabase',
        Item: userItem
    };

    try {
        const data = await cognito.adminCreateUser(params).promise();
        console.log(data);

        await dynamodb.put(userParams).promise();
        console.log('User data stored in DynamoDB');
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    userSchema,
    createUser
};
