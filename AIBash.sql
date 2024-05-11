Create database AIBash;

use AIBash;

-- =====================TABLES CREATION=======================
CREATE TABLE Projects (
    ProjectId INT PRIMARY KEY AUTO_INCREMENT,
    ProjectDescription TEXT,
    ProjectStatus VARCHAR(50),
    BelongingStatus VARCHAR(50),
    UserId INT,
    FOREIGN KEY (UserId) REFERENCES Subscribers(UserId)
);

CREATE TABLE Categories (
    CategoryId INT PRIMARY KEY AUTO_INCREMENT,
    CategoryName VARCHAR(100)
);

-- ProjectsCategories table for the many-to-many relationship between Project and Category
CREATE TABLE ProjectsCategories (
    ProjectId INT,
    CategoryId INT,
    PRIMARY KEY (ProjectId, CategoryId),
    FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId),
    FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId)
);

CREATE TABLE Subscribers (
    UserId INT PRIMARY KEY AUTO_INCREMENT,
    UserName VARCHAR(100),
    Email VARCHAR(100),
    ContactNumber VARCHAR(20),
    Address TEXT,
    Degree VARCHAR(100),
    GraduationYear INT,
    SubscriptionDate DATE,
    password VARCHAR(100)
);

CREATE TABLE BugReports (
    BugId INT PRIMARY KEY AUTO_INCREMENT,
    BugDescription TEXT,
    DateFiled DATE,
    ProjectId INT,
    UserId INT,
    FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId),
    FOREIGN KEY (UserId) REFERENCES Subscribers(UserId)
);

CREATE TABLE ProjectDownloads (
    DownloadId INT PRIMARY KEY AUTO_INCREMENT,
    DateDownloaded DATE,
    ProjectId INT,
    UserId INT,
    FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId),
    FOREIGN KEY (UserId) REFERENCES Subscribers(UserId)
);

CREATE TABLE ProjectUpdates (
    UpdateId INT PRIMARY KEY AUTO_INCREMENT,
    UpdateName VARCHAR(100),
    UpdateStatus VARCHAR(50),
    UpdateDescription TEXT,
    UpdateType VARCHAR(50),
    ProjectId INT,
    UserId INT,
    FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId),
    FOREIGN KEY (UserId) REFERENCES Subscribers(UserId)
);

CREATE TABLE Transactions (
    TransactionId INT PRIMARY KEY AUTO_INCREMENT,
    TransactionDate DATE,
    ProjectId INT,
    UserId INT,
    FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId),
    FOREIGN KEY (UserId) REFERENCES Subscribers(UserId)
);

-- ======================= DATA INSERTION ============================

INSERT INTO Subscribers (UserName, Email, ContactNumber, Address, Degree, GraduationYear, SubscriptionDate, password)
VALUES 
('John Doe', 'john@example.com', '1234567890', '123 Main St, City', 'Computer Science', 2022, '2022-01-01', 'password123'),
('Alice Smith', 'alice@example.com', '9876543210', '456 Elm St, Town', 'Electrical Engineering', 2023, '2022-02-15', 'password456'),
('Bob Johnson', 'bob@example.com', '5555555555', '789 Oak St, Village', 'Mechanical Engineering', 2021, '2022-03-20', 'password789'),
('Emily Davis', 'emily@example.com', '1112223333', '101 Pine St, Hamlet', 'Civil Engineering', 2024, '2022-04-10', 'passwordabc'),
('Michael Wilson', 'michael@example.com', '9998887777', '202 Cedar St, Suburb', 'Chemical Engineering', 2022, '2022-05-05', 'passwordxyz');

INSERT INTO Projects (ProjectDescription, ProjectStatus, BelongingStatus, UserId)
VALUES 
('Project 1 Description', 'D', 'AI', 1),
('Project 2 Description', 'P', 'DS', 2),
('Project 3 Description', 'D', 'SE', 3),
('Project 4 Description', 'P', 'CS', 4),
('Project 5 Description', 'D', 'AI', 5);

