-- =============================================
-- DATABASE: DataBizPro Platform
-- VERSION: 1.0.0
-- DESCRIPTION: Complete schema for Data & Business Services Platform
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 1. CORE TABLES
-- =============================================

-- Users table (Authentication & Profiles)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'client' 
        CHECK (role IN ('admin', 'staff', 'client')),
    phone VARCHAR(20),
    company_name VARCHAR(255),
    kra_pin VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Kenya',
    profile_image_url TEXT,
    
    -- Email verification
    email_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(255),
    verification_expires TIMESTAMP,
    
    -- Account status
    is_active BOOLEAN DEFAULT true,
    is_locked BOOLEAN DEFAULT false,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    
    -- Password reset
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    
    -- Two-factor authentication
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_password_change_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Soft delete
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- 2. DATA SERVICES MODULE
-- =============================================

-- Data service types
CREATE TABLE data_service_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    estimated_days INTEGER NOT NULL DEFAULT 3,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Data service requests
CREATE TABLE data_service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_type_id UUID NOT NULL REFERENCES data_service_types(id),
    
    -- Request details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    data_source VARCHAR(100),
    
    -- Service parameters
    urgency VARCHAR(20) DEFAULT 'normal' 
        CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
    complexity VARCHAR(20) DEFAULT 'medium'
        CHECK (complexity IN ('simple', 'medium', 'complex')),
    volume_size VARCHAR(20) DEFAULT 'small'
        CHECK (volume_size IN ('small', 'medium', 'large', 'enterprise')),
    
    -- Pricing
    quoted_price DECIMAL(10,2),
    final_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'KES',
    
    -- Status tracking
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'review', 'approved', 'in_progress', 'completed', 'cancelled', 'rejected')),
    priority INTEGER DEFAULT 5,
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE,
    
    -- Completion
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- Client feedback
    client_rating INTEGER CHECK (client_rating >= 1 AND client_rating <= 5),
    client_feedback TEXT,
    
    -- Internal notes
    internal_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Soft delete
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Data service deliverables
CREATE TABLE data_service_deliverables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES data_service_requests(id) ON DELETE CASCADE,
    
    -- Deliverable details
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('report', 'dataset', 'visualization', 'dashboard', 'code', 'documentation')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- File storage
    file_name VARCHAR(255),
    file_url TEXT,
    file_size BIGINT,
    file_type VARCHAR(50),
    
    -- Versioning
    version INTEGER DEFAULT 1,
    is_latest BOOLEAN DEFAULT true,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'in_progress', 'ready', 'delivered', 'archived')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 3. BUSINESS REGISTRATION MODULE
-- =============================================

-- Business registration requests
CREATE TABLE business_registration_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Business details
    registration_type VARCHAR(50) NOT NULL
        CHECK (registration_type IN ('sole_proprietor', 'partnership', 'ltd_company', 'plc', 'ngo', 'society')),
    business_name VARCHAR(255) NOT NULL,
    trading_name VARCHAR(255),
    business_type VARCHAR(100),
    
    -- Registration details
    registration_number VARCHAR(100) UNIQUE,
    kra_pin VARCHAR(20),
    nssf_number VARCHAR(50),
    nhif_number VARCHAR(50),
    
    -- Business address
    physical_address TEXT NOT NULL,
    postal_address TEXT,
    postal_code VARCHAR(20),
    county VARCHAR(100),
    town VARCHAR(100),
    
    -- Contact information
    business_email VARCHAR(255),
    business_phone VARCHAR(20),
    website VARCHAR(255),
    
    -- Business activities
    main_activity VARCHAR(255),
    secondary_activities TEXT[],
    
    -- Capital & ownership
    share_capital DECIMAL(15,2),
    ownership_structure JSONB, -- JSON array of owners with shares
    
    -- Status tracking
    status VARCHAR(50) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'review', 'name_search', 'reserved', 'documents_pending', 
                         'processing', 'approved', 'registered', 'rejected', 'cancelled')),
    
    -- Government tracking
    brs_tracking_number VARCHAR(100),
    kra_tracking_number VARCHAR(100),
    
    -- Important dates
    expected_completion_date DATE,
    registration_date DATE,
    renewal_date DATE,
    
    -- Pricing
    government_fees DECIMAL(10,2),
    service_fee DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    
    -- Notes
    notes TEXT,
    rejection_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Business owners/directors
