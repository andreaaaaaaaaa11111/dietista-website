ALTER TABLE `diets` DROP INDEX `diets_userId_unique`;--> statement-breakpoint
ALTER TABLE `diets` ADD `version` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `diets` ADD `isActive` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `diets` ADD `viewedAt` timestamp;