ALTER TABLE `blog_comments` ADD `parentId` int;--> statement-breakpoint
ALTER TABLE `blog_comments` ADD `isAdminReply` boolean DEFAULT false NOT NULL;