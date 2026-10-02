-- MySQL dump 10.13  Distrib 9.6.0, for macos15.7 (arm64)
--
-- Host: localhost    Database: campus_care
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `campus_care`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `campus_care` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `campus_care`;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `message` varchar(3000) NOT NULL,
  `pinned` bit(1) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1pgl63iwbqvmngumhvr3xopg3` (`author_id`),
  CONSTRAINT `FK1pgl63iwbqvmngumhvr3xopg3` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` VALUES (1,'2026-09-23 18:38:49.159546','Mark your biometric attendance by 7:00 PM every night.',_binary '','Biometric Attendance',5),(2,'2026-09-21 21:38:49.160782','Rooms will be inspected Saturday morning. Please keep them tidy.',_binary '\0','Hall Inspection',5);
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `directory`
--

DROP TABLE IF EXISTS `directory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `directory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directory`
--

LOCK TABLES `directory` WRITE;
/*!40000 ALTER TABLE `directory` DISABLE KEYS */;
INSERT INTO `directory` VALUES (1,'Murugan K.','+91 98765 43210','Electrician'),(2,'Raghavan S.','+91 98765 43211','Plumber'),(3,'Vijay R.','+91 98765 43212','Carpenter'),(4,'Mess Office','+91 98765 43213','Food Department'),(5,'Health Centre','+91 98765 43214','Clinic'),(6,'Security Desk','+91 98765 43215','Emergency'),(7,'Puvaneshwari (Chief Warden)','+91 98765 43220','Hostel Warden'),(8,'Jeyashree (Resident Warden)','+91 98765 43224','Hostel Warden'),(9,'Indra (Supervisor Desk - Block A & B)','+91 98765 43221','Hostel Supervisor'),(10,'Thangam (Supervisor Desk - Block C & Services)','+91 98765 43222','Hostel Supervisor'),(11,'Archana (Supervisor Desk - Mess & Common)','+91 98765 43223','Hostel Supervisor');
/*!40000 ALTER TABLE `directory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guest_requests`
--

DROP TABLE IF EXISTS `guest_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guest_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `guest_name` varchar(255) NOT NULL,
  `guest_status` enum('AWAITING','CHECKED_IN','CHECKED_OUT') DEFAULT NULL,
  `room` varchar(255) DEFAULT NULL,
  `status` enum('APPROVED','PENDING','REJECTED') NOT NULL,
  `student_id` bigint NOT NULL,
  `check_in_time` varchar(255) DEFAULT NULL,
  `check_out_time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6tflbgr4a8brh4u3iwedau46a` (`student_id`),
  CONSTRAINT `FK6tflbgr4a8brh4u3iwedau46a` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guest_requests`
--

LOCK TABLES `guest_requests` WRITE;
/*!40000 ALTER TABLE `guest_requests` DISABLE KEYS */;
INSERT INTO `guest_requests` VALUES (1,'2026-08-25','2026-08-27','Radha K. (Mother)',NULL,NULL,'PENDING',1,NULL,NULL),(2,'2026-08-20','2026-08-24','Meena M. (Mother)','CHECKED_IN','804','APPROVED',2,NULL,NULL),(3,'2026-08-22','2026-08-23','Shanthi S. (Mother)',NULL,NULL,'PENDING',3,NULL,NULL),(4,'2026-10-03','2026-10-03','Parents',NULL,NULL,'PENDING',1,'10:00 AM','06:00 PM');
/*!40000 ALTER TABLE `guest_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `issue_feedback`
--

DROP TABLE IF EXISTS `issue_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `issue_feedback` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment` varchar(2000) DEFAULT NULL,
  `rating` int NOT NULL,
  `submitted_at` datetime(6) NOT NULL,
  `issue_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKsvbamr68owrfjrlj79tn2jb0p` (`issue_id`,`student_id`),
  KEY `FK1fx29vprnnf5kon0562mb64gu` (`student_id`),
  CONSTRAINT `FK1fx29vprnnf5kon0562mb64gu` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKjlpx7r91iqpb63y34cpa1ecau` FOREIGN KEY (`issue_id`) REFERENCES `issues` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issue_feedback`
--

