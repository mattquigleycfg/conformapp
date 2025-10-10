# Dropbox Token Refresh Implementation

## Overview

This implementation adds automatic token refresh functionality to the Dropbox OAuth2 authentication system, significantly reducing the frequency of required logins from every 4 hours to potentially weeks or months.

## Key Changes Made

### 1. Updated Dropbox Utility (`src/utils/dropbox.ts`)

- **Added token refresh functionality**: `refreshAccessToken()` function
- **Added token expiration checking**: `isTokenExpired()` function  
- **Added automatic token validation**: `ensureValidToken()` function
- **Updated all API functions**: Now automatically check and refresh tokens before making API calls
- **Enhanced token storage**: Stores both access and refresh tokens with expiration data

### 2. Updated Authentication Context (`src/contexts/AuthContext.tsx`)

- **Changed OAuth flow**: From implicit flow to authorization code flow for refresh tokens
- **Added automatic token refresh**: On app initialization, checks if tokens are expired and refreshes them
- **Enhanced error handling**: Better error handling for token refresh failures
- **Updated logout**: Now clears both access and refresh token data

### 3. Updated Auth Callback (`src/pages/AuthCallback.tsx`)

- **Support for authorization code flow**: Handles the new OAuth2 authorization code response
- **Backward compatibility**: Still supports the old implicit flow for existing users
- **Enhanced error handling**: Better error handling and user feedback

### 4. Updated Dropbox Auth Hook (`src/hooks/useDropboxAuth.ts`)

- **Consistent with AuthContext**: Updated to use the same token refresh logic
- **Authorization code flow**: Uses the new OAuth2 flow for refresh tokens
- **Enhanced token management**: Better token validation and refresh handling

## How It Works

### Token Refresh Process

1. **On App Start**: Checks if stored tokens are expired
2. **Automatic Refresh**: If expired, automatically refreshes using the refresh token
3. **API Calls**: Before each Dropbox API call, ensures the token is valid
4. **Proactive Refresh**: Refreshes tokens 5 minutes before they expire

### OAuth2 Flow Changes

**Before (Implicit Flow):**
```
User → Dropbox → Access Token (4 hours) → App
```

**After (Authorization Code Flow):**
```
User → Dropbox → Authorization Code → App → Access Token + Refresh Token → App
```

## Benefits

### Login Frequency Reduction

- **Before**: Every 4 hours (Dropbox access token lifetime)
- **After**: Potentially weeks or months (depending on Dropbox's refresh token policy)

### User Experience Improvements

- **Seamless operation**: Users rarely need to log in again
- **Automatic handling**: Token refresh happens in the background
- **Better error handling**: Clear error messages when authentication fails
- **Backward compatibility**: Existing users can still use the app

## Environment Variables Required

Make sure these environment variables are set:

```env
VITE_DROPBOX_APP_KEY=your_dropbox_app_key
VITE_DROPBOX_APP_SECRET=your_dropbox_app_secret  # Now required for token refresh
```

## Testing the Implementation

### 1. Initial Login
1. Clear browser storage (localStorage)
2. Log in to the app
3. Verify that both `dropbox_token` and `dropbox_token_data` are stored

### 2. Token Refresh Testing
1. Manually set token expiration to a past date in localStorage
2. Refresh the page or make a Dropbox API call
3. Verify that the token is automatically refreshed

### 3. Long-term Testing
1. Use the app normally for several days
2. Verify that you don't need to log in again
3. Check browser console for token refresh messages

## Error Handling

The implementation includes comprehensive error handling:

- **Token refresh failures**: Automatically logs out user and redirects to login
- **Invalid tokens**: Clears storage and requires re-authentication
- **Network errors**: Graceful degradation with user feedback
- **Missing environment variables**: Clear error messages during development

## Security Considerations

- **Refresh tokens**: Stored securely in localStorage (same as before)
- **Token expiration**: Proactive refresh prevents expired token usage
- **Automatic cleanup**: Invalid tokens are automatically removed
- **OAuth2 best practices**: Uses authorization code flow for better security

## Migration Notes

### For Existing Users
- First login after deployment will use the new flow
- Existing sessions will continue to work until tokens expire
- No data loss or breaking changes

### For Developers
- All existing Dropbox API calls continue to work unchanged
- New environment variable `VITE_DROPBOX_APP_SECRET` is required
- No changes needed to existing components using Dropbox functionality

## Troubleshooting

### Common Issues

1. **"Missing Dropbox App Secret" error**
   - Ensure `VITE_DROPBOX_APP_SECRET` is set in environment variables

2. **Token refresh fails**
   - Check network connectivity
   - Verify Dropbox app credentials are correct
   - Check browser console for detailed error messages

3. **Still requiring frequent logins**
   - Verify the new OAuth2 flow is being used (check for refresh tokens in localStorage)
   - Check that token refresh is working (look for refresh messages in console)

### Debug Information

Check browser console for these messages:
- `"Token refreshed successfully"` - Token refresh working
- `"Failed to refresh token"` - Token refresh failed
- `"Failed to initialize Dropbox"` - Initial setup failed

## Future Enhancements

Potential improvements that could be added:

1. **Background token refresh**: Refresh tokens in a web worker
2. **Token encryption**: Encrypt tokens in localStorage for additional security
3. **Multiple account support**: Support for multiple Dropbox accounts
4. **Offline mode**: Cache functionality when tokens can't be refreshed
