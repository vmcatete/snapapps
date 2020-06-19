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

-- DROP TABLE IF EXISTS `trace`;

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
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE trace ADD INDEX (assignmentID);
ALTER TABLE trace ADD INDEX (userID);
ALTER TABLE trace ADD INDEX (message);
ALTER TABLE trace ADD INDEX (projectID);
ALTER TABLE trace ADD INDEX (time);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- DROP TABLE IF EXISTS `viewer_trace`;

CREATE TABLE IF NOT EXISTS `viewer_trace` (
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
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE viewer_trace ADD INDEX (assignmentID);
ALTER TABLE viewer_trace ADD INDEX (userID);
ALTER TABLE viewer_trace ADD INDEX (message);
ALTER TABLE viewer_trace ADD INDEX (projectID);
ALTER TABLE viewer_trace ADD INDEX (time);


--
-- Table structure for table `checkpoints`
--

CREATE TABLE IF NOT EXISTS `checkpoints` (
`id` int(11) NOT NULL,
  `guid` varchar(64) NOT NULL,
  `userIDA` varchar(255) NOT NULL,
  `userIDB` varchar(255) NOT NULL,
  `serverTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fromUserA` tinyint(4) NOT NULL,
  `code` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

ALTER TABLE `checkpoints`
 ADD PRIMARY KEY (`id`);

ALTER TABLE `checkpoints`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


CREATE TABLE IF NOT EXISTS `sharecode` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serverTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userID` varchar(255) NOT NULL,
  `assignmentID` varchar(40) NOT NULL COMMENT 'The ID of the assignment being worked on.',
  `code` longtext NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;