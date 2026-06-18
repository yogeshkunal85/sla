Version 9.4.0

CREATE DATABASE IF NOT EXISTS sla;
USE sla;

CREATE TABLE agents (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,        
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE tickets (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    subject           VARCHAR(255) NOT NULL,
    description       TEXT NOT NULL,
    priority          ENUM('low','medium','high','urgent') NOT NULL,
    status            ENUM('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
    assigned_agent_id INT NULL,
    sla_due_at        DATETIME NOT NULL,
    is_escalated      TINYINT(1) NOT NULL DEFAULT 0,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_tickets_agent
        FOREIGN KEY (assigned_agent_id)
        REFERENCES agents(id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE tickets
ADD INDEX idx_ticket_status (status),
ADD INDEX idx_ticket_sla_due (sla_due_at),
ADD INDEX idx_ticket_status_sla (status, sla_due_at),
ADD INDEX idx_ticket_priority (priority),
ADD INDEX idx_ticket_agent (assigned_agent_id);


CREATE TABLE ticket_comments (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id  INT NOT NULL,
    author     VARCHAR(100) NOT NULL,
    message    TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comments_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES tickets(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE INDEX idx_comment_ticket
    ON ticket_comments(ticket_id);



    CREATE TABLE sla_events (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id  INT NOT NULL,
    event_type ENUM('warning','breached','escalated') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sla_events_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES tickets(id)
        ON DELETE CASCADE,

    UNIQUE KEY uq_sla_event (ticket_id, event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_sla_event_ticket
    ON sla_events(ticket_id);


ALTER TABLE ticket_comments
CHANGE COLUMN message comment TEXT NOT NULL;
    ALTER TABLE ticket_comments
ADD COLUMN author_type ENUM('agent','customer') NOT NULL,
ADD COLUMN author_id INT  NULL;

