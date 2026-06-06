SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS group_buy DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE group_buy;

CREATE TABLE IF NOT EXISTS `user` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(50) NOT NULL,
  `role` ENUM('leader', 'member') NOT NULL DEFAULT 'member',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `purchase_group` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `leader_id` INT NOT NULL,
  `product_name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(500),
  `price` DECIMAL(10,2) NOT NULL,
  `target_count` INT NOT NULL,
  `stock` INT NOT NULL,
  `remaining_stock` INT NOT NULL,
  `deadline` DATETIME NOT NULL,
  `status` ENUM('active', 'success', 'failed', 'closed') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_leader_id` (`leader_id`),
  INDEX `idx_status_deadline` (`status`, `deadline`),
  CONSTRAINT `fk_group_leader` FOREIGN KEY (`leader_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `order` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `group_id` INT NOT NULL,
  `member_id` INT NOT NULL,
  `member_phone` VARCHAR(20) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('pending', 'paid', 'payment_failed', 'refunded', 'cancelled') NOT NULL DEFAULT 'pending',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_group_id` (`group_id`),
  INDEX `idx_member_id` (`member_id`),
  INDEX `idx_status` (`status`),
  CONSTRAINT `fk_order_group` FOREIGN KEY (`group_id`) REFERENCES `purchase_group`(`id`),
  CONSTRAINT `fk_order_member` FOREIGN KEY (`member_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB;

INSERT INTO `user` (`phone`, `name`, `role`) VALUES
  ('13800001111', '张团长', 'leader'),
  ('13800002222', '李团员', 'member'),
  ('13800003333', '王团员', 'member'),
  ('13800004444', '赵团员', 'member'),
  ('13800005555', '刘团员', 'member');

INSERT INTO `purchase_group` (`leader_id`, `product_name`, `description`, `image_url`, `price`, `target_count`, `stock`, `remaining_stock`, `deadline`, `status`) VALUES
  (1, '飞鹤星飞帆3段奶粉', '社区拼团价，正品保障，限时抢购', '', 198.00, 10, 15, 12, DATE_ADD(NOW(), INTERVAL 2 DAY), 'active'),
  (1, '惠氏启赋3段奶粉', '进口品质，拼团更优惠', '', 268.00, 8, 10, 10, DATE_ADD(NOW(), INTERVAL 1 DAY), 'active');

INSERT INTO `order` (`group_id`, `member_id`, `member_phone`, `quantity`, `total_amount`, `status`) VALUES
  (1, 2, '13800002222', 1, 198.00, 'pending'),
  (1, 3, '13800003333', 1, 198.00, 'pending'),
  (1, 4, '13800004444', 1, 198.00, 'pending');
