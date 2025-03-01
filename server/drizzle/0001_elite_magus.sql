ALTER TABLE `categories` ADD `user_id` integer REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `display_name`;