-- user
INSERT INTO `user` SET
    `user_id`  = 'yihuan001',
    `user_name`  = 'ydong2',
    `email`  = 'game2learnlab@ncsu.edu',
    `school_id` = 'ncsuschoolid',
    `user_type` = 'student',
    `display_name` = NULL
;

INSERT INTO `user` SET
    `user_id`  = 'nick002',
    `user_name`  = 'ncsu002',
    `email`  = 'game2learnlab@ncsu.edu',
    `school_id` = 'ncsuschoolid',
    `user_type` = 'student',
    `display_name` = NULL
;


INSERT INTO `user` SET
    `user_id`  = 'alex003',
    `user_name`  = 'ncsu003',
    `email`  = 'game2learnlab@ncsu.edu',
    `school_id` = 'ncsuschoolid',
    `user_type` = 'student',
    `display_name` = NULL
;

INSERT INTO `user` SET
    `user_id`  = 'amy004',
    `user_name`  = 'ncsu004',
    `email`  = 'game2learnlab@ncsu.edu',
    `school_id` = 'ncsuschoolid',
    `user_type` = 'student',
    `display_name` = NULL
;

INSERT INTO `user` SET
    `user_id`  = 'barnes001',
    `user_name`  = 'ncsut001',
    `email`  = 'game2learnlab@ncsu.edu',
    `school_id` = 'ncsuschoolid',
    `user_type` = 'teacher',
    `display_name` = 'Ms. Barnes'
;

INSERT INTO `user` SET
    `user_id`  = 'catete002',
    `user_name`  = 'teacher001',
    `email`  = 'yihuandong@gmail.com',
    `school_id` = 'ncsuschoolid',
    `user_type` = 'teacher',
    `display_name` = 'Ms. Catete'
;



-- assignment


INSERT INTO `assignment` SET
    `assignment_file_name`  = 'Day1Activity1',
    `assignment_name`  = 'Draw a Square',
    `description` = 'Draw a square activity',
    `environment` = 'Snap',
    `config_path` = '../config.js',
    `start_date` = '2019-07-21 00:00:01',
    `end_date` = '2019-07-26 23:59:59'
;

INSERT INTO `assignment` SET
    `assignment_file_name`  = 'Day1Activity2',
    `assignment_name`  = 'Introduce Yourself Starter',
    `description` = 'Introduce yourself starter code for the 2019 summer IC PD',
    `environment` = 'Snap',
    `config_path` = '../config.js',
    `start_date` = '2019-07-26 00:00:01',
    `end_date` = '2019-07-28 23:59:59'
;

INSERT INTO `assignment` SET
    `assignment_file_name`  = 'Day3Activity1',
    `assignment_name`  = 'Cellular starter',
    `description` = 'Introducing simulation in cellular',
    `environment` = 'Cellular',
    `config_path` = '../config.js',
    `start_date` = '2019-07-27 00:00:01',
    `end_date` = '2019-07-28 23:59:59'
;

INSERT INTO `assignment` SET
    `assignment_file_name`  = 'Day2Activity1',
    `assignment_name`  = 'Draw Coordinate',
    `description` = 'Draw Coordinate starter code for the 2019 summer IC PD',
    `environment` = 'Snap',
    `config_path` = '../config.js',
    `start_date` = '2019-07-26 00:00:01',
    `end_date` = '2019-07-28 23:59:59'
;

-- session

INSERT INTO `session` SET
    `student_id`  = 'yihuan001',
    `teacher_id`  = 'catete002',
    `period` = '1',
    `assignment_id` = 1,
    `consent` = 1
;

INSERT INTO `session` SET
    `student_id`  = 'yihuan001',
    `teacher_id`  = 'catete002',
    `period` = '3',
    `assignment_id` = 2,
    `consent` = 1
;

INSERT INTO `session` SET
    `student_id`  = 'yihuan001',
    `teacher_id`  = 'catete002',
    `period` = '3',
    `assignment_id` = 4,
    `consent` = 1
;

INSERT INTO `session` SET
    `student_id`  = 'yihuan001',
    `teacher_id`  = 'barnes001',
    `period` = '2',
    `assignment_id` = 3,
    `consent` = 1
;

INSERT INTO `session` SET
    `student_id`  = 'nick002',
    `teacher_id`  = 'catete002',
    `period` = '1',
    `assignment_id` = 1,
    `consent` = 1
;
