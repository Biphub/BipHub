DROP TABLE IF EXISTS `Users`;
DROP TABLE IF EXISTS `PodAuths`;
DROP TABLE IF EXISTS `Pipelines`;
DROP TABLE IF EXISTS `Fields`;
DROP TABLE IF EXISTS `Actions`;
DROP TABLE IF EXISTS `Pods`;
DROP TABLE IF EXISTS `Pods`;
CREATE TABLE IF NOT EXISTS `Pods` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(255), `title` VARCHAR(255), `description` VARCHAR(255), `url` VARCHAR(255), `stage` TEXT, `icon` VARCHAR(255), `styles` JSONB, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
PRAGMA INDEX_LIST(`Pods`);
DROP TABLE IF EXISTS `Actions`;
CREATE TABLE IF NOT EXISTS `Actions` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `title` VARCHAR(255), `description` VARCHAR(255), `docRef` VARCHAR(255), `styles` JSONB, `trigger` TEXT, `imports` JSONB, `exports` JSONB, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `PodId` INTEGER REFERENCES `Pods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE);
PRAGMA INDEX_LIST(`Actions`);
DROP TABLE IF EXISTS `Fields`;
CREATE TABLE IF NOT EXISTS `Fields` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `title` VARCHAR(255), `properties` JSONB, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
PRAGMA INDEX_LIST(`Fields`);
DROP TABLE IF EXISTS `Pipelines`;
CREATE TABLE IF NOT EXISTS `Pipelines` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `title` VARCHAR(255), `description` VARCHAR(255), `entryApp` VARCHAR(255), `entryType` TEXT, `sequence` JSONB, `nodes` JSONB, `edges` JSONB, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
PRAGMA INDEX_LIST(`Pipelines`);
DROP TABLE IF EXISTS `PodAuths`;
CREATE TABLE IF NOT EXISTS `PodAuths` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `strategyType` TEXT, `properties` JSONB, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `PodId` INTEGER REFERENCES `Pods` (`id`) ON DELETE SET NULL ON UPDATE CASCADE);
PRAGMA INDEX_LIST(`PodAuths`);
DROP TABLE IF EXISTS `Users`;
CREATE TABLE IF NOT EXISTS `Users` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `email` VARCHAR(255), `password` VARCHAR(255), `passwordResetToken` VARCHAR(255), `passwordResetExpires` DATETIME, `facebook` VARCHAR(255), `firstName` VARCHAR(255), `lastName` VARCHAR(255), `gender` VARCHAR(255), `location` VARCHAR(255), `website` VARCHAR(255), `picture` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
PRAGMA INDEX_LIST(`Users`);