UPDATE `trace`
SET projectID = userID;
-- SET projectID = CONCAT(user_ID, "_", assignmentID)

/* Seperate Data by date*/
SELECT * FROM `trace`
WHERE Date(time) = "2018-01-11"

