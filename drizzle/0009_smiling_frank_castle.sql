CREATE TABLE `diets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `diets_id` PRIMARY KEY(`id`),
	CONSTRAINT `diets_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `diets` ADD CONSTRAINT `diets_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;