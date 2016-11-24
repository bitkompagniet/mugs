# User model

```javascript
{
	"id": MongoId,
	"email": String,
	"fullname": String,
	"password": String,
	"created": Date,
	"updated": Date,
	"confirmationToken": MongoId,
	"confirmed": Date,
	"resetPasswordToken": MongoId,
	"roles": [{ role: String, group: String }],
	"data": {},
}
```

# Internal roles

- owner@*: change user rights for users in any group
- owner@publishers: change user rights for users in group
- admin@publishers: edit users in group, add or remove users from group
- member@publishers: view users in group

# Endpoints

## `POST` /register

Create a new user.

## `GET` /register/:confirmationToken

Confirm a registration by the token assigned at user creation.

#### Response codes	

| Code             | Meaning                      |
|------------------|------------------------------|
| 200 OK           | Registration confirmed.      |
| 400 BAD REQUEST  | The token did not exist.     |

## `POST` /login

Authenticate a user.

#### Post body

```javascript
{
	"email": "parkov@bitkompagniet.dk",
	"password": "hattefar"
}
```

#### Response codes

| Code             | Meaning                      |
|------------------|------------------------------|
| 200 OK           | Login was successful.        |
| 400 BAD REQUEST  | The post payload had errors. |
| 401 UNAUTORIZED  | Bad credentials.             |

#### Response body

```javascript
{
	"success": true,
	"code": 200,
	"result": {
		"token": "aaaaaaaaaa.bbbbbbbbbbb.cccccccccccc",
		"user": User	
	}
}
```

## `GET` /verify/:token

Takes a token and tests the validity of that token. When a token is valid, it returns a refreshed token. If the token is invalid, it returns a failure. The refresh token should always be generated from a fresh db query.

#### Response codes

| Code             | Meaning                      |
|------------------|------------------------------|
| 200 OK           | Registration confirmed.      |
| 401 UNAUTHORIZED | The token did not exist.     |


#### Response body (success)

```javascript
{
	"success": true,
	"code": 200,
	"result": {
		"refresh": "aaaaaaaaaa.bbbbbbbbbbb.cccccccccccc"
	}
}
```

## `GET` /recover/:email

Send a password recovery e-mail. Will **apparently** succeed, even if the e-mail is wrong. This is to prevent that valid e-mails can be sniffed.

#### Response codes

| Code             | Meaning                        |
|------------------|--------------------------------|
| 200 OK           | E-mail sent.                   |
| 400 BAD REQUEST  | E-mail was malformatted.       |

## `POST` /recover

Reset the password using a valid token.

#### Post body

```javascript
{
	"token": "5821da2b485176b31b68c34e",
	"password": "somepass",
	"passwordRepeat": "somepass"
}
```

#### Response codes

| Code             | Meaning                      |
|------------------|------------------------------|
| 200 OK           | Password reset.              |
| 400 BAD REQUEST  | The post body was invalid.   |
| 403 FORBIDDEN    | The reset token was invalid. |
| 409 CONFLICT     | The passwords did not match. |

## `GET` /

Lists all users.

### Available to roles

- user-manager

### Query

| Parameter   | Meaning                                        |
|-------------|------------------------------------------------|
| sortby      | Column name of the parameter to sort by.       |
| limit       | Max number of results to return.               |
| skip        | Number of items to skip.                       |
| roles       | Comma-separated string of roles to filter by.  | 
| groups      | Comma-separated string of groups to filter by. | 

### Headers

| Header         | Meaning                                 |
|----------------|-----------------------------------------|
| Authorization  | Required. Authorization token           |

### Response codes

| Code             | Meaning                      |
|------------------|------------------------------|
| 200 OK           | Login was successful.        |
| 400 BAD REQUEST  | The query params had errors. |

### Response body

```javascript
[
	{ 
		"id": "5821cf4050e962afbc56d43c", 
		"email": "parkov@bitkompagniet.dk", 
		"fullname": "Kristian Videmark Parkov", 
		groups: ["super-admin", "user-manager"] 
	},
	...
]
```


## `GET` /:id

Get a specific user.

```javascript
{
	"success": true,
	"code": 200,
	"result": {
		"id": "5821cf4050e962afbc56d43c",
		"email": "parkov@bitkompagniet.dk",
		"fullname": "Kristian Videmark Parkov",
		"created": "2016-11-08T13:23:01.324Z",
		"updated": "2016-11-08T13:23:01.324Z",
		"confirmed": "2016-11-08T13:27:05.543Z",
		"roles": ["super-admin", "user-manager"],
		"groups": ["Administrators", "Users"],
		"data": {
			"my": "custom data"
		}
	}
}
```