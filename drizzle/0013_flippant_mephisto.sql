CREATE TABLE `body_measurements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`weight` int,
	`waist` int,
	`hips` int,
	`chest` int,
	`arm` int,
	`thigh` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `body_measurements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `food_diary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`mealType` enum('colazione','spuntino_mattina','pranzo','spuntino_pomeriggio','cena') NOT NULL,
	`description` text NOT NULL,
	`calories` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `food_diary_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `body_measurements` ADD CONSTRAINT `body_measurements_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `food_diary` ADD CONSTRAINT `food_diary_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;