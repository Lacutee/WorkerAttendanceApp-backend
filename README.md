# WorkerAttendanceApp-backend
## Introduction
This API were used for the [Employee Attendance web](https://employee-attendance-project.vercel.app/). There are in total 12 services that seperate into auth related service, user CRUD related services, and Attendance CRUD related services.

## Overview
This API were hosted on vercel. Actually before using [vercel](https://vercel.com/), this API has been deploy using CD enviroment at Amazon EC2 service as you can see at this repository.

The tech stack were used:
- MongoDB
- Nodejs (express, jwt)
- AWS EC2, Load Balancer

## Authentication
The Authentication proccess using jwt token which the playload contain ``` { sub: 1, role: "Admin/User"} ```  The Token will return as http respond.

### Login (POST)
- APIUrl:
  ```https://worker-attendance-app-backend.vercel.app/home/login```
- Headers
  <strong>Content-Type:</strong> application/json
- Body RAW
  ```
    {
    "username":"bruno",
    "password":"bruno"
    }
  ```
- Response
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTVlOTZiMWUxOTg1NDAwMTY0ZDVlY2YiLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE2NDAwNzUxOTh9.lAX9uE4VyhkSX8E57QMXxERMUwVcBy0wKDh_zlyO9ck
  ```