INSERT INTO Categories (CategoryName)
VALUES 
('Algorithms'),
('ML-Models'),
('Computing'),
('DSA-Implementation');

INSERT INTO ProjectsCategories (ProjectId, CategoryId)
VALUES 
(1, 1),
(1, 2),
(2, 2),
(2, 3),
(3, 3),
(3, 4),
(4, 1),
(4, 4),
(5, 1),
(5, 2);

INSERT INTO BugReports (BugDescription, DateFiled, ProjectId, UserId)
VALUES 
('Bug 1 Description', '2022-01-05', 1, 1),
('Bug 2 Description', '2022-02-10', 2, 2),
('Bug 3 Description', '2022-03-15', 3, 3),
('Bug 4 Description', '2022-04-20', 4, 4),
('Bug 5 Description', '2022-05-25', 5, 5);

INSERT INTO ProjectDownloads (DateDownloaded, ProjectId, UserId)
VALUES 
('2022-01-01', 1, 1),
('2022-02-02', 2, 2),
('2022-03-03', 3, 3),
('2022-04-04', 4, 4),
('2022-05-05', 5, 5);

INSERT INTO ProjectUpdates (UpdateName, UpdateStatus, UpdateDescription, UpdateType, ProjectId, UserId)
VALUES 
('Update 1', 'Push', 'Update 1 Description', 'alpha', 1, 1),
('Update 2', 'Push', 'Update 2 Description', 'beta', 2, 2),
('Update 3', 'Update', 'Update 3 Description', 'charlie', 3, 3),
('Update 4', 'Push', 'Update 4 Description', 'alpha', 4, 4),
('Update 5', 'Update', 'Update 5 Description', 'beta', 5, 5);

INSERT INTO Transactions (TransactionDate, ProjectId, UserId)
VALUES 
('2022-01-01', 1, 1),
('2022-02-02', 2, 2),
('2022-03-03', 3, 3),
('2022-04-04', 4, 4),
('2022-05-05', 5, 5);


select * from Subscribers;
SELECT * FROM Subscribers
WHERE UserId IN (
    SELECT DISTINCT UserId
    FROM Transactions
    WHERE ProjectId = 1
);

SELECT * FROM Transactions
WHERE UserId = 1;


-- =============================== QUERIES ===============================
select * from categories;

-- Retrieve Projects along with their Categories
SELECT p.ProjectId, p.ProjectDescription, p.ProjectStatus, p.BelongingStatus, 
       GROUP_CONCAT(c.CategoryName SEPARATOR ', ') AS Categories
FROM Projects p
JOIN ProjectsCategories pc ON p.ProjectId = pc.ProjectId
JOIN Categories c ON pc.CategoryId = c.CategoryId
GROUP BY p.ProjectId;

-- Count the number of Bug Reports filed by each Subscriber
SELECT s.UserName, COUNT(br.BugId) AS BugReportsCount
FROM Subscribers s LEFT JOIN BugReports br ON s.UserId = br.UserId GROUP BY s.UserName;

-- List Subscribers who downloaded Projects after a specific date
SELECT s.UserName, pd.DateDownloaded, p.ProjectDescription
FROM Subscribers s
JOIN ProjectDownloads pd ON s.UserId = pd.UserId
JOIN Projects p ON pd.ProjectId = p.ProjectId
WHERE pd.DateDownloaded > '2022-03-01';

-- Retrieve Projects with their latest Update
SELECT p.ProjectDescription, pu.UpdateName, pu.UpdateStatus, pu.UpdateDescription, pu.UpdateType
FROM Projects p
JOIN ProjectUpdates pu ON p.ProjectId = pu.ProjectId
WHERE pu.UpdateId = ( SELECT MAX(UpdateId) FROM ProjectUpdates WHERE ProjectId = p.ProjectId );

-- Find Projects with more than one Category
SELECT p.ProjectDescription, COUNT(pc.CategoryId) AS CategoryCount
FROM Projects p
JOIN ProjectsCategories pc ON p.ProjectId = pc.ProjectId
GROUP BY p.ProjectId HAVING COUNT(pc.CategoryId) > 1;

