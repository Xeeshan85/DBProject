-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'KITa-@2247493$';
create database FareWell;
-- drop database farewell;
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


CREATE TABLE Users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100),
    Password TEXT,
    UserType ENUM('student', 'teacher', 'admin') DEFAULT 'student'
);

CREATE TABLE Tasks (
	TaskId INT AUTO_INCREMENT PRIMARY KEY,
    Name varchar(100),
    Description text
);
insert into Tasks (Name, Description) values ('Food', 'Volunteer will be responsible for food quality.');

CREATE TABLE StudentTasks (
    UserId INT,
    TaskId INT,
    PRIMARY KEY (UserId, TaskId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (TaskId) REFERENCES Tasks(TaskId)
);

CREATE TABLE DinnerItems (
    ItemId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    Description TEXT
);
INSERT INTO DinnerItems (Name, Description) values ('Nihari', 'Pakistani Dish');
INSERT INTO DinnerItems (Name, Description) values ('Biryani', 'Pakistans Special');


CREATE TABLE DinnerVotes (
    UserId INT,
    ItemId INT,
    PRIMARY KEY (UserId, ItemId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (ItemId) REFERENCES DinnerItems(ItemId)
);

CREATE TABLE Proposals (
    ProposalId INT AUTO_INCREMENT PRIMARY KEY,
    ProposalType VARCHAR(100),
    Description TEXT,
    Duration INT,
    AdditionalRequirements TEXT
);
INSERT INTO Proposals (ProposalType, Description, Duration, AdditionalRequirements) 
VALUES 
('Dance Performance', 'A group dance performance showcasing different dance forms.', 30, 'Requires a stage and music system.'),
('Music Performance', 'Live music performance by students showcasing various musical talents.', 40, 'Requires musical instruments and audio setup.');


CREATE TABLE ProposalVotes (
    UserId INT,
    ProposalId INT,
    PRIMARY KEY (UserId, ProposalId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (ProposalId) REFERENCES Proposals(ProposalId)
);



select * from DinnerItems;





SELECT Tasks.Name, Tasks.Description
FROM StudentTasks
JOIN Tasks ON StudentTasks.TaskId = Tasks.TaskId
WHERE StudentTasks.UserId = 2;





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




