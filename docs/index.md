# Mugs documentation

## Endpoints

- [Register a new user](register-a-new-user.md)

## Base response format

All endpoints wrap responses in a standard format:

```javascript
{
    success: Boolean,
    code: Number,
    result: Object | Array | null | undefined,  // will be defined if success === true
    error: Object | String | undefined          // will be defined if success === false
}
```

## Success

Success result is not required, but the definition of the key `result` in the response object is, **if `success === true`**. Results should be either an object, an array or null (thereby conforming to JSON in itself).