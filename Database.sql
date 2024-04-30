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
    UId INT,
    MonthYear VARCHAR(7),
    MonthlySell DECIMAL(10, 2),
    MonthlyPurchase DECIMAL(10, 2),
    Tax DECIMAL(10, 2),
    NetProfit DECIMAL(10, 2),
    PRIMARY KEY (UId, MonthYear)
);
create table details(
	username varchar(10),
    email varchar(30),
    password varchar(15),
    UId int primary key auto_increment
);

select * from details;
SET SQL_SAFE_UPDATES = 0;


SELECT * FROM sell;
select * from purchase;

select * from sell;
truncate table monthlysummary;

ALTER TABLE Sell ADD COLUMN GST DECIMAL(10, 2);
ALTER TABLE Purchase ADD COLUMN GST DECIMAL(10, 2);


DELIMITER $$

CREATE TRIGGER before_insert_sell
BEFORE INSERT ON Sell
FOR EACH ROW
BEGIN
    -- Calculate the amount without tax based on quantity and price per unit
    SET NEW.AmountWithoutTax = NEW.Quantity * NEW.PricePerUnit;
    -- Calculate the GST based on the net amount and amount without tax
    SET NEW.GST = NEW.NetAmount - NEW.AmountWithoutTax;
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER before_insert_purchase
BEFORE INSERT ON Purchase
FOR EACH ROW
BEGIN
    -- Calculate the amount without tax based on quantity and price per unit
    SET NEW.AmountWithoutTax = NEW.Quantity * NEW.PricePerUnit;
    -- Calculate the GST based on the net amount and amount without tax
    SET NEW.GST = NEW.NetAmount - NEW.AmountWithoutTax;
END$$
DELIMITER ;

truncate table monthlysummary;
INSERT INTO MonthlySummary (UId, MonthYear, MonthlySell, MonthlyPurchase, Tax, NetProfit)
SELECT 
    uid,
    month_year,
    COALESCE(SUM(monthly_sell), 0) AS MonthlySell,
    COALESCE(SUM(monthly_purchase), 0) AS MonthlyPurchase,
    COALESCE(SUM(sell_tax) - SUM(purchase_tax), 0) AS Tax,
    COALESCE(SUM(monthly_sell) - SUM(monthly_purchase), 0) AS NetProfit
FROM (
    SELECT 
        DATE_FORMAT(TransactionDate, '%Y-%m') AS month_year,
        SUM(CASE WHEN table_type = 'sell' THEN NetAmount ELSE 0 END) AS monthly_sell,
        SUM(CASE WHEN table_type = 'purchase' THEN NetAmount ELSE 0 END) AS monthly_purchase,
        SUM(CASE WHEN table_type = 'sell' THEN GST ELSE 0 END) AS sell_tax,
        SUM(CASE WHEN table_type = 'purchase' THEN GST ELSE 0 END) AS purchase_tax,
        UId AS uid
    FROM (
        SELECT 'sell' AS table_type, TransactionDate, NetAmount, GST, UId FROM Sell
        UNION ALL
        SELECT 'purchase' AS table_type, TransactionDate, NetAmount, GST, UId FROM Purchase
    ) AS combined_data
    GROUP BY month_year, uid
) AS monthly_data
GROUP BY month_year, uid;
select * from monthlysummary;

select * from details;
select * from purchase;
select * from sell;
select * from MonthlySummary;

drop trigger if exists after_insert_sell;
drop trigger if exists after_insert_purchase;
truncate table details;
truncate table sell;
truncate table purchase;
truncate table monthlysummary;
DELIMITER $$

CREATE TRIGGER after_insert_sell
AFTER INSERT ON Sell
FOR EACH ROW
BEGIN
    DECLARE existing_rows INT;
    
    SELECT COUNT(*) INTO existing_rows
    FROM MonthlySummary
    WHERE UId = NEW.UId AND MonthYear = DATE_FORMAT(NEW.TransactionDate, '%Y-%m');
    
    IF existing_rows = 0 THEN
        INSERT INTO MonthlySummary (UId, MonthYear, MonthlySell, MonthlyPurchase, Tax, NetProfit)
        VALUES (
            NEW.UId,
            DATE_FORMAT(NEW.TransactionDate, '%Y-%m'),
            NEW.NetAmount,
            0, -- Initialize MonthlyPurchase to 0
            NEW.GST,
            NEW.NetAmount  -- Set NetProfit to the sell amount for the first sell transaction
        );
    ELSE
        UPDATE MonthlySummary
        SET MonthlySell = MonthlySell + NEW.NetAmount,
            Tax = Tax + NEW.GST,
            NetProfit = MonthlySell + NEW.NetAmount - MonthlyPurchase
        WHERE UId = NEW.UId AND MonthYear = DATE_FORMAT(NEW.TransactionDate, '%Y-%m');
    END IF;
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER after_insert_purchase
AFTER INSERT ON Purchase
FOR EACH ROW
BEGIN
    DECLARE existing_rows INT;
    
    SELECT COUNT(*) INTO existing_rows
    FROM MonthlySummary
    WHERE UId = NEW.UId AND MonthYear = DATE_FORMAT(NEW.TransactionDate, '%Y-%m');
    
    IF existing_rows = 0 THEN
        INSERT INTO MonthlySummary (UId, MonthYear, MonthlySell, MonthlyPurchase, Tax, NetProfit)
        VALUES (
            NEW.UId,
            DATE_FORMAT(NEW.TransactionDate, '%Y-%m'),
            0, -- Initialize MonthlySell to 0
            NEW.NetAmount,
            NEW.GST,
            -NEW.NetAmount  -- Set NetProfit to the negative purchase amount for the first purchase transaction
        );
    ELSE
        UPDATE MonthlySummary
        SET MonthlyPurchase = MonthlyPurchase + NEW.NetAmount,
            Tax = Tax + NEW.GST,
            NetProfit = MonthlySell + NEW.NetAmount - (MonthlyPurchase + NEW.NetAmount)
        WHERE UId = NEW.UId AND MonthYear = DATE_FORMAT(NEW.TransactionDate, '%Y-%m');
    END IF;
END$$

DELIMITER ;

SELECT MonthYear, MonthlySell, MonthlyPurchase, NetProfit FROM MonthlySummary WHERE UId = 2;
