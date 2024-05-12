create database FareWell;
use FareWell;

CREATE TABLE Users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100),
    Password TEXT,
    UserType ENUM('student', 'teacher', 'admin') DEFAULT 'student'
);

CREATE TABLE Admins (
    UserId INT PRIMARY KEY,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);


CREATE TABLE Students (
    UserId INT PRIMARY KEY,
    RollNo varchar(10),
    Department VARCHAR(100),
    DietaryPreferences VARCHAR(100),
    RegistrationStatus BOOLEAN,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);


CREATE TABLE Teachers (
    UserId INT PRIMARY KEY,
    Department VARCHAR(100),
    DietaryPreferences VARCHAR(100),
    RegistrationStatus BOOLEAN,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE FamilyMembers (
	familyMemberId INT auto_increment PRIMARY KEY,
	UserId INT,
    Name varchar(100),
    Contact varchar(11),
    CNIC varchar(13),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);


select * from familymembers;


ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'KITa-@2247493$';

-- 		rollNo INT,
-- 		Batch INT,
--     Department INT,
--     contact INT,
--     RegisterationStatus BOOLEAN,
--     Dietary_preferences INT


-- Create FamilyMembers table
CREATE TABLE FamilyMembers (
    FamilyId INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT,
    Name VARCHAR(255),
    CNIC INT,
    Contact INT,
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


