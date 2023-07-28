-- MariaDB dump 10.19-11.1.0-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: keya_engineering_works
-- ------------------------------------------------------
-- Server version	11.1.0-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `address` (
  `GSTIN` varchar(20) NOT NULL,
  `State` varchar(40) NOT NULL,
  `City` varchar(40) NOT NULL,
  `PIN` int(11) NOT NULL,
  `Street` varchar(40) DEFAULT NULL,
  `House/Building` varchar(40) DEFAULT NULL,
  `Post_Office` varchar(20) DEFAULT NULL,
  `Police_Station` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`GSTIN`),
  CONSTRAINT `address_ibfk_1` FOREIGN KEY (`GSTIN`) REFERENCES `company` (`GSTIN`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES
('19ANLPS7995J1ZR','West Bengal','Kolkata',700041,'Pashupati Bhattacharjee Road','313 B/1','Paschim Putiary','Behala'),
('19ANTPK6972B1ZH','West Bengal','Kolkata',700015,'Debendra Chandra Day Road','66','Tangra','Tangra');
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bank_account`
--

DROP TABLE IF EXISTS `bank_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bank_account` (
  `GST` varchar(20) NOT NULL,
  `AC_NO` varchar(20) NOT NULL,
  `Bank` varchar(40) NOT NULL,
  `Branch` varchar(40) NOT NULL,
  `IFSC` varchar(20) NOT NULL,
  UNIQUE KEY `AC_NO` (`AC_NO`),
  KEY `GST` (`GST`),
  CONSTRAINT `bank_account_ibfk_1` FOREIGN KEY (`GST`) REFERENCES `company` (`GSTIN`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bank_account`
--

LOCK TABLES `bank_account` WRITE;
/*!40000 ALTER TABLE `bank_account` DISABLE KEYS */;
/*!40000 ALTER TABLE `bank_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company` (
  `GSTIN` varchar(20) NOT NULL,
  `Name` varchar(40) DEFAULT NULL,
  `Mobile` varchar(13) DEFAULT NULL,
  `Email` varchar(40) DEFAULT NULL,
  `Date_of_Establish` date DEFAULT NULL,
  `Type` varchar(10) NOT NULL,
  PRIMARY KEY (`GSTIN`),
  UNIQUE KEY `Name` (`Name`),
  UNIQUE KEY `Date_of_Establish` (`Date_of_Establish`),
  UNIQUE KEY `Mobile` (`Mobile`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES
('19ANLPS7995J1ZR','Keya Engineering Works',NULL,NULL,NULL,'self'),
('19ANTPK6972B1ZH','M/S. Golden Plastic Works',NULL,NULL,NULL,'seller'),
('t1','Raunak Enterprise',NULL,NULL,NULL,'buyer'),
('t2','Shreeya Enterprise',NULL,NULL,NULL,'buyer');
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery`
--

DROP TABLE IF EXISTS `delivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `delivery` (
  `Serial` int(11) NOT NULL AUTO_INCREMENT,
  `GSTIN` varchar(20) NOT NULL,
  `Invoice_No` varchar(20) NOT NULL,
  `Challan_No` varchar(20) DEFAULT NULL,
  `Order_No` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`Serial`),
  UNIQUE KEY `Invoice_No` (`Invoice_No`),
  KEY `ID` (`GSTIN`),
  CONSTRAINT `delivery_ibfk_1` FOREIGN KEY (`GSTIN`) REFERENCES `company` (`GSTIN`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery`
--

LOCK TABLES `delivery` WRITE;
/*!40000 ALTER TABLE `delivery` DISABLE KEYS */;
INSERT INTO `delivery` VALUES
(1,'19ANTPK6972B1ZH','1234','1234','1234');
/*!40000 ALTER TABLE `delivery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gst`
--

DROP TABLE IF EXISTS `gst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gst` (
  `ID` varchar(20) NOT NULL,
  `SGST` decimal(6,2) DEFAULT NULL,
  `CGST` decimal(6,2) DEFAULT NULL,
  `Product_ID` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Product_ID` (`Product_ID`),
  CONSTRAINT `gst_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `company` (`GSTIN`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gst`
--

LOCK TABLES `gst` WRITE;
/*!40000 ALTER TABLE `gst` DISABLE KEYS */;
/*!40000 ALTER TABLE `gst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `Product_Id` varchar(15) NOT NULL,
  `Product_Name` varchar(40) NOT NULL,
  PRIMARY KEY (`Product_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES
('SP-2521','Jali'),
('SP-4210','Jali'),
('SP-4556','Jali');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase`
--

DROP TABLE IF EXISTS `purchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchase` (
  `GSTIN` varchar(20) NOT NULL,
  `Product_Id` varchar(15) NOT NULL,
  `Date` date NOT NULL DEFAULT curdate(),
  `Price` decimal(10,2) NOT NULL,
  `Quantity` int(10) NOT NULL,
  `gst_perc` decimal(4,2) NOT NULL DEFAULT 0.00,
  KEY `Product_ID` (`Product_Id`),
  KEY `GSTIN` (`GSTIN`),
  CONSTRAINT `purchase_ibfk_1` FOREIGN KEY (`Product_Id`) REFERENCES `products` (`Product_Id`),
  CONSTRAINT `purchase_ibfk_2` FOREIGN KEY (`GSTIN`) REFERENCES `company` (`GSTIN`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase`
--

LOCK TABLES `purchase` WRITE;
/*!40000 ALTER TABLE `purchase` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale`
--

DROP TABLE IF EXISTS `sale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sale` (
  `GSTIN` varchar(20) NOT NULL,
  `Product_Id` varchar(20) NOT NULL,
  `BillDate` date DEFAULT curdate(),
  `Price` decimal(10,2) DEFAULT NULL,
  `Quantity` int(6) DEFAULT NULL,
  `gst_perc` decimal(4,2) NOT NULL DEFAULT 0.00,
  KEY `Product_Id` (`Product_Id`),
  KEY `GSTIN` (`GSTIN`),
  CONSTRAINT `sale_ibfk_1` FOREIGN KEY (`Product_Id`) REFERENCES `products` (`Product_Id`),
  CONSTRAINT `sale_ibfk_2` FOREIGN KEY (`GSTIN`) REFERENCES `company` (`GSTIN`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale`
--

LOCK TABLES `sale` WRITE;
/*!40000 ALTER TABLE `sale` DISABLE KEYS */;
/*!40000 ALTER TABLE `sale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale_bill`
--

DROP TABLE IF EXISTS `sale_bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sale_bill` (
  `GSTIN` varchar(20) NOT NULL,
  `Product_Id` varchar(15) NOT NULL,
  `BillDate` date NOT NULL DEFAULT curdate(),
  `Price` decimal(10,2) NOT NULL,
  `Quantity` int(10) NOT NULL,
  `gst_perc` decimal(4,2) NOT NULL DEFAULT 0.00,
  KEY `Product_Id` (`Product_Id`),
  KEY `GSTIN` (`GSTIN`),
  CONSTRAINT `sale_bill_ibfk_1` FOREIGN KEY (`Product_Id`) REFERENCES `products` (`Product_Id`),
  CONSTRAINT `sale_bill_ibfk_2` FOREIGN KEY (`GSTIN`) REFERENCES `company` (`GSTIN`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_bill`
--

LOCK TABLES `sale_bill` WRITE;
/*!40000 ALTER TABLE `sale_bill` DISABLE KEYS */;
/*!40000 ALTER TABLE `sale_bill` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-28 20:36:38
