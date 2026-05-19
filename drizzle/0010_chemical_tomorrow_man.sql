ALTER TABLE `diets` ADD `pdfUrl` text NOT NULL;--> statement-breakpoint
ALTER TABLE `diets` ADD `fileKey` text NOT NULL;--> statement-breakpoint
ALTER TABLE `diets` ADD `fileName` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `diets` ADD `fileSize` int NOT NULL;--> statement-breakpoint
ALTER TABLE `diets` DROP COLUMN `content`;--> statement-breakpoint
ALTER TABLE `diets` DROP COLUMN `notes`;