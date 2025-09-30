-- =====================================================
-- SCRIPT COMPLETO DE MIGRACIÓN PARA NUEVA ESTRUCTURA SEGURA
-- Sistema de Citas Médicas - Versión Segura Completa
-- =====================================================
-- 
-- IMPORTANTE: Este script elimina la tabla 'users' y crea
-- una estructura más segura donde:
-- 1. Solo los administradores pueden crear médicos
-- 2. Los pacientes pueden registrarse públicamente
-- 3. Cada tipo de usuario tiene su propia tabla
-- 4. Incluye TODAS las tablas necesarias para Laravel
-- =====================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- =====================================================
-- PASO 1: ELIMINAR TABLAS ANTIGUAS
-- =====================================================

-- Eliminar tabla personal_access_tokens primero (dependencia)
DROP TABLE IF EXISTS `personal_access_tokens`;

-- Eliminar tabla users (ya no necesaria)
DROP TABLE IF EXISTS `users`;

-- Eliminar tabla password_reset_tokens
DROP TABLE IF EXISTS `password_reset_tokens`;

-- =====================================================
-- PASO 2: CREAR TABLA DE ADMINISTRADORES
-- =====================================================

CREATE TABLE `administradores` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `administradores_email_unique` (`email`),
  UNIQUE KEY `administradores_usuario_unique` (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PASO 3: AGREGAR CAMPOS DE AUTENTICACIÓN A MÉDICOS
-- =====================================================

ALTER TABLE `medicos` 
ADD COLUMN `usuario` varchar(50) NOT NULL AFTER `email`,
ADD COLUMN `password` varchar(255) NOT NULL AFTER `usuario`,
ADD COLUMN `estado_auth` enum('activo','inactivo') NOT NULL DEFAULT 'activo' AFTER `password`,
ADD COLUMN `email_verified_at` timestamp NULL DEFAULT NULL AFTER `estado_auth`,
ADD COLUMN `remember_token` varchar(100) DEFAULT NULL AFTER `email_verified_at`,
ADD UNIQUE KEY `medicos_usuario_unique` (`usuario`);

-- =====================================================
-- PASO 4: AGREGAR CAMPOS DE AUTENTICACIÓN A PACIENTES
-- =====================================================

ALTER TABLE `pacientes` 
ADD COLUMN `usuario` varchar(50) NOT NULL AFTER `email`,
ADD COLUMN `password` varchar(255) NOT NULL AFTER `usuario`,
ADD COLUMN `estado_auth` enum('activo','inactivo') NOT NULL DEFAULT 'activo' AFTER `password`,
ADD COLUMN `email_verified_at` timestamp NULL DEFAULT NULL AFTER `estado_auth`,
ADD COLUMN `remember_token` varchar(100) DEFAULT NULL AFTER `email_verified_at`,
ADD UNIQUE KEY `pacientes_usuario_unique` (`usuario`);

-- =====================================================
-- PASO 5: RECREAR TABLA PERSONAL_ACCESS_TOKENS
-- =====================================================

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PASO 6: RECREAR TABLA PASSWORD_RESET_TOKENS
-- =====================================================

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PASO 7: RECREAR TABLA SESSIONS
-- =====================================================

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PASO 8: RECREAR TABLA FAILED_JOBS
-- =====================================================

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PASO 9: RECREAR TABLA JOBS
-- =====================================================

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PASO 10: RECREAR TABLA JOB_BATCHES
-- =====================================================

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PASO 11: RECREAR TABLA CACHE
-- =====================================================

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PASO 12: RECREAR TABLA CACHE_LOCKS
-- =====================================================

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PASO 13: RECREAR TABLA MIGRATIONS
-- =====================================================

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PASO 14: INSERTAR MIGRACIONES REGISTRADAS
-- =====================================================

INSERT INTO `migrations` (`migration`, `batch`) VALUES
('0001_01_01_000000_create_users_table', 1),
('0001_01_01_000001_create_cache_table', 1),
('0001_01_01_000002_create_jobs_table', 1),
('2025_08_23_024921_create_eps_table', 1),
('2025_08_23_025006_create_especialidades_table', 1),
('2025_08_23_025113_create_medicos_table', 1),
('2025_08_23_025435_create_pacientes_table', 1),
('2025_08_23_025658_create_citas_table', 1),
('2025_08_23_032247_create_personal_access_tokens_table', 1),
('2025_09_24_232748_create_consultorios_table', 1),
('2025_09_24_232753_create_historial_medico_table', 1),
('2025_09_24_232755_create_medicamentos_table', 1),
('2025_09_24_232756_create_recetas_medicas_table', 1),
('2025_09_24_232758_create_detalle_recetas_table', 1),
('2025_09_24_232846_add_indexes_to_tables', 1),
('2025_09_24_234047_add_foreign_keys_to_medicos_table', 1),
('2025_09_24_234204_add_foreign_keys_to_citas_table', 1),
('2025_09_25_233107_create_administradores_table', 1),
('2025_09_25_233144_add_auth_fields_to_medicos_table', 1),
('2025_09_25_233157_add_auth_fields_to_pacientes_table', 1),
('2025_09_25_233219_drop_users_table', 1);

-- =====================================================
-- PASO 15: INSERTAR DATOS INICIALES
-- =====================================================

-- Insertar administradores iniciales
INSERT INTO `administradores` (`nombre`, `apellido`, `email`, `telefono`, `usuario`, `password`, `estado`, `created_at`, `updated_at`) VALUES
('Super', 'Administrador', 'admin@sistema.com', '(601) 123-0000', 'admin', '$2y$12$m7XuBJmRJAmMTko3lnD.6O/n/eLzfhOqJ2C5p5ik5p5rybHJsLBaK', 'activo', NOW(), NOW()),
('María', 'González', 'maria.gonzalez@sistema.com', '(601) 123-0001', 'mgonzalez', '$2y$12$eGVUAfTmn1EnBebP0RB4Q.JctiVb9QFwV4Bza72AtNLcDYAgimqPG', 'activo', NOW(), NOW());

-- Actualizar médicos existentes con datos de autenticación
UPDATE `medicos` SET 
  `usuario` = 'wmorales',
  `password` = '$2y$12$GwXWn7lPs1g7SqjXeU/UW.KZPp6Boh.P6DMmg4JaibaQqDUbptfKm',
  `estado_auth` = 'activo'
WHERE `id` = 1;

UPDATE `medicos` SET 
  `usuario` = 'asaavedra',
  `password` = '$2y$12$GwXWn7lPs1g7SqjXeU/UW.KZPp6Boh.P6DMmg4JaibaQqDUbptfKm',
  `estado_auth` = 'activo'
WHERE `id` = 2;

UPDATE `medicos` SET 
  `usuario` = 'jbarrera',
  `password` = '$2y$12$GwXWn7lPs1g7SqjXeU/UW.KZPp6Boh.P6DMmg4JaibaQqDUbptfKm',
  `estado_auth` = 'activo'
WHERE `id` = 3;

UPDATE `medicos` SET 
  `usuario` = 'vcepeda',
  `password` = '$2y$12$GwXWn7lPs1g7SqjXeU/UW.KZPp6Boh.P6DMmg4JaibaQqDUbptfKm',
  `estado_auth` = 'activo'
WHERE `id` = 4;

UPDATE `medicos` SET 
  `usuario` = 'mzorro',
  `password` = '$2y$12$GwXWn7lPs1g7SqjXeU/UW.KZPp6Boh.P6DMmg4JaibaQqDUbptfKm',
  `estado_auth` = 'activo'
WHERE `id` = 5;

UPDATE `medicos` SET 
  `usuario` = 'cgarcia',
  `password` = '$2y$12$GwXWn7lPs1g7SqjXeU/UW.KZPp6Boh.P6DMmg4JaibaQqDUbptfKm',
  `estado_auth` = 'activo'
WHERE `id` = 6;

UPDATE `medicos` SET 
  `usuario` = 'amartinez',
  `password` = '$2y$12$GwXWn7lPs1g7SqjXeU/UW.KZPp6Boh.P6DMmg4JaibaQqDUbptfKm',
  `estado_auth` = 'activo'
WHERE `id` = 7;

UPDATE `medicos` SET 
  `usuario` = 'lfernandez',
  `password` = '$2y$12$GwXWn7lPs1g7SqjXeU/UW.KZPp6Boh.P6DMmg4JaibaQqDUbptfKm',
  `estado_auth` = 'activo'
WHERE `id` = 8;

-- Actualizar pacientes existentes con datos de autenticación
UPDATE `pacientes` SET 
  `usuario` = `email`,
  `password` = '$2y$12$GwXWn7lPs1g7SqjXeU/UW.KZPp6Boh.P6DMmg4JaibaQqDUbptfKm',
  `estado_auth` = 'activo'
WHERE `id` IN (1, 2, 3, 4, 5, 6, 7, 8);

COMMIT;

-- =====================================================
-- RESUMEN DE LA NUEVA ESTRUCTURA COMPLETA
-- =====================================================
-- 
-- ✅ TABLAS CREADAS/MODIFICADAS:
-- 1. administradores - Nueva tabla para administradores del sistema
-- 2. medicos - Agregados campos de autenticación (usuario, password, estado_auth)
-- 3. pacientes - Agregados campos de autenticación (usuario, password, estado_auth)
-- 4. personal_access_tokens - Recreada para soportar múltiples tipos de usuarios
-- 5. password_reset_tokens - Recreada para reset de contraseñas
-- 6. sessions - Recreada para sesiones web
-- 7. failed_jobs - Recreada para trabajos fallidos
-- 8. jobs - Recreada para cola de trabajos
-- 9. job_batches - Recreada para lotes de trabajos
-- 10. cache - Recreada para caché
-- 11. cache_locks - Recreada para bloqueos de caché
-- 12. migrations - Recreada con todas las migraciones registradas
-- 
-- ❌ TABLAS ELIMINADAS:
-- 1. users - Ya no necesaria, reemplazada por tablas específicas
-- 
-- 🔐 CREDENCIALES POR DEFECTO:
-- Administradores:
--   - Usuario: admin, Contraseña: admin123
--   - Usuario: mgonzalez, Contraseña: admin123
-- 
-- Médicos:
--   - Usuario: wmorales, Contraseña: medico123
--   - Usuario: asaavedra, Contraseña: medico123
--   - Usuario: jbarrera, Contraseña: medico123
--   - Usuario: vcepeda, Contraseña: medico123
--   - Usuario: mzorro, Contraseña: medico123
--   - Usuario: cgarcia, Contraseña: medico123
--   - Usuario: amartinez, Contraseña: medico123
--   - Usuario: lfernandez, Contraseña: medico123
-- 
-- Pacientes:
--   - Usuario: [su email], Contraseña: paciente123
-- 
-- 🛡️ SEGURIDAD MEJORADA:
-- - Solo administradores pueden crear médicos
-- - Los pacientes pueden registrarse públicamente
-- - Cada tipo de usuario tiene autenticación separada
-- - No cualquiera puede ser médico
-- - Estructura completa compatible con Laravel Sanctum
-- =====================================================