CREATE TABLE business_owners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES business_registration_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    
    -- Owner details
    full_name VARCHAR(255) NOT NULL,
    id_number VARCHAR(50) NOT NULL,
    id_type VARCHAR(20) DEFAULT 'national_id'
        CHECK (id_type IN ('national_id', 'passport', 'alien_id')),
    passport_number VARCHAR(50),
    kra_pin VARCHAR(20),
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    
    -- Position & ownership
    position VARCHAR(100)
        CHECK (position IN ('director', 'shareholder', 'secretary', 'partner', 'proprietor')),
    share_percentage DECIMAL(5,2) CHECK (share_percentage >= 0 AND share_percentage <= 100),
    is_signatory BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 4. KRA SERVICES MODULE
-- =============================================

-- KRA service types
CREATE TABLE kra_service_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    base_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    government_fee DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- KRA service requests
CREATE TABLE kra_service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_type_id UUID NOT NULL REFERENCES kra_service_types(id),
    
    -- Taxpayer details
    taxpayer_name VARCHAR(255) NOT NULL,
    taxpayer_type VARCHAR(50)
        CHECK (taxpayer_type IN ('individual', 'company', 'partnership', 'trust')),
    id_number VARCHAR(50) NOT NULL,
    kra_pin VARCHAR(20),
    
    -- Service details
    tax_type VARCHAR(50)
        CHECK (tax_type IN ('income_tax', 'vat', 'paye', 'withholding', 'excise', 'customs')),
    period VARCHAR(20), -- e.g., '2024-01', '2023-2024'
    year INTEGER,
    
    -- Amounts
    tax_amount DECIMAL(15,2),
    penalty_amount DECIMAL(15,2),
    interest_amount DECIMAL(15,2),
    total_amount DECIMAL(15,2),
    
    -- Filing details
    filing_type VARCHAR(50)
        CHECK (filing_type IN ('initial', 'amendment', 'provisional', 'final')),
    due_date DATE,
    extended_due_date DATE,
    
    -- Status tracking
    status VARCHAR(50) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'review', 'processing', 'filed', 'approved', 
                         'payment_pending', 'completed', 'rejected', 'cancelled')),
    
    -- KRA references
    kra_reference VARCHAR(100),
    itax_acknowledgement VARCHAR(100),
    assessment_number VARCHAR(100),
    
    -- Compliance
    compliance_certificate_url TEXT,
    certificate_expiry DATE,
    
    -- Payment tracking
    payment_status VARCHAR(20) DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue')),
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    
    -- Important dates
    submitted_at TIMESTAMP WITH TIME ZONE,
    processed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Notes
    notes TEXT,
    rejection_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 5. BOOKKEEPING & AUDIT MODULE
-- =============================================

-- Bookkeeping service types
CREATE TABLE bookkeeping_service_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    base_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    frequency VARCHAR(20) DEFAULT 'monthly'
        CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bookkeeping engagements
CREATE TABLE bookkeeping_engagements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_type_id UUID NOT NULL REFERENCES bookkeeping_service_types(id),
    
    -- Engagement details
    engagement_type VARCHAR(50) NOT NULL
        CHECK (engagement_type IN ('bookkeeping', 'accounting', 'audit', 'tax_preparation', 'advisory')),
    frequency VARCHAR(20) DEFAULT 'monthly'
        CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'adhoc')),
    
    -- Period
    start_date DATE NOT NULL,
    end_date DATE,
    current_period VARCHAR(20),
    
    -- Business details
    business_size VARCHAR(20)
        CHECK (business_size IN ('micro', 'small', 'medium', 'large')),
    industry VARCHAR(100),
    turnover_estimate DECIMAL(15,2),
    
    -- Pricing
    monthly_retainer DECIMAL(10,2),
    setup_fee DECIMAL(10,2),
    additional_hourly_rate DECIMAL(10,2),
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'proposal', 'approved', 'active', 'suspended', 'completed', 'terminated')),
    
    -- Assignment
    primary_accountant UUID REFERENCES users(id),
    secondary_accountant UUID REFERENCES users(id),
    
    -- Important dates
    signed_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    
    -- Contract
    contract_url TEXT,
    terms_accepted BOOLEAN DEFAULT false,
    
    -- Notes
    special_instructions TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Financial documents
