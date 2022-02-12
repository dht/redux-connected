1-
/user  
/logs/1  
/products/1  
/chats/1  
/chats/1/items/2

2-
/logs  
/products  
/chats  
/chats/1/items

1. get | set | patch | delete\*
2. get | set | add | pop\*

redux-based, multi data provider approach to state management with a strong devtools suite
tight control over data flows and simple 3rd party API integration to popular vendors

Resources

https://github.com/typeorm/typeorm

supports MySQL / MariaDB / Postgres / CockroachDB / SQLite / Microsoft SQL Server / Oracle / SAP Hana / sql.js
supports MongoDB NoSQL database

## adapters

### client side

-   firestore
-   jsonServer
-   realtimeData
-   rest
-   sockets

### server side

-   fs (server side)
-   fsDirectories (server side)

## Concepts

### Dual stores

-   Main store: actions change the source of truth
-   Connected store: actions handle network requests

## Timelines

### FS adapter

**timeline-001: GET request**

1. incoming request
2. route => action
3. get data (filter, sort, query)
4. response

/\*
SINGLE
get: single_getAction(nodeName, extra),
setAll: single_setAction(nodeName, extra),
patch: single_patchAction(nodeName, extra),

QUEUE
get: queue_getAction(nodeName, extra),
setAll: queue_setAction(nodeName, extra),
push: queue_pushAction(nodeName, extra),
pop: queue_popAction(nodeName, extra),
clear: queue_clearAction(nodeName, extra),
pushMany: queue_pushManyAction(nodeName, extra),

COLLECTION
get: collection_getAction(nodeName, extra),
setAll: collection_setAllAction(nodeName, extra),
set: collection_setAction(nodeName, extra),
add: collection_addAction(nodeName, extra),
patch: collection_patchAction(nodeName, extra),
delete: collection_deleteAction(nodeName, extra),
setMany: collection_setManyAction(nodeName, extra),

GROUPED
get: groupedList_getAction(nodeName, extra),
setAll: groupedList_setAllAction(nodeName, extra),
set: groupedList_setAction(nodeName, extra),
add: groupedList_addAction(nodeName, extra),
patch: groupedList_patchAction(nodeName, extra),
delete: groupedList_deleteAction(nodeName, extra),
setMany: groupedList_setManyAction(nodeName, extra),

getItems: groupedList_getItems(nodeName, extra),
setItems: groupedList_setItems(nodeName, extra),
pushItem: groupedList_pushItem(nodeName, extra),
popItem: groupedList_popItem(nodeName, extra),
clearItems: groupedList_clearItems(nodeName, extra),
pushManyItems: groupedList_pushManyItems(nodeName, extra),
\*/
