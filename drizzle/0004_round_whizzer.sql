CREATE TABLE `email_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_templates_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_templates_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `consultation_requests` ADD `privacyConsent` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `consultation_requests` ADD `privacyConsentDate` timestamp;