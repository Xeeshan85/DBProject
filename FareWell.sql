create database FareWell;
use FareWell;

CREATE TABLE Users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
	Email VARCHAR(100),
    Password TEXT,
    UserType TINYINT DEFAULT 0,
    CONSTRAINT Chk_User_Type CHECK (UserType IN (0, 2)) 
    -- 0 for students 1 for teachers 2 for admin
);

select * from users;

CREATE TABLE Students (
    StudentId INT AUTO_INCREMENT PRIMARY KEY,
    RollNo VARCHAR(10),
    Department VARCHAR(100),
    PhoneNo VARCHAR(50),
    DietaryPreferences VARCHAR(100),
    RegisterationStatus bool
);

CREATE TABLE Teachers (
    TeacherId INT AUTO_INCREMENT PRIMARY KEY,
    Department VARCHAR(100),
    PhoneNo VARCHAR(50),
    DietaryPreferences VARCHAR(100),
    RegisterationStatus bool
);






ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'KITa-@2247493$';

-- 		rollNo INT,
-- 		Batch INT,
--     Department INT,
--     contact INT,
--     RegisterationStatus BOOLEAN,
--     Dietary_preferences INT


-- Create FamilyMembers table
CREATE TABLE FamilyMembers (
    familyId INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255),
    cnic INT,
    contact INT,
    FOREIGN KEY (user_id) REFERENCES `User`(UserId)
);

-- Create FoodItems table
CREATE TABLE FoodItems (
    FoodId INT AUTO_INCREMENT PRIMARY KEY,
    FoodName VARCHAR(255),
    FoodItem VARCHAR(255),
    Votes INT
);

-- Create Performance_Proposals table
CREATE TABLE Performance_Proposals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Performance_Type INT,
    performanceDescription VARCHAR(255),
    Duration INT,
    Performance_file VARCHAR(255),
    AdditionalRequirements VARCHAR(255),
    Votes INT,
    FOREIGN KEY (UserID) REFERENCES `User`(UserId)
);

-- Create Volunteers table
CREATE TABLE Volunteers (
    VolunteerId INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    Task INT,
    FOREIGN KEY (userID) REFERENCES `User`(UserId)
);

-- login 
CREATE TABLE student_credential (
    rollNo INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(100)
);
select*from student_credential;

SELECT * FROM student_credential WHERE email = 'example@email.com' AND password = 'password123';

select * from student_credential;
insert into student_credential (rollNo, name, email, password)
values (123, 'zeeshan', 'shan@gmail.com', '1234');


