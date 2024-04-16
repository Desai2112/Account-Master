create database account_master;

use account_master;
CREATE TABLE Sell (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(255),
    CustomerName VARCHAR(255),
    UId int,
    Quantity INT,
    PricePerUnit DECIMAL(10, 2),
    AmountWithoutTax DECIMAL(10, 2),
    GSTNO varchar(20),
    GST DECIMAL(10, 2),
    NetAmount DECIMAL(10, 2),
    TransactionDate DATE
);

CREATE TABLE Purchase (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(255),
    SellerName VARCHAR(255),
    UId int,
    Quantity INT,
    PricePerUnit DECIMAL(10, 2),
    AmountWithoutTax DECIMAL(10, 2),
    GSTNO varchar(20),
    GST DECIMAL(10, 2),
    NetAmount DECIMAL(10, 2),
    TransactionDate DATE
);

CREATE TABLE MonthlySummary (
	UId int,
    MonthYear varchar(20) PRIMARY KEY,
    MonthlySell DECIMAL(10, 2),
    MonthlyPurchase DECIMAL(10, 2),
    Tax DECIMAL(10, 2),
    NetProfit DECIMAL(10, 2)
);
create table details(
	username varchar(10),
    email varchar(30),
    password varchar(15),
    UId int primary key auto_increment
);

select * from details;
SET SQL_SAFE_UPDATES = 0;

truncate table purchase;

SELECT * FROM Purchase;

insert into monthlysummary(MonthYear,MonthlySell,MonthlyPurchase,Tax,NetProfit) 
values("January",10000,8500,1100,400);

SELECT 
    *
FROM
    monthlysummary;

select * from sell where uid=3;
truncate sell;
