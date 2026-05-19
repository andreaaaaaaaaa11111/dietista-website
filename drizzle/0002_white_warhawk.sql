CREATE TABLE `consultation_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`serviceId` int,
	`name` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`age` int,
	`weight` int,
	`height` int,
	`goal` text,
	`medicalConditions` text,
	`allergies` text,
	`currentDiet` text,
	`message` text,
	`status` enum('new','contacted','scheduled','completed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consultation_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `appointments`;--> statement-breakpoint
DROP TABLE `availability_slots`;--> statement-breakpoint
ALTER TABLE `consultation_requests` ADD CONSTRAINT `consultation_requests_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `consultation_requests` ADD CONSTRAINT `consultation_requests_serviceId_services_id_fk` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE no action ON UPDATE no action;