CREATE TABLE financial_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    engagement_id UUID REFERENCES bookkeeping_engagements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Document details
    document_type VARCHAR(50) NOT NULL
        CHECK (document_type IN ('bank_statement', 'invoice', 'receipt', 'payment_voucher', 
                                'payroll', 'tax_return', 'financial_statement', 'audit_report')),
    period VARCHAR(20),
    year INTEGER,
    month INTEGER,
    
    -- File details
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(50),
    
    -- Processing status
    status VARCHAR(20) DEFAULT 'uploaded'
        CHECK (status IN ('uploaded', 'processing', 'reviewed', 'approved', 'rejected')),
    
    -- Categorization
    category VARCHAR(100),
    subcategory VARCHAR(100),
    
    -- Amounts
    total_amount DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'KES',
    
    -- Metadata
    metadata JSONB,
    
    -- Verification
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Notes
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    uploaded_by UUID REFERENCES users(id)
);

-- Financial reports
CREATE TABLE financial_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    engagement_id UUID NOT NULL REFERENCES bookkeeping_engagements(id) ON DELETE CASCADE,
    
    -- Report details
    report_type VARCHAR(50) NOT NULL
        CHECK (report_type IN ('trial_balance', 'income_statement', 'balance_sheet', 
                              'cash_flow', 'management_accounts', 'audit_report')),
    period VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Report files
    report_url TEXT NOT NULL,
    file_format VARCHAR(20) DEFAULT 'pdf'
        CHECK (file_format IN ('pdf', 'excel', 'word', 'csv')),
    file_size BIGINT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'generating'
        CHECK (status IN ('generating', 'ready', 'published', 'archived')),
    
    -- Access control
    is_public BOOLEAN DEFAULT false,
    access_code VARCHAR(100),
    
    -- Generated by
    generated_by UUID REFERENCES users(id),
    
    -- Important dates
    generation_date DATE DEFAULT CURRENT_DATE,
    published_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 6. PAYMENTS MODULE
-- =============================================

-- Payment transactions
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Payment details
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'KES',
    description TEXT,
    
    -- Service reference
    service_type VARCHAR(50) NOT NULL
        CHECK (service_type IN ('data_service', 'business_registration', 'kra_service', 
                               'bookkeeping', 'subscription', 'other')),
    service_reference_id UUID, -- References specific service tables
    
    -- Payment method
    payment_method VARCHAR(50) NOT NULL
        CHECK (payment_method IN ('mpesa', 'card', 'bank_transfer', 'cash', 'cheque')),
    payment_gateway VARCHAR(50)
        CHECK (payment_gateway IN ('mpesa', 'stripe', 'pesapal', 'flutterwave')),
    
    -- Transaction details
    transaction_id VARCHAR(255) UNIQUE,
    merchant_request_id VARCHAR(255),
    checkout_request_id VARCHAR(255),
    
    -- M-Pesa specific
    mpesa_number VARCHAR(20),
    mpesa_receipt VARCHAR(100),
    
    -- Card specific
    card_last4 VARCHAR(4),
    card_brand VARCHAR(20),
    
    -- Bank transfer specific
    bank_name VARCHAR(100),
    bank_reference VARCHAR(100),
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'successful', 'failed', 'cancelled', 'refunded')),
    
    -- Invoice
    invoice_number VARCHAR(100) UNIQUE,
    invoice_url TEXT,
    
    -- Tax
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    tax_rate DECIMAL(5,2) DEFAULT 0.16, -- 16% VAT
    
    -- Metadata
    metadata JSONB,
    
    -- Important dates
    paid_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payment invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID UNIQUE REFERENCES payments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Invoice details
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    invoice_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    
    -- Client details
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(20),
    client_address TEXT,
    
    -- Items (stored as JSON array)
    items JSONB NOT NULL,
    
    -- Totals
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled')),
    
    -- Payment terms
    payment_terms VARCHAR(100),
    late_fee_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Notes
    notes TEXT,
    terms_and_conditions TEXT,
    
    -- Delivery
    sent_at TIMESTAMP WITH TIME ZONE,
    viewed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 7. DOCUMENTS MODULE
-- =============================================

