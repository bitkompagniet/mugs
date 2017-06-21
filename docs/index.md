# Mugs documentation

## User model

```javascript
{
	"id": MongoId,
	"email": String,
	"firstname": String,
	"lastname": String,
	"fullname": String,
	"password": String,
	"created": Date,
	"updated": Date,
	"confirmationToken": MongoId,
	"confirmed": Date,
	"resetPasswordToken": MongoId,
	"roles": [{ role: String, scope: String }],
	"data": {},
}
```

## Permission model / roles

_TBA_.

## REST API

### Base response format

All endpoints wrap responses in a standard format:

```javascript
{
    success: Boolean,
    code: Number,
    // will be defined if success === true
    result: Object | Array | null | undefined,
    // will be defined if success === false  
    error: Object | String | undefined          
}
```

### Success

Success result is not required, but the definition of the key `result` in the response object is, **if `success === true`**. Results should be either an object, an array or null (thereby conforming to JSON in itself).

### List of endpoints

- [Register a new user](register-a-new-user.md)
