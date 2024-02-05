CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `image`;