-- Document storage
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Document details
    document_type VARCHAR(50) NOT NULL
        CHECK (document_type IN ('id_copy', 'passport_photo', 'business_plan', 'certificate',
                                'contract', 'report', 'invoice', 'receipt', 'other')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- File details
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    mime_type VARCHAR(100),
    
    -- Storage
    storage_provider VARCHAR(50) DEFAULT 's3'
        CHECK (storage_provider IN ('s3', 'local', 'google_drive', 'dropbox')),
    storage_path TEXT,
    
    -- Security
    is_encrypted BOOLEAN DEFAULT false,
    encryption_key TEXT,
    access_level VARCHAR(20) DEFAULT 'private'
        CHECK (access_level IN ('private', 'shared', 'public')),
    
    -- Sharing
    shared_with UUID[] DEFAULT '{}', -- Array of user IDs
    sharing_token VARCHAR(255),
    sharing_expires TIMESTAMP WITH TIME ZONE,
    
    -- Versioning
    version INTEGER DEFAULT 1,
    parent_document_id UUID REFERENCES documents(id),
    is_latest_version BOOLEAN DEFAULT true,
    
    -- Tags
    tags VARCHAR(100)[] DEFAULT '{}',
    
    -- Metadata
    metadata JSONB,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active'
        CHECK (status IN ('active', 'archived', 'deleted')),
    
    -- Expiry
    expiry_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    uploaded_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 8. NOTIFICATIONS MODULE
-- =============================================

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification details
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('system', 'payment', 'service_update', 'message', 'reminder', 'alert')),
    category VARCHAR(50)
        CHECK (category IN ('info', 'success', 'warning', 'error', 'urgent')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Content
    icon VARCHAR(50),
    color VARCHAR(20),
    
    -- Action
    action_url TEXT,
    action_label VARCHAR(100),
    
    -- Reference
    reference_type VARCHAR(50),
    reference_id UUID,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    
    -- Delivery
    delivery_method VARCHAR(20) DEFAULT 'in_app'
        CHECK (delivery_method IN ('in_app', 'email', 'sms', 'push', 'all')),
    sent_via_email BOOLEAN DEFAULT false,
    sent_via_sms BOOLEAN DEFAULT false,
    sent_via_push BOOLEAN DEFAULT false,
    
    -- Expiry
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Index for faster queries
    INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false,
    INDEX idx_notifications_created ON notifications(created_at DESC)
);

-- User notification preferences
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Channel preferences
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT true,
    in_app_notifications BOOLEAN DEFAULT true,
    
    -- Category preferences
    receive_payment_alerts BOOLEAN DEFAULT true,
    receive_service_updates BOOLEAN DEFAULT true,
    receive_system_alerts BOOLEAN DEFAULT true,
    receive_marketing_emails BOOLEAN DEFAULT false,
    receive_newsletter BOOLEAN DEFAULT false,
    
    -- Quiet hours
    quiet_hours_enabled BOOLEAN DEFAULT false,
    quiet_hours_start TIME DEFAULT '22:00:00',
    quiet_hours_end TIME DEFAULT '07:00:00',
    
    -- Frequency
    digest_frequency VARCHAR(20) DEFAULT 'daily'
        CHECK (digest_frequency IN ('realtime', 'hourly', 'daily', 'weekly')),
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 9. MESSAGES & COMMUNICATION
-- =============================================

-- Support tickets
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Ticket details
    ticket_number VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Category
    category VARCHAR(50) NOT NULL
        CHECK (category IN ('technical', 'billing', 'service', 'general', 'bug', 'feature_request')),
    priority VARCHAR(20) DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'in_progress', 'on_hold', 'resolved', 'closed')),
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE,
    
    -- Resolution
    resolution TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id),
    
    -- Client feedback
    client_rating INTEGER CHECK (client_rating >= 1 AND client_rating <= 5),
    client_feedback TEXT,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE
);

-- Ticket messages
CREATE TABLE ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Message content
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text'
        CHECK (message_type IN ('text', 'internal_note', 'system')),
    
    -- Attachments
    attachments UUID[] DEFAULT '{}', -- Array of document IDs
    
    -- Status
    is_internal BOOLEAN DEFAULT false,
    is_read BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE
);

