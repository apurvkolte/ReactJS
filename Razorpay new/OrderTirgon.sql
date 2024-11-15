-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: trigon
-- ------------------------------------------------------
-- Server version	5.7.36-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` varchar(255) NOT NULL,
  `order_date` varchar(255) NOT NULL DEFAULT 'NOW()',
  `delivered_date` timestamp NULL DEFAULT NULL,
  `orderStatus` varchar(50) DEFAULT 'Processing',
  `paymentStatus` varchar(50) DEFAULT NULL,
  `tracking_id` varchar(45) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `bank_ref_no` varchar(45) DEFAULT NULL,
  `payment_mode` varchar(45) DEFAULT NULL,
  `card_name` varchar(45) DEFAULT NULL,
  `product_id` int(10) unsigned NOT NULL,
  `sale_price` decimal(16,2) NOT NULL,
  `productName` varchar(255) DEFAULT NULL,
  `quantity` smallint(6) unsigned NOT NULL,
  `path` varchar(255) DEFAULT NULL,
  `totalPrice` decimal(16,2) unsigned DEFAULT '0.00',
  `taxPrice` decimal(9,2) unsigned DEFAULT '0.00',
  `tax_rate` int(3) unsigned DEFAULT '0',
  `shippingPrice` double(9,2) unsigned DEFAULT '0.00',
  `shop_length` int(3) DEFAULT '1',
  `user_id` int(10) unsigned NOT NULL,
  `userName` varchar(255) DEFAULT NULL,
  `billing_name` varchar(255) DEFAULT NULL,
  `mobile` varchar(20) NOT NULL,
  `gstn` varchar(45) DEFAULT NULL,
  `flat` varchar(255) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `postalCode` varchar(50) DEFAULT NULL,
  `redeem` int(11) DEFAULT NULL,
  `coupon_code` varchar(255) DEFAULT NULL,
  `reason` varchar(1000) DEFAULT NULL,
  `cid` int(10) DEFAULT NULL,
  `columns` text,
  `header` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'order_P7JmgsVMU6h5yE','2024-10-10 16:57:00',NULL,'Processing','cancel','PJORD_1728559618964',NULL,'','','',5,2124.00,'SM 611 Abrasive mop for Paint, Varnish, Filling compound, Wood, Plastic, Metals',60,'2024-10-01T11-53-41.342Z mr_sm611.jpg',127440.00,324.00,18,0.00,1,1,'Apurv Soft Dev1','Apurv','9766222430','','flat no 7','pimple saudagar','shivasr chouk','Pune','Maharashtra','India','411027',0,'','',3,'25, 165, 5.800, 43.1, 150, 12081','Width/mm, Diameter/mm, Max. RPM, Bore/mm, Grit, Item number');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-10 17:01:15
