# Uria notes

-   control the URLs schema
-   pass the fetch method
-   I would really like to use Custom Adapters I've built:

    -   it will allow package-users to work with custom data structures
    -   it will allow package-users to add missing functionalities to adapters

Interesting terms & tools:

-   thrashing
-   mac: Digital color meter

const fetchMethod = fetch('http://localhost:3000/api/user');

useQuery({
fetch: fetchMethod
})

// control the query params

React query
const result = useQuery({
fetchMethod:...,
retriesCount: 4
});

useMemo(() => {
console.log(result.currentRetryId)
}, [
result
])

React query

-   start by defined a `useQuery` hook
-   pass a function that returns a promise
-   I will deal with:
    -   caching
    -   retries
    -   request state
    -   response data / status code
-   You will memo and act according to state

Convention over configuraiton
We don't deal with network calls, we get a dum async fetch method.

Adapters