-- Chat messages (for real-time support)
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Message content
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text'
        CHECK (message_type IN ('text', 'file', 'image', 'system')),
    
    -- File attachments
    file_url TEXT,
    file_name VARCHAR(255),
    file_type VARCHAR(50),
    file_size BIGINT,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    is_delivered BOOLEAN DEFAULT false,
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    
    -- Reactions
    reactions JSONB, -- Store emoji reactions
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- 10. SYSTEM & AUDIT LOGS
-- =============================================

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Who
    user_id UUID REFERENCES users(id),
    user_email VARCHAR(255),
    user_role VARCHAR(20),
    
    -- What
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    
    -- Changes
    old_values JSONB,
    new_values JSONB,
    
    -- Where
    ip_address INET,
    user_agent TEXT,
    
    -- When
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Index for faster queries
    INDEX idx_audit_user ON audit_logs(user_id),
    INDEX idx_audit_entity ON audit_logs(entity_type, entity_id),
    INDEX idx_audit_created ON audit_logs(created_at DESC)
);

-- System logs
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Log details
    level VARCHAR(20) NOT NULL
        CHECK (level IN ('debug', 'info', 'warn', 'error', 'fatal')),
    module VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    
    -- Context
    context JSONB,
    stack_trace TEXT,
    
    -- Source
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100),
    
    -- User context (if available)
    user_id UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Index for faster queries
    INDEX idx_system_level ON system_logs(level),
    INDEX idx_system_module ON system_logs(module),
    INDEX idx_system_created ON system_logs(created_at DESC)
);

-- =============================================
-- 11. SETTINGS & CONFIGURATION
-- =============================================

-- System settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Setting details
    category VARCHAR(100) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value JSONB NOT NULL,
    data_type VARCHAR(20) DEFAULT 'string'
        CHECK (data_type IN ('string', 'number', 'boolean', 'array', 'object')),
    
    -- Metadata
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    is_encrypted BOOLEAN DEFAULT false,
    
    -- Versioning
    version INTEGER DEFAULT 1,
    
    -- Audit
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(category, key)
);

-- API keys
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Key details
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    prefix VARCHAR(10) NOT NULL,
    
    -- Permissions
    permissions VARCHAR(100)[] DEFAULT '{}',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    -- Expiry
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 12. INDEXES FOR PERFORMANCE
-- =============================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(is_active) WHERE is_active = true;
CREATE INDEX idx_users_created ON users(created_at DESC);

-- Service request indexes
CREATE INDEX idx_data_requests_user ON data_service_requests(user_id);
CREATE INDEX idx_data_requests_status ON data_service_requests(status);
CREATE INDEX idx_data_requests_assigned ON data_service_requests(assigned_to) WHERE assigned_to IS NOT NULL;

CREATE INDEX idx_business_requests_user ON business_registration_requests(user_id);
CREATE INDEX idx_business_requests_status ON business_registration_requests(status);
CREATE INDEX idx_business_requests_tracking ON business_registration_requests(brs_tracking_number) WHERE brs_tracking_number IS NOT NULL;

CREATE INDEX idx_kra_requests_user ON kra_service_requests(user_id);
CREATE INDEX idx_kra_requests_status ON kra_service_requests(status);
CREATE INDEX idx_kra_requests_period ON kra_service_requests(year, period);

CREATE INDEX idx_bookkeeping_user ON bookkeeping_engagements(user_id);
CREATE INDEX idx_bookkeeping_status ON bookkeeping_engagements(status);
CREATE INDEX idx_bookkeeping_accountant ON bookkeeping_engagements(primary_accountant) WHERE primary_accountant IS NOT NULL;

-- Payment indexes
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction ON payments(transaction_id) WHERE transaction_id IS NOT NULL;
CREATE INDEX idx_payments_created ON payments(created_at DESC);

-- Document indexes
CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_tags ON documents USING gin(tags);

-- Notification indexes
CREATE INDEX idx_notifications_unread ON notifications(user_id, created_at DESC) WHERE is_read = false;

-- Ticket indexes
CREATE INDEX idx_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_tickets_priority ON support_tickets(priority);

