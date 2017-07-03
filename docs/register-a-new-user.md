[Home](index.md)

# Register a new user

Used for anonymous registration of a new user with default role assignment. If SMTP is configured, it will send a confirmation e-mail to the new user. Upon clicking the registration link, the users `confirmed` date will be set. When not confirmed, it will be `null`.

### URL

	/users/register

### Method

`POST`
  
### URL Params

None.

### Data Params

```javascript
{
    email: String,
    password: String,
    firstname: String | undefined,
    lastname: String | undefined,
    fullname: String | undefined, // Either firstname + lastname OR fullname, do not combine.
    data: Object | undefined
}
```

### Success response

#### `200 OK`

Successful creation of user.

Result format:

```javascript
{
    _id: String,
    email: String,
    roles: [
        { role: String, scope: String }
    ],
    confirmed: Date | null,
    updated: Date | null,
    created: Date,
    fullname: String,
    id: String
}
```

Example:

```javascript
{
    "success": true,
    "code": 200,
    "result": {
        "_id": "594a4b7774af5c8254efe4c1",
        "email": "name2@domain.com",
        "roles": [
            {
                "role": "admin",
                "scope": "users/594a4b7774af5c8254efe4c1"
            },
            {
                "role": "member",
                "scope": "users/594a4b7774af5c8254efe4c1"
            }
        ],
        "confirmed": null,
        "updated": null,
        "created": "2017-06-21T10:33:27.378Z",
        "fullname": "",
        "id": "594a4b7774af5c8254efe4c1"
    }
}
```

### Error responses

#### `400 BAD REQUEST`

Malformed request.

#### `409 CONFLICT`

The username was already taken.

Example:

```javascript
{
    "success": false,
    "code": 409,
    "result": null,
    "error": "User already exists."
}
```


#### `422 UNPROCESSABLE ENTITY`

A validation error occured.

Format:

```javascript
{
    type: "validation",
    errors: [{
        field: String,
        type: String,
        message: String
    }]
}
```

Example:

```javascript
{
    "type": "validation",
    "errors": [{
        "field": "password",
        "type": "required",
        "message": "Path `password` is required."
    }]
}
```

### Sample Call

#### curl

```sh
curl -X POST \
  http://localhost:3000/register \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
  "email": "name@domain.com",
  "password": "password"
}'
```
#### javascript

```js
axios
    .post(`https://api.service.com/users/`, { email: "name@domain.com", password: "password" })
    .then(response => {
        if (response.success) {
            const username = response.result.username;
        }
    });
```

### Notes

**21-06-2017 (parkov@bitkompagniet.dk)**

Please note that an unconfirmed user can still login. We want to make this configurable. [#72](https://github.com/bitkompagniet/mugs/issues/72)