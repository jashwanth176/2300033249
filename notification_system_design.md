Stage 1:

API Design:

Core actions:
1. Fetch notifications
2. Marking them as read
3. Marking all as read

API Contracts:

1. Fetch User Notifications:

URL : `/api/v1/notifications`
Method: `GET`
Headers: `Authorization: Bearer <User_Token>`
Parameters:
    `status` : `all` | `only_unread` (Optional, default `all`)
    `page` : For pagination () (Optional)
    `limit` : For pagination (Optional)
Response (200):
```json
{
    "success":true,
    "data": {
        "unread":1,
        "notifications": [
            {
                "id": "abc",
                "type": "placement",
                "title":"Coding Contest",
                "message":"Attend the coding contest today",
                "isRead" : false,
                "createdAt": "ISO Format Time"
            }
        ]
    }
}
```

2. Mark as read:

URL : `/api/v1/notifications/:id/read`
Method: `PATCH`
Headers: `Authorization: Bearer <User_Token>`
Parameters: Nothing required
Response (200):
```json
{
    "success":true,
    "message": "Notification marked as read." 
}
```
2. Mark all as read:

URL : `/api/v1/notifications/read-all`
Method: `PATCH`
Headers: `Authorization: Bearer <User_Token>`
Parameters: Nothing required
Response (200):
```json
{
    "success":true,
    "message": "All notification marked as read." 
}
```

Stage 2:

