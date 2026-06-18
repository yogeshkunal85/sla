

INSERT INTO `agents` (`id`, `name`, `email`, `created_at`) VALUES
(1, 'Rahul Kashyap', 'rahul@example.com', '2026-06-17 18:35:15'),
(2, 'Krishan Gopal', 'krishan@example.com', '2026-06-17 18:35:15'),
(3, 'Mohit Singh', 'mohit@example.com', '2026-06-17 18:35:15');

INSERT INTO `tickets` (
    `id`, `subject`, `description`, `priority`, `status`,
    `assigned_agent_id`, `sla_due_at`, `is_escalated`,
    `created_at`, `updated_at`, `resolved_at`, `customer_email`
) VALUES
(1, 'r', 'Customer reports intermittent 500 errors on the checkout API since this morning. Needs immediate triage.', 'urgent', 'open', NULL, '2026-06-17 23:06:59', 0, '2026-06-17 15:36:59', '2026-06-18 06:51:42', NULL, NULL),
(2, 'Customer unable to log in — account locked', 'User locked out after multiple failed login attempts triggered by a password manager bug. Needs urgent unlock.', 'urgent', 'in_progress', 1, '2026-06-18 00:17:31', 0, '2026-06-17 16:47:31', '2026-06-18 06:36:22', NULL, NULL),
(3, 'Billing discrepancy on latest invoice', 'Customer was charged twice for the same subscription period. Needs investigation and refund if confirmed.', 'high', 'open', 1, '2026-06-18 06:07:42', 0, '2026-06-17 16:37:42', '2026-06-17 18:37:42', NULL, NULL),
(4, 'Data export feature failing for large datasets', 'Export times out for accounts with more than 50k records. Engineering is investigating a streaming fix.', 'high', 'in_progress', 2, '2026-06-18 05:07:48', 0, '2026-06-17 15:37:48', '2026-06-17 18:37:48', NULL, NULL),
(5, 'Request to add custom field to reporting dashboard', 'Customer would like a custom field added to their analytics dashboard export. Low urgency feature request.', 'medium', 'resolved', NULL, '2026-06-18 20:07:54', 0, '2026-06-17 14:37:54', '2026-06-18 07:11:53', '2026-06-18 12:41:53', NULL),
(6, 'Password reset email not arriving', 'Customer reported delayed password reset emails. Root cause found to be a delayed email queue; issue resolved.', 'medium', 'resolved', 3, '2026-06-17 22:08:02', 0, '2026-06-16 16:38:02', '2026-06-17 18:38:02', NULL, NULL),
(7, 'General question about API rate limits', 'Customer asked for clarification on rate limit headers returned by the public API.', 'low', 'open', NULL, '2026-06-20 12:08:06', 0, '2026-06-17 06:38:06', '2026-06-17 18:38:06', NULL, NULL),
(8, 'Typo in welcome email template', 'Customer pointed out a typo in the onboarding welcome email. Fixed and confirmed by customer.', 'low', 'closed', 1, '2026-06-17 14:08:11', 0, '2026-06-14 10:38:11', '2026-06-17 18:38:11', NULL, NULL),
(9, 'fdf', 'sdfsdf', 'medium', 'closed', 1, NULL, 0, '2026-06-18 06:53:28', '2026-06-18 07:11:45', NULL, 'deo@gmail.com');

INSERT INTO `ticket_comments` (`id`, `ticket_id`, `author`, `comment`, `created_at`, `author_type`, `author_id`) VALUES
(1, 2, NULL, 'ddd', '2026-06-18 06:31:50', 'customer', NULL);

SET FOREIGN_KEY_CHECKS = 1;