-- =============================================
-- 13. TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_requests_updated_at BEFORE UPDATE ON data_service_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_requests_updated_at BEFORE UPDATE ON business_registration_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kra_requests_updated_at BEFORE UPDATE ON kra_service_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookkeeping_updated_at BEFORE UPDATE ON bookkeeping_engagements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 14. SEED DATA
-- =============================================

-- Insert default service types
INSERT INTO data_service_types (name, slug, description, base_price, estimated_days) VALUES
('Data Mining', 'data-mining', 'Extract valuable information from large datasets', 5000.00, 3),
('Data Cleaning', 'data-cleaning', 'Clean and prepare data for analysis', 3000.00, 2),
('Data Collection', 'data-collection', 'Collect data from various sources', 4000.00, 5),
('Data Analysis', 'data-analysis', 'Analyze data to extract insights', 8000.00, 4),
('Data Visualization', 'data-visualization', 'Create interactive dashboards and reports', 6000.00, 3);

INSERT INTO kra_service_types (name, slug, description, base_fee, government_fee) VALUES
('PIN Registration', 'pin-registration', 'Register for KRA PIN', 1500.00, 0.00),
('Income Tax Filing', 'income-tax-filing', 'File annual income tax returns', 3000.00, 100.00),
('VAT Registration', 'vat-registration', 'Register for VAT', 2500.00, 0.00),
('VAT Returns', 'vat-returns', 'File monthly/quarterly VAT returns', 2000.00, 0.00),
('PAYE Returns', 'paye-returns', 'File monthly PAYE returns', 1800.00, 0.00),
('Compliance Certificate', 'compliance-certificate', 'Obtain tax compliance certificate', 1500.00, 1000.00);

INSERT INTO bookkeeping_service_types (name, slug, description, base_fee, frequency) VALUES
('Monthly Bookkeeping', 'monthly-bookkeeping', 'Monthly bookkeeping services', 5000.00, 'monthly'),
('Annual Accounts', 'annual-accounts', 'Annual financial statements preparation', 15000.00, 'annual'),
('Tax Preparation', 'tax-preparation', 'Tax computation and filing', 8000.00, 'annual'),
('Audit Support', 'audit-support', 'Audit preparation and support', 20000.00, 'adhoc'),
('Financial Advisory', 'financial-advisory', 'Financial consulting and advice', 10000.00, 'adhoc');

-- Insert default admin user (password: Admin123!)
INSERT INTO users (
    email,
    password_hash,
    first_name,
    last_name,
    role,
    phone,
    company_name,
    email_verified,
    is_active
) VALUES (
    'admin@databizpro.com',
    crypt('Admin123!', gen_salt('bf')),
    'System',
    'Administrator',
    'admin',
    '+254700000000',
    'DataBizPro Ltd',
    true,
    true
);

-- Insert sample staff user
INSERT INTO users (
    email,
    password_hash,
    first_name,
    last_name,
    role,
    phone,
    company_name,
    email_verified,
    is_active
) VALUES (
    'staff@databizpro.com',
    crypt('Staff123!', gen_salt('bf')),
    'John',
    'Doe',
    'staff',
    '+254711111111',
    'DataBizPro Ltd',
    true,
    true
);

-- Insert default system settings
INSERT INTO system_settings (category, key, value, description, is_public) VALUES
('payment', 'mpesa_consumer_key', '"your_consumer_key_here"', 'M-Pesa API Consumer Key', false),
('payment', 'mpesa_consumer_secret', '"your_consumer_secret_here"', 'M-Pesa API Consumer Secret', false),
('payment', 'stripe_public_key', '"pk_test_your_key_here"', 'Stripe Public Key', true),
('payment', 'stripe_secret_key', '"sk_test_your_key_here"', 'Stripe Secret Key', false),
('general', 'company_name', '"DataBizPro Ltd"', 'Company Name', true),
('general', 'company_email', '"info@databizpro.com"', 'Company Email', true),
('general', 'company_phone', '"+254700000000"', 'Company Phone', true),
('general', 'vat_rate', '16', 'VAT Rate Percentage', true),
('notification', 'support_email', '"support@databizpro.com"', 'Support Email', true),
('notification', 'noreply_email', '"noreply@databizpro.com"', 'No-Reply Email', true);

-- Insert notification preferences for admin
INSERT INTO notification_preferences (user_id) 
SELECT id FROM users WHERE email = 'admin@databizpro.com';

