CREATE TABLE `app_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `app_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `app_settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
ALTER TABLE `consultation_requests` MODIFY COLUMN `status` enum('pending_verification','new','contacted','scheduled','completed') NOT NULL DEFAULT 'pending_verification';--> statement-breakpoint
ALTER TABLE `consultation_requests` ADD `emailVerified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `consultation_requests` ADD `verificationToken` varchar(64);--> statement-breakpoint
ALTER TABLE `consultation_requests` ADD `verifiedAt` timestamp;