LOCK TABLES `issue_feedback` WRITE;
/*!40000 ALTER TABLE `issue_feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `issue_feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `issue_votes`
--

DROP TABLE IF EXISTS `issue_votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `issue_votes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `issue_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKplyb9h0cqhrd7mkygodtmhdtp` (`issue_id`,`user_id`),
  KEY `FK4org4aoxko2rpksr6lf5bnfka` (`user_id`),
  CONSTRAINT `FK4org4aoxko2rpksr6lf5bnfka` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKrlwr5rlgey2jo7v7yqmt5tcv4` FOREIGN KEY (`issue_id`) REFERENCES `issues` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issue_votes`
--

LOCK TABLES `issue_votes` WRITE;
/*!40000 ALTER TABLE `issue_votes` DISABLE KEYS */;
INSERT INTO `issue_votes` VALUES (53,1,1),(2,1,2),(3,1,3),(4,1,4),(5,1,5),(6,1,6),(7,1,7),(54,2,1),(16,2,2),(17,2,3),(18,2,4),(19,2,5),(20,2,6),(21,2,7),(55,3,1),(25,3,2),(26,3,3),(27,3,4),(28,3,5),(29,3,6),(30,3,7),(52,4,1),(47,4,2),(48,4,3),(49,4,4),(51,4,5),(56,5,1),(57,5,2),(58,5,3),(59,5,4),(60,5,6),(61,5,7),(75,6,1),(76,6,2),(77,6,3),(78,6,4),(79,6,6),(80,6,7),(99,7,1),(100,7,2),(101,7,3),(102,7,4),(103,7,6),(104,7,7),(107,8,1),(108,8,2),(109,8,3),(110,8,4),(111,8,6),(112,8,7),(118,9,1),(119,9,2),(120,9,3),(121,9,4),(122,9,6),(123,9,7),(124,10,1),(125,10,2),(126,10,3),(127,10,4),(128,10,6),(129,11,1),(130,11,2),(131,11,3),(132,11,4),(133,11,6),(134,11,7);
/*!40000 ALTER TABLE `issue_votes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `issues`
--

DROP TABLE IF EXISTS `issues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `issues` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `department` varchar(255) NOT NULL,
  `description` varchar(2000) NOT NULL,
  `floor_number` int DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `author_id` bigint NOT NULL,
  `is_private` bit(1) NOT NULL,
  `assigned_at` datetime(6) DEFAULT NULL,
  `assigned_technician` varchar(255) DEFAULT NULL,
  `assigned_to_supervisor` bit(1) NOT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `supervisor_report` varchar(1000) DEFAULT NULL,
  `warden_instructions` varchar(1000) DEFAULT NULL,
  `work_completed` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7ljmlwjfu1bl5dy8tbqdd1s78` (`author_id`),
  CONSTRAINT `FK7ljmlwjfu1bl5dy8tbqdd1s78` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issues`
--

LOCK TABLES `issues` WRITE;
/*!40000 ALTER TABLE `issues` DISABLE KEYS */;
INSERT INTO `issues` VALUES (1,'2026-09-21 21:38:48.760988','Common Restroom','Two taps leaking near entrance.',2,'Block C, Floor 2',NULL,'RESOLVED',1,_binary '\0','2026-09-30 19:56:29.648701','Raghavan S. (Plumber · +91 98765 43211)',_binary '','2026-09-30 22:59:14.636735','Work attended and inspected with Raghavan. Fixed and verified on site.',NULL,_binary ''),(2,'2026-09-19 21:38:48.766343','Study Hall','Tube lights flickering.',1,'Floor 1, Hall B',NULL,'RESOLVED',2,_binary '\0','2026-09-30 22:59:23.196389','Murugan K. (Electrician · +91 98765 43210)',_binary '','2026-09-30 22:59:27.383270','Replaced two fluorescent tubes and ballast with electrician Murugan. Tested and working properly.',NULL,_binary ''),(3,'2026-09-17 21:38:48.768879','Lift','Grinding noise between floor 3–4.',NULL,'Block A',NULL,'RESOLVED',3,_binary '\0',NULL,NULL,_binary '\0',NULL,NULL,NULL,_binary '\0'),(4,'2026-09-22 21:38:48.772310','Mess','Water dispenser empty since yesterday.',0,'Ground floor',NULL,'RESOLVED',4,_binary '\0',NULL,NULL,_binary '\0',NULL,NULL,NULL,_binary '\0'),(5,'2026-09-30 23:50:42.000000','Mess','Main water cooler filter leaking heavily and making loud buzzing noise.',0,'Ground Floor Dining Hall B',NULL,'REPORTED',1,_binary '\0',NULL,NULL,_binary '\0',NULL,NULL,NULL,_binary '\0'),(6,'2026-09-30 11:50:42.000000','Lift','Lift getting stuck between Floor 3 and Floor 4 with error code E-12.',NULL,'Block A Main Passenger Lift',NULL,'IN_PROGRESS',3,_binary '\0','2026-10-01 03:50:42.000000','R. Sundaram (Supervisor Â· +91 98765 43221)',_binary '',NULL,NULL,NULL,_binary '\0'),(7,'2026-09-30 17:50:42.000000','Common Restroom','Flush valve stuck and overflowing continuously in cubicle 3.',2,'Block C, 2nd Floor Restroom',NULL,'IN_PROGRESS',2,_binary '\0','2026-10-01 05:50:42.000000','M. Natarajan (Supervisor Â· +91 98765 43222)',_binary '','2026-10-01 10:50:42.000000','Inspected with plumber Raghavan. Replaced the worn flush syphon valve and tested flow. Working normally without leak.',NULL,_binary ''),(8,'2026-09-30 15:50:42.000000','Study Hall','Two ceiling LED tube lights flickering and corner power socket dead.',1,'1st Floor Study Hall East',NULL,'RESOLVED',4,_binary '\0','2026-10-01 06:50:42.000000','M. Natarajan (Supervisor Â· +91 98765 43222)',_binary '','2026-10-01 09:50:42.000000','Electrician Murugan replaced the LED driver batten and tightened terminal connections in the distribution board. All lights bright and socket tested.',NULL,_binary ''),(9,'2026-10-01 01:50:42.000000','Carpentry & Furniture','Heavy fire exit door hinge bent and safety latch rattling loose in the wind.',3,'Floor 3 Common Balcony',NULL,'WORK_COMPLETED',1,_binary '\0','2026-10-01 07:50:42.000000','K. Venu (Supervisor Â· +91 98765 43223)',_binary '','2026-10-01 11:56:13.700986','Work inspected and completed with technician. Verified on site.',NULL,_binary ''),(10,'2026-09-30 21:50:42.000000','Outside Area','Compound pathway light pole #4 not turning on after dusk.',0,'Bicycle Stand & Courtyard',NULL,'WORK_COMPLETED',6,_binary '\0','2026-10-01 08:50:42.000000','R. Sundaram (Supervisor Â· +91 98765 43221)',_binary '','2026-10-01 11:56:15.574030','Work inspected and completed with technician. Verified on site.',NULL,_binary ''),(11,'2026-10-01 04:50:42.000000','Laundry','Front-loading washing machine #2 drum error during spin cycle.',1,'Block B Laundry Room',NULL,'REPORTED',7,_binary '\0',NULL,NULL,_binary '\0',NULL,NULL,NULL,_binary '\0'),(12,'2026-10-01 06:50:42.000000','Attached Restroom','Shower head joint dripping steadily and tap knob stiff to turn.',2,'Room 214',NULL,'REPORTED',1,_binary '',NULL,NULL,_binary '\0',NULL,NULL,NULL,_binary '\0'),(13,'2026-09-30 19:50:42.000000','Electrical & Lights','Study table socket sparked and tripped the room 6A miniature circuit breaker.',3,'Room 301',NULL,'RESOLVED',3,_binary '','2026-10-01 05:50:42.000000','K. Venu (Supervisor Â· +91 98765 43223)',_binary '','2026-10-01 10:50:42.000000','Murugan inspected socket board and replaced melted 6A modular socket. Reset MCB and verified with tester.',NULL,_binary ''),(14,'2026-10-01 07:50:42.000000','Room Fixtures / Doors','Sliding window glass pane lock broken, rattling noisily during strong breeze.',1,'Room 108',NULL,'WORK_COMPLETED',2,_binary '','2026-10-01 11:55:14.165611','M. Natarajan (Supervisor Â· +91 98765 43222)',_binary '','2026-10-01 11:56:11.698695','Work inspected and completed with technician. Verified on site.',NULL,_binary ''),(15,'2026-10-02 12:39:05.818602','Mess','Water dispenser tap leaking',2,'Near water cooler',NULL,'REPORTED',1,_binary '\0',NULL,NULL,_binary '\0',NULL,NULL,NULL,_binary '\0'),(16,'2026-10-02 12:52:08.767165','Living Room','kjnkn',1,'Floor 1','/uploads/2d06fdb6-5683-4646-bfc6-6d94e663aeba-IMG_1682.HEIC','REPORTED',1,_binary '\0',NULL,NULL,_binary '\0',NULL,NULL,NULL,_binary '\0');
/*!40000 ALTER TABLE `issues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lost_items`
--

DROP TABLE IF EXISTS `lost_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lost_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `item_type` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `room_number` varchar(255) DEFAULT NULL,
  `description` varchar(3000) NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `author_id` bigint NOT NULL,
  `created_at` datetime NOT NULL,
  `claimed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_lost_items_author` (`author_id`),
  CONSTRAINT `fk_lost_items_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lost_items`
--

LOCK TABLES `lost_items` WRITE;
/*!40000 ALTER TABLE `lost_items` DISABLE KEYS */;
INSERT INTO `lost_items` VALUES (1,'Steel Water Bottle','LOST','Dining Mess','507','I lost my water bottle in Mess today morning. It will be like this. If anyone mistook it please return it to room no. 507','/uploads/lost-water-bottle.jpg','CLAIMED',1,'2026-10-01 11:35:12','2026-10-01 13:57:01'),(2,'Striped Blue Laundry Sock','LOST','Laundry Room','605','The other pair went missing in the laundry. If anyone has it, pls return to Rathna, room no. 605','/uploads/lost-striped-sock.jpg','OPEN',3,'2026-10-01 09:35:12',NULL),(3,'Black Cotton Sock','FOUND','Misplaced in Bucket','501','This socks is misplaced with my bucket. The owner please collect it from room no 501.','/uploads/found-black-sock.jpg','OPEN',6,'2026-10-01 07:35:12',NULL),(4,'Yellow Heart Handkerchief','FOUND','Misplaced in Bucket','615','This hand kerchief is misplaced in my bucket. Please ask the owner to collect it from room 615.','/uploads/found-heart-handkerchief.jpg','OPEN',2,'2026-10-01 04:35:12',NULL);
/*!40000 ALTER TABLE `lost_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mess_menu`
--

DROP TABLE IF EXISTS `mess_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mess_menu` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `day_of_week` varchar(255) NOT NULL,
  `items` varchar(1000) NOT NULL,
  `meal` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKnanv0bx4bspiwqc2ln95eox5e` (`day_of_week`,`meal`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mess_menu`
--

LOCK TABLES `mess_menu` WRITE;
/*!40000 ALTER TABLE `mess_menu` DISABLE KEYS */;
INSERT INTO `mess_menu` VALUES (1,'Mon','Idli + Sambar','Breakfast'),(2,'Mon','Rice + Sambar + Poriyal + Curd','Lunch'),(3,'Mon','Tea + Biscuits','Snacks'),(4,'Mon','Chapati + Kurma','Dinner'),(5,'Tue','Dosa + Chutney','Breakfast'),(6,'Tue','Lemon Rice + Potato Fry + Curd','Lunch'),(7,'Tue','Sundal + Tea','Snacks'),(8,'Tue','Idiyappam + Coconut Milk','Dinner'),(9,'Wed','Ven Pongal + Sambar','Breakfast'),(10,'Wed','Rice + Rasam + Beans Poriyal','Lunch'),(11,'Wed','Bajji + Tea','Snacks'),(12,'Wed','Dosa + Sambar','Dinner'),(13,'Thu','Poori + Masala','Breakfast'),(14,'Thu','Tomato Rice + Egg/Paneer + Curd','Lunch'),(15,'Thu','Bonda + Tea','Snacks'),(16,'Thu','Chapati + Paneer Curry','Dinner'),(17,'Fri','Upma + Chutney','Breakfast'),(18,'Fri','Rice + Sambar + Avial','Lunch'),(19,'Fri','Banana + Tea','Snacks'),(20,'Fri','Parotta + Salna','Dinner'),(21,'Sat','Vada + Sambar','Breakfast'),(22,'Sat','Vegetable Biryani + Raita','Lunch'),(23,'Sat','Murukku + Coffee','Snacks'),(24,'Sat','Vegetable Kothu Parotta','Dinner'),(25,'Sun','Rava Dosa + Chutney','Breakfast'),(26,'Sun','Rice + Mor Kuzhambu + Poriyal','Lunch'),(27,'Sun','Vada + Tea','Snacks'),(28,'Sun','Pongal + Chutney','Dinner');
/*!40000 ALTER TABLE `mess_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parcels`
--

DROP TABLE IF EXISTS `parcels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parcels` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `arrived_at` datetime(6) NOT NULL,
  `collected_at` datetime(6) DEFAULT NULL,
  `collected_by` varchar(255) DEFAULT NULL,
  `courier` varchar(255) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `otp` varchar(255) NOT NULL,
  `status` enum('COLLECTED','WAITING_PICKUP') NOT NULL,
  `storage_location` varchar(255) DEFAULT NULL,
  `tracking_number` varchar(255) DEFAULT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKd2ge1xf18dgewmd8i14myv2pp` (`student_id`),
  CONSTRAINT `FKd2ge1xf18dgewmd8i14myv2pp` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parcels`
--

LOCK TABLES `parcels` WRITE;
/*!40000 ALTER TABLE `parcels` DISABLE KEYS */;
INSERT INTO `parcels` VALUES (1,'2026-09-30 20:16:27.606998','2026-10-01 11:10:30.367280','Collected by Aditi Ramesh','Amazon','Amazon - Study lamp & electronics','4812','COLLECTED','Gate 1 Security Desk (Shelf A-2)','AMZN-IN-839210',1),(2,'2026-09-30 18:16:27.619677','2026-09-30 22:18:09.730291','Verified by Security','India Post','Speed Post - Home snacks box','2931','COLLECTED','Gate 1 Security Counter','SP-KL-4091',2),(3,'2026-09-29 22:16:27.621392','2026-09-30 17:16:27.621405','Verified with OTP','Flipkart','Flipkart - Earphones','7104','COLLECTED','Gate 1 Security Desk','FK-992144',3),(4,'2026-09-30 22:24:35.778803','2026-09-30 22:24:35.927175','Verified by Security','Amazon','Amazon - Books & stationery','1799','COLLECTED','Gate 1 Security Counter','AMZ-40291',4),(5,'2026-10-01 17:00:39.921675','2026-10-01 17:01:00.656114','Verified by Security','Flipkart','Books','3286','COLLECTED','Gate 1 Shelf B','FK-9921',1),(6,'2026-10-01 17:01:13.242343',NULL,NULL,'Blue Dart','Important documents','3106','WAITING_PICKUP','Gate 1 Security Desk','BD-7821',1);
/*!40000 ALTER TABLE `parcels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `floor_number` int DEFAULT NULL,
  `floor_rep` bit(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('STAFF','STUDENT') NOT NULL,
  `room_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'24z202@psgitech.ac.in',2,_binary '','Nija K','$2a$10$9lOw9zWpPKrn1Y2x5UmTzuiOvqn3eVYz8xJeDpFXYCxfm3I2m1QI6','STUDENT','214'),(2,'24z200@psgitech.ac.in',2,_binary '\0','Navina M','$2a$10$nFn82pnjq5V3KeQ.4EbS/ekxEBoFo.rGB5LHaqcjeZ7kZ4vb.jLnG','STUDENT','201'),(3,'24z201@psgitech.ac.in',2,_binary '\0','Nethrshri S','$2a$10$qWHiH8VSFTflEGcjSPXTaeO4GP15ZD6Z22ahloP2KpCtNCp2VnnR6','STUDENT','202'),(4,'24z173@psgitech.ac.in',2,_binary '\0','Kavinaya S','$2a$10$M7I0S5jpe8mgR//uxSxWKOvQ7ebBKGpvd8DBfzTHNlM89EwNlfVfC','STUDENT','203'),(5,'puvaneshwari@psgitech.ac.in',NULL,_binary '\0','Puvaneshwari','$2a$10$cutBpc9LtgPA5hzqZKfyA.6kFXhOX8MwyQ4tj96q54p92QCEUWB6.','STAFF',NULL),(6,'24z211@psgitech.ac.in',2,_binary '\0','Poojashri V','$2a$10$d/Td4tYS8hWSvZZiQM.zB.RLJVX7zi50DE98l30kTDXaS.CFe0PfG','STUDENT','204'),(7,'24z216@psgitech.ac.in',2,_binary '\0','Prathiksha N','$2a$10$GZjZxCt1YjzurvM3EKFbLu.rb4QTfUJxuOkjrtZLx7uSQ40NdUH.y','STUDENT','205'),(31,'jeyashree@psgitech.ac.in',NULL,_binary '\0','Jeyashree','$2a$10$9aVLBasYBfMsnSatqUyvEeJnbS15rwC9Cw6dscsGJQAdrbzmHbyiO','STAFF',NULL),(32,'supervisor1@psgitech.ac.in',NULL,_binary '\0','Indra (Supervisor)','$2a$10$hxPRdULm2AvIEDaFoWm92OiXr4nE8KmiI2O.i2NCpOogBcqQioV/G','STAFF',NULL),(33,'supervisor2@psgitech.ac.in',NULL,_binary '\0','Thangam (Supervisor)','$2a$10$hxPRdULm2AvIEDaFoWm92OiXr4nE8KmiI2O.i2NCpOogBcqQioV/G','STAFF',NULL),(34,'supervisor3@psgitech.ac.in',NULL,_binary '\0','Archana (Supervisor)','$2a$10$hxPRdULm2AvIEDaFoWm92OiXr4nE8KmiI2O.i2NCpOogBcqQioV/G','STAFF',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-02 12:54:27