-- =============================================
-- 15. VIEWS FOR REPORTING
-- =============================================

-- User summary view
CREATE VIEW user_summary AS
SELECT 
    u.id,
    u.email,
    CONCAT(u.first_name, ' ', u.last_name) as full_name,
    u.role,
    u.company_name,
    u.created_at,
    u.last_login_at,
    COALESCE(ds.total_services, 0) as total_data_services,
    COALESCE(br.total_registrations, 0) as total_business_registrations,
    COALESCE(ks.total_kra_services, 0) as total_kra_services,
    COALESCE(p.total_payments, 0) as total_payments,
    COALESCE(p.total_amount, 0) as total_spent
FROM users u
LEFT JOIN (
    SELECT user_id, COUNT(*) as total_services
    FROM data_service_requests
    GROUP BY user_id
) ds ON u.id = ds.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as total_registrations
    FROM business_registration_requests
    GROUP BY user_id
) br ON u.id = br.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as total_kra_services
    FROM kra_service_requests
    GROUP BY user_id
) ks ON u.id = ks.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as total_payments, SUM(amount) as total_amount
    FROM payments
    WHERE status = 'successful'
    GROUP BY user_id
) p ON u.id = p.user_id
WHERE u.deleted_at IS NULL;

-- Dashboard statistics view
CREATE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE deleted_at IS NULL) as total_users,
    (SELECT COUNT(*) FROM users WHERE role = 'client' AND deleted_at IS NULL) as total_clients,
    (SELECT COUNT(*) FROM users WHERE role = 'staff' AND deleted_at IS NULL) as total_staff,
    (SELECT COUNT(*) FROM data_service_requests WHERE status IN ('in_progress', 'submitted')) as active_data_services,
    (SELECT COUNT(*) FROM business_registration_requests WHERE status IN ('processing', 'documents_pending')) as active_business_registrations,
    (SELECT COUNT(*) FROM kra_service_requests WHERE status IN ('processing', 'review')) as active_kra_services,
    (SELECT COUNT(*) FROM support_tickets WHERE status = 'open') as open_tickets,
    (SELECT COALESCE(SUM(amount), 0) FROM payments 
     WHERE status = 'successful' AND created_at >= date_trunc('month', CURRENT_DATE)) as monthly_revenue,
    (SELECT COALESCE(SUM(amount), 0) FROM payments 
     WHERE status = 'successful') as total_revenue;

-- =============================================
-- 16. FUNCTIONS & STORED PROCEDURES
-- =============================================

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
    year_num INTEGER;
    seq_num INTEGER;
    invoice_num VARCHAR(100);
BEGIN
    year_num := EXTRACT(YEAR FROM CURRENT_DATE);
    
    -- Get next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 'INV-\d+-(\d+)$') AS INTEGER)), 0) + 1
    INTO seq_num
    FROM invoices
    WHERE invoice_number LIKE 'INV-' || year_num || '-%';
    
    -- Generate invoice number
    invoice_num := 'INV-' || year_num || '-' || LPAD(seq_num::TEXT, 6, '0');
    
    NEW.invoice_number := invoice_num;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for invoice number generation
CREATE TRIGGER generate_invoice_number_trigger
BEFORE INSERT ON invoices
FOR EACH ROW
EXECUTE FUNCTION generate_invoice_number();

-- Function to calculate service completion percentage
CREATE OR REPLACE FUNCTION calculate_service_completion(service_id UUID, service_type VARCHAR)
RETURNS INTEGER AS $$
DECLARE
    completion_percent INTEGER;
