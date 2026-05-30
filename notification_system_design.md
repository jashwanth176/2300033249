**Stage 1:**

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

**Stage 2:**

I would recommand going with a NoSQL database such as MongoDB, because we are dealing with a very high volume of data, as notifications are created by various departments at once so we have a huge write volume. And we also have thousands of students reading and updating the status of the notifications, NoSQL are good at such data where we have high write volume. 

We also have a flexible schema in MySQL which allows us to store various types of data in different formats, like different departments might have different requiements.

NoSQL is already used in a lot of social media which deal with high volume data so I would pick NoSQL database (MongoDB)

Rough Schema:

`Notification` collection:

```json
{
    "_id" : "Unique ID",
    "type" : "String",
    "title" : "String",
    "message" : "String",
    "createdAt" : "Date and Time",
}
```

`UserNotify` Collection:

```json
{
    "_id":"UniqueID",
    "userID":"String",
    "notificationId":"Ref",
    "isRead":"Boolean",
    "readAt":"Date",
    "createdAt": "Date"
}
```

Here even if we want to send notifications to thousends of students, still only one entry is created in the nofications collection and its reference is stored in the UserNotify collection, which will save a lot of disk space.


**Stage 3:**

If the database has no index then it has to go through the large chunks of data, in this case 5 million rows which is taking a long time and casuing the statement to fail, even if studentId was indexed, we are still performing a sort based on the created date which is also an expensive operation. This casues a massive bottleneck cause the statemenet to fail. To fix this we need to index the data rows based on the create by value in the first place, this is called a composite index.

Based on the existing data schema, the query to fetch the data of all students who recived a notification from placement department in the last 7 days will be:

SELECT * FROM notifications
WHERE notification_type = "Placement"
AND created_at >= CURRENT_DATA - INTERVEL '5 days';

**Stage 4**

Fetching the notifications from the database everytime is time consuming and will overload the database. We can do something like using a in memory cache using Redis which can store the user's unread notification count and their most recent few notifications. This is not only reduce the load on the primary database but also make the user experience better with faster load times. Which will help with SEO of the website as well.

Instead of polling for new notifications we can set up a websocket which will maintain a persistent conncetions to the client and update the notifications in real time.

