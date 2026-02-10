# Token Lifecycle Documentation

## Token Types

### Access Token
- Short-lived token for API access
- Default expiration: 15 minutes
- Contains user claims and permissions
- Stateless validation

### Refresh Token
- Long-lived token for obtaining new access tokens
- Default expiration: 7 days
- Stored securely
- Can be revoked

## Token Lifecycle

### Generation
1. User authenticates successfully
2. System generates access token
3. System generates refresh token
4. Tokens stored in database
5. Tokens returned to client

### Validation
1. Client sends token in request
2. System validates token signature
3. System checks token expiration
4. System verifies token claims
5. Request processed or denied

### Refresh
1. Access token expires
2. Client sends refresh token
3. System validates refresh token
4. System generates new tokens
5. Old refresh token invalidated
6. New tokens returned

### Revocation
1. User logs out
2. System invalidates tokens
3. Tokens added to blacklist
4. Tokens removed from storage

## Token Structure

### Access Token (JWT)
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-id",
    "email": "user@example.com",
    "roles": ["user"],
    "permissions": ["read:own"],
    "iat": 1234567890,
    "exp": 1234567890
  },
  "signature": "..."
}
```

### Refresh Token
- Random UUID
- Stored in database
- Linked to user and device
- Can be revoked

## Security Considerations

### Token Storage
- **Access Token**: Client-side (memory or secure storage)
- **Refresh Token**: Secure storage (httpOnly cookie recommended)

### Token Rotation
- Refresh tokens rotated on use
- Old tokens invalidated
- Prevents token reuse

### Token Blacklist
- Revoked tokens added to blacklist
- Blacklist checked on validation
- Blacklist cleaned periodically

## Best Practices

1. **Short Expiration** - Keep access token expiration short
2. **Secure Storage** - Store tokens securely
3. **Token Rotation** - Rotate refresh tokens
4. **Blacklist** - Maintain token blacklist
5. **HTTPS Only** - Use HTTPS for token transmission