BEGIN
    IF service_type = 'data_service' THEN
        SELECT 
            CASE status
                WHEN 'draft' THEN 10
                WHEN 'submitted' THEN 30
                WHEN 'review' THEN 50
                WHEN 'in_progress' THEN 70
                WHEN 'completed' THEN 100
                WHEN 'cancelled' THEN 0
                ELSE 0
            END
        INTO completion_percent
        FROM data_service_requests
        WHERE id = service_id;
        
    ELSIF service_type = 'business_registration' THEN
        SELECT 
            CASE status
                WHEN 'draft' THEN 10
                WHEN 'submitted' THEN 20
                WHEN 'name_search' THEN 30
                WHEN 'documents_pending' THEN 50
                WHEN 'processing' THEN 70
                WHEN 'approved' THEN 90
                WHEN 'registered' THEN 100
                ELSE 0
            END
        INTO completion_percent
        FROM business_registration_requests
        WHERE id = service_id;
        
    ELSIF service_type = 'kra_service' THEN
        SELECT 
            CASE status
                WHEN 'draft' THEN 10
                WHEN 'submitted' THEN 40
                WHEN 'processing' THEN 70
                WHEN 'filed' THEN 90
                WHEN 'completed' THEN 100
                ELSE 0
            END
        INTO completion_percent
        FROM kra_service_requests
        WHERE id = service_id;
        
    ELSE
        completion_percent := 0;
    END IF;
    
    RETURN COALESCE(completion_percent, 0);
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 17. SECURITY POLICIES (Row Level Security)
-- =============================================

-- Enable Row Level Security on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY users_policy ON users
    USING (
        -- Users can see their own record
        id = current_setting('app.current_user_id')::UUID
        OR
        -- Admins can see all users
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = current_setting('app.current_user_id')::UUID 
            AND u.role = 'admin'
        )
    );

-- Create policies for payments table
CREATE POLICY payments_policy ON payments
    USING (
        -- Users can see their own payments
        user_id = current_setting('app.current_user_id')::UUID
        OR
        -- Admins and staff can see all payments
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = current_setting('app.current_user_id')::UUID 
            AND u.role IN ('admin', 'staff')
        )
    );

-- Create policies for documents table
CREATE POLICY documents_policy ON documents
    USING (
        -- Users can see their own documents
        user_id = current_setting('app.current_user_id')::UUID
        OR
        -- Users can see shared documents
        current_setting('app.current_user_id')::UUID = ANY(shared_with)
        OR
        -- Admins and staff can see all documents
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = current_setting('app.current_user_id')::UUID 
            AND u.role IN ('admin', 'staff')
        )
    );

-- =============================================
-- 18. COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE users IS 'Stores user authentication and profile information';
COMMENT ON TABLE data_service_requests IS 'Data analysis and processing service requests';
COMMENT ON TABLE business_registration_requests IS 'Business name and company registration requests';
COMMENT ON TABLE kra_service_requests IS 'KRA tax and compliance service requests';
COMMENT ON TABLE bookkeeping_engagements IS 'Bookkeeping and accounting service engagements';
COMMENT ON TABLE payments IS 'Payment transactions from various payment methods';
COMMENT ON TABLE invoices IS 'Generated invoices for services rendered';
COMMENT ON TABLE documents IS 'File storage for all uploaded documents';
COMMENT ON TABLE notifications IS 'User notification system';
COMMENT ON TABLE support_tickets IS 'Customer support ticket system';
COMMENT ON TABLE audit_logs IS 'Audit trail for all system activities';
COMMENT ON TABLE system_settings IS 'System configuration and settings';

-- =============================================
-- 19. GRANT PERMISSIONS (For Production)
-- =============================================

-- Create application role
-- NOTE: Run these commands separately after creating the database user

/*
-- Create application user
CREATE USER databizpro_app WITH PASSWORD 'your_secure_password';

-- Grant permissions
GRANT CONNECT ON DATABASE your_database_name TO databizpro_app;
GRANT USAGE ON SCHEMA public TO databizpro_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO databizpro_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO databizpro_app;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO databizpro_app;
*/

-- =============================================
-- 20. CLEANUP & MAINTENANCE
-- =============================================

-- Create cleanup function for soft-deleted records
CREATE OR REPLACE FUNCTION cleanup_deleted_records()
RETURNS void AS $$
BEGIN
    -- Permanently delete records marked as deleted more than 30 days ago
    DELETE FROM users WHERE deleted_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
    DELETE FROM data_service_requests WHERE deleted_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
    -- Add similar lines for other tables with soft delete
END;
$$ LANGUAGE plpgsql;

-- Create index maintenance function
CREATE OR REPLACE FUNCTION maintain_indexes()
RETURNS void AS $$
BEGIN
    -- Reindex tables that need regular maintenance
    REINDEX TABLE users;
    REINDEX TABLE audit_logs;
    REINDEX TABLE system_logs;
    -- Add other large tables as needed
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- DATABASE SCHEMA COMPLETE
-- =============================================