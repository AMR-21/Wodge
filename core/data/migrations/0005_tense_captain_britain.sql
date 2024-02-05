ALTER TABLE user ADD `isVerified` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `profile` DROP COLUMN `is_completed`;