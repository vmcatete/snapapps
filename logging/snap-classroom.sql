-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Sep 09, 2015 at 06:18 PM
-- Server version: 5.6.24
-- PHP Version: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

-- --------------------------------------------------------

--
-- Table structure for table `trace`
--

DROP TABLE IF EXISTS `trace`;

CREATE TABLE IF NOT EXISTS `trace` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'A unique row ID for this event.',
  `time` datetime NOT NULL COMMENT 'The client-side time at which the event was logged. This may be inaccurate if the browser clock was wrong.',
  `serverTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'An auto-generated timestamp when this row was created, which may be after the event actually occurred.',
  `message` varchar(64) NOT NULL COMMENT 'The type of event that occurred.',
  `data` text NOT NULL COMMENT 'Any additional parameters associated with the event.',
  `assignmentID` varchar(40) NOT NULL COMMENT 'The ID of the assignment being worked on.',
  `userID` varchar(255) DEFAULT NULL COMMENT 'A hashed ID for the user.',
  `projectID` varchar(40) NOT NULL COMMENT 'A GUID for the Snap project.',
  `sessionID` varchar(40) NOT NULL COMMENT 'A GUID for the browser session.',
  `browserID` varchar(40) NOT NULL COMMENT 'A GUID for the browser.',
  `code` text NOT NULL COMMENT 'A snapshot of the xml of the Snap project, if changed from the last log.',
  PRIMARY KEY (id),
  INDEX (assignmentID),
  INDEX (userID),
  INDEX (message),
  INDEX (projectID),
  INDEX (time)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ALTER TABLE trace ADD INDEX (assignmentID);
-- ALTER TABLE trace ADD INDEX (userID);
-- ALTER TABLE trace ADD INDEX (message);
-- ALTER TABLE trace ADD INDEX (projectID);
-- ALTER TABLE trace ADD INDEX (time);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

DROP TABLE IF EXISTS `user`;

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` varchar(255) NOT NULL COMMENT 'A unique identifier that follows a user',
  `user_name` varchar(255) NOT NULL COMMENT 'A front facing user name to log into the system and Snap cloud',
  `email` varchar(255) NOT NULL COMMENT 'email address to reset password',
  `school_id` varchar(255) NOT NULL COMMENT 'NCES school id or a unique school identifier',
  `user_type` varchar(255) NOT NULL COMMENT 'student or teacher or helper or researcher',
  `display_name` varchar(255) COMMENT 'display in the drop down menu',
  PRIMARY KEY (user_id),
  INDEX (user_name),
  INDEX (school_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



DROP TABLE IF EXISTS `school`;

CREATE TABLE IF NOT EXISTS `school` (
  `school_id` varchar(255) NOT NULL COMMENT 'A unique identifier for the school, nces id for public k-12 schools',
  `school_name` varchar(255) NOT NULL COMMENT 'A front facing name for the school',
  `street_address` varchar(255) NOT NULL COMMENT 'The street address of the school',
  `city` varchar(255) NOT NULL COMMENT 'The city where the school is in',
  `county` varchar(255) NOT NULL COMMENT 'The county the school is in',
  `state` varchar(255) COMMENT 'The state the school is in, acronym ',
  `zip` varchar(10) COMMENT 'The zip code of the school',
  PRIMARY KEY (school_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



DROP TABLE IF EXISTS `session`;

CREATE TABLE IF NOT EXISTS `session` (
  `session_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'A unique row ID for this session.',
  `student_id` varchar(255) NOT NULL COMMENT 'A unique identifier for the student',
  `teacher_id` varchar(255) NOT NULL COMMENT 'A unique identifier for the teacher',
  `period` varchar(255) NOT NULL COMMENT 'The front facing period number',
  `assignment_id` varchar(255) NOT NULL COMMENT 'An unique identifier for the assignment',
  `consent` tinyint(1) NOT NULL COMMENT 'If we have student consent to look at the data',
  PRIMARY KEY (session_id),
  INDEX (teacher_id,period,assignment_id,consent)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



DROP TABLE IF EXISTS `assignment`;

CREATE TABLE IF NOT EXISTS `assignment` (
  `assignment_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'A unique identifier for the assignment.',
  `assignment_file_name` varchar(255) COMMENT 'The name of the assignment file',
  `assignment_name` varchar(255) NOT NULL COMMENT 'The front facing name of the assignment',
  `description` varchar(255) COMMENT 'The description of the assignment',
  `environment` varchar(20) NOT NULL COMMENT 'The programming environment of the assignment',
  `config_path` varchar(255) NOT NULL COMMENT 'The relative path to the config file',
  `start_date` datetime NOT NULL COMMENT 'The date when the assignment begins',
  `end_date` datetime NOT NULL COMMENT 'The date when the assignment ends',
  PRIMARY KEY (assignment_id),
  INDEX (start_date),
  INDEX (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;