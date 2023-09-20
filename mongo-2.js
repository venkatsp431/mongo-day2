// Insert data into the "users" collection
db.users.insertMany([
  { "_id": 1, "name": "User1" },
  { "_id": 2, "name": "User2" },
  
]);

// Insert data into the "attendance" collection
db.attendance.insertMany([
  { "_id": 101, "user_id": 1, "date": ISODate("2020-10-20"), "status": "Present" },
  { "_id": 102, "user_id": 2, "date": ISODate("2020-10-20"), "status": "Absent" },
  
]);

// Insert data into the "topics" collection
db.topics.insertMany([
  { "_id": 201, "name": "Topic1" },
  { "_id": 202, "name": "Topic2" },
  
]);

// Insert data into the "tasks" collection
db.tasks.insertMany([
  { "_id": 301, "user_id": 1, "task_date": ISODate("2020-10-25"), "problems_solved": 5 },
  { "_id": 302, "user_id": 2, "task_date": ISODate("2020-10-25"), "problems_solved": 3 },
  
]);

// Insert data into the "company_drives" collection
db.company_drives.insertMany([
  { "_id": 401, "name": "Drive1", "start_date": ISODate("2020-10-20"), "end_date": ISODate("2020-10-22") },
  { "_id": 402, "name": "Drive2", "start_date": ISODate("2020-10-30"), "end_date": ISODate("2020-11-02") },
  
]);

// Insert data into the "mentors" collection
db.mentors.insertMany([
  { "_id": 501, "name": "Mentor1" },
  { "_id": 502, "name": "Mentor2" },
  
]);

//Find all the topics and tasks taught in the month of October:


db.topics.find({
  "date": {
    $gte: ISODate("2020-10-01"),
    $lt: ISODate("2020-11-01")
  }
})

db.tasks.find({
  "task_date": {
    $gte: ISODate("2020-10-01"),
    $lt: ISODate("2020-11-01")
  }
})

//Find all the company drives that occurred between 15 Oct 2020 and 31 Oct 2020:

db.company_drives.find({
  "start_date": {
    $gte: ISODate("2020-10-15"),
    $lte: ISODate("2020-10-31")
  }
})

//Find all company drives and students who appeared for placement:

db.company_drives.aggregate([
  {
    $lookup: {
      from: "attendance",
      localField: "_id",
      foreignField: "drive_id",
      as: "drive_attendance"
    }
  },
  {
    $match: {
      "drive_attendance.status": "Present"
    }
  }
])

//Find the number of problems solved by a user in Codekata:

db.tasks.aggregate([
  {
    $group: {
      _id: "$user_id",
      totalProblemsSolved: {
        $sum: "$problems_solved"
      }
    }
  }
])

//Find all mentors with more than 15 mentees:

db.mentors.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "mentor_id",
      as: "mentees"
    }
  },
  {
    $match: {
      $expr: {
        $gte: [{ $size: "$mentees" }, 15]
      }
    }
  }
])

//Find the number of users who were absent and did not submit tasks between 15 Oct 2020 and 31 Oct 2020:

db.attendance.find({
  "date": {
    $gte: ISODate("2020-10-15"),
    $lte: ISODate("2020-10-31")
  },
  "status": "Absent"
})