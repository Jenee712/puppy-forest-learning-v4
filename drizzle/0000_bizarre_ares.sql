CREATE TABLE `children` (
	`id` text PRIMARY KEY NOT NULL,
	`family_id` text NOT NULL,
	`nickname` text NOT NULL,
	`birth_year` integer,
	`current_grade` text DEFAULT 'G1' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`family_id`) REFERENCES `families`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `entitlements` (
	`family_id` text NOT NULL,
	`grade` text NOT NULL,
	`source` text NOT NULL,
	`order_id` text,
	`unlocked_at` integer NOT NULL,
	PRIMARY KEY(`family_id`, `grade`),
	FOREIGN KEY (`family_id`) REFERENCES `families`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `families` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`plan` text DEFAULT 'single' NOT NULL,
	`paid_amount` real DEFAULT 0 NOT NULL,
	`ai_credits` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `families_email_unique` ON `families` (`email`);--> statement-breakpoint
CREATE TABLE `learning_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`child_id` text NOT NULL,
	`grade` text NOT NULL,
	`subject` text NOT NULL,
	`knowledge_point` text NOT NULL,
	`mastery` integer DEFAULT 0 NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`correct_attempts` integer DEFAULT 0 NOT NULL,
	`next_review_at` integer,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`family_id` text NOT NULL,
	`product` text NOT NULL,
	`amount` real NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`provider_reference` text,
	`created_at` integer NOT NULL,
	`paid_at` integer,
	FOREIGN KEY (`family_id`) REFERENCES `families`(`id`) ON UPDATE no action ON DELETE no action
);
