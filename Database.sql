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

truncate table sell;

SELECT * FROM Purchase;

insert into monthlysummary(MonthYear,MonthlySell,MonthlyPurchase,Tax,NetProfit) 
values("January",10000,8500,1100,400);

-- Update MonthlySummary table with monthly totals from Sell table
INSERT INTO MonthlySummary (UId, MonthYear, MonthlySell)
SELECT 
    UId,
    DATE_FORMAT(TransactionDate, '%Y-%m') AS MonthYear,
    SUM(AmountWithoutTax) AS MonthlySell
FROM Sell
GROUP BY UId, DATE_FORMAT(TransactionDate, '%Y-%m')
ON DUPLICATE KEY UPDATE MonthlySell = monthly_summary_alias.MonthlySell;

-- Update MonthlySummary table with monthly totals from Purchase table
UPDATE MonthlySummary MS
INNER JOIN (
    SELECT 
        UId,
        DATE_FORMAT(TransactionDate, '%Y-%m') AS MonthYear,
        SUM(AmountWithoutTax) AS MonthlyPurchase
    FROM Purchase
    GROUP BY UId, DATE_FORMAT(TransactionDate, '%Y-%m')
) P ON MS.UId = P.UId AND MS.MonthYear = P.MonthYear
SET MS.MonthlyPurchase = P.MonthlyPurchase
WHERE MS.UId = P.UId AND MS.MonthYear = P.MonthYear;

-- Update MonthlySummary table with tax and net profit
UPDATE MonthlySummary MS
INNER JOIN (
    SELECT 
        UId,
        DATE_FORMAT(TransactionDate, '%Y-%m') AS MonthYear,
        SUM(GST) AS TotalSellTax
    FROM Sell
    GROUP BY UId, DATE_FORMAT(TransactionDate, '%Y-%m')
) ST ON MS.UId = ST.UId AND MS.MonthYear = ST.MonthYear
INNER JOIN (
    SELECT 
        UId,
        DATE_FORMAT(TransactionDate, '%Y-%m') AS MonthYear,
        SUM(GST) AS TotalPurchaseTax
    FROM Purchase
    GROUP BY UId, DATE_FORMAT(TransactionDate, '%Y-%m')
) PT ON MS.UId = PT.UId AND MS.MonthYear = PT.MonthYear
SET MS.Tax = ST.TotalSellTax - PT.TotalPurchaseTax,
    MS.NetProfit = MS.MonthlySell - MS.MonthlyPurchase - (ST.TotalSellTax - PT.TotalPurchaseTax);

