ALTER TABLE profile ADD `username` text;--> statement-breakpoint
ALTER TABLE profile ADD `is_completed` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE user ADD `name` text;--> statement-breakpoint
ALTER TABLE user ADD `image` text;--> statement-breakpoint
CREATE UNIQUE INDEX `profile_username_unique` ON `profile` (`username`);--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `hasProfile`;