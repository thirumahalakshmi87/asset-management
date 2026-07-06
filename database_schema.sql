--
-- PostgreSQL database dump
--

\restrict GZ10bnAAgzeBnK01zGdpO6uyTT1gWaXrfuR53Ur4ENHvh5ZZqC2Ok7PLsPT1Fvm

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: administrators; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrators (
    admin_id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    full_name character varying(150) NOT NULL,
    email character varying(150),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.administrators OWNER TO postgres;

--
-- Name: asset_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_categories (
    category_id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_code character varying(20) NOT NULL,
    category_name character varying(100) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.asset_categories OWNER TO postgres;

--
-- Name: asset_scraps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_scraps (
    scrap_id uuid DEFAULT gen_random_uuid() NOT NULL,
    asset_id uuid,
    scrap_date date NOT NULL,
    scrap_reason text,
    scrap_value numeric(12,2),
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.asset_scraps OWNER TO postgres;

--
-- Name: asset_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_transactions (
    transaction_id uuid DEFAULT gen_random_uuid() NOT NULL,
    asset_id uuid NOT NULL,
    employee_id uuid NOT NULL,
    issue_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expected_return_date date,
    return_date timestamp without time zone,
    reason_id uuid,
    transaction_status character varying(20) DEFAULT 'ISSUED'::character varying,
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.asset_transactions OWNER TO postgres;

--
-- Name: assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assets (
    asset_id uuid DEFAULT gen_random_uuid() NOT NULL,
    asset_code character varying(20) NOT NULL,
    serial_number character varying(100) NOT NULL,
    asset_name character varying(150) NOT NULL,
    category_id uuid NOT NULL,
    vendor_id uuid,
    branch_id uuid,
    make character varying(100),
    model character varying(100),
    purchase_date date,
    purchase_price numeric(12,2),
    warranty_expiry date,
    asset_status character varying(30) DEFAULT 'AVAILABLE'::character varying,
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.assets OWNER TO postgres;

--
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branches (
    branch_id uuid DEFAULT gen_random_uuid() NOT NULL,
    branch_code character varying(20) NOT NULL,
    branch_name character varying(150) NOT NULL,
    address text,
    city character varying(100),
    state character varying(100),
    country character varying(100),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.branches OWNER TO postgres;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    department_id uuid DEFAULT gen_random_uuid() NOT NULL,
    department_code character varying(20) NOT NULL,
    department_name character varying(150) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    employee_id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_code character varying(20) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100),
    email character varying(150),
    mobile character varying(20),
    gender character varying(20),
    joining_date date,
    department_id uuid,
    branch_id uuid,
    designation character varying(100),
    status boolean DEFAULT true,
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: return_reasons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return_reasons (
    reason_id uuid DEFAULT gen_random_uuid() NOT NULL,
    reason_name character varying(100) NOT NULL
);


ALTER TABLE public.return_reasons OWNER TO postgres;

--
-- Name: vendors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendors (
    vendor_id uuid DEFAULT gen_random_uuid() NOT NULL,
    vendor_name character varying(200) NOT NULL,
    contact_person character varying(100),
    mobile character varying(20),
    email character varying(150),
    address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vendors OWNER TO postgres;

--
-- Name: vw_asset_history; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_asset_history AS
 SELECT a.asset_code,
    a.serial_number,
    a.asset_name,
    e.employee_code,
    e.first_name,
    e.last_name,
    t.issue_date,
    t.return_date,
    r.reason_name,
    t.transaction_status
   FROM (((public.asset_transactions t
     JOIN public.assets a ON ((a.asset_id = t.asset_id)))
     LEFT JOIN public.employees e ON ((e.employee_id = t.employee_id)))
     LEFT JOIN public.return_reasons r ON ((r.reason_id = t.reason_id)));


ALTER VIEW public.vw_asset_history OWNER TO postgres;

--
-- Name: vw_employee_assets; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_employee_assets AS
 SELECT e.employee_code,
    e.first_name,
    e.last_name,
    a.asset_code,
    a.asset_name,
    a.serial_number,
    t.issue_date
   FROM ((public.asset_transactions t
     JOIN public.employees e ON ((e.employee_id = t.employee_id)))
     JOIN public.assets a ON ((a.asset_id = t.asset_id)))
  WHERE ((t.transaction_status)::text = 'ISSUED'::text);


ALTER VIEW public.vw_employee_assets OWNER TO postgres;

--
-- Name: vw_stock; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_stock AS
 SELECT b.branch_name,
    count(a.asset_id) AS total_assets,
    sum(a.purchase_price) AS total_value
   FROM (public.assets a
     JOIN public.branches b ON ((a.branch_id = b.branch_id)))
  WHERE ((a.asset_status)::text = 'AVAILABLE'::text)
  GROUP BY b.branch_name;


ALTER VIEW public.vw_stock OWNER TO postgres;

--
-- Name: administrators administrators_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrators
    ADD CONSTRAINT administrators_pkey PRIMARY KEY (admin_id);


--
-- Name: administrators administrators_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrators
    ADD CONSTRAINT administrators_username_key UNIQUE (username);


--
-- Name: asset_categories asset_categories_category_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_categories
    ADD CONSTRAINT asset_categories_category_code_key UNIQUE (category_code);


--
-- Name: asset_categories asset_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_categories
    ADD CONSTRAINT asset_categories_pkey PRIMARY KEY (category_id);


--
-- Name: asset_scraps asset_scraps_asset_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_scraps
    ADD CONSTRAINT asset_scraps_asset_id_key UNIQUE (asset_id);


--
-- Name: asset_scraps asset_scraps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_scraps
    ADD CONSTRAINT asset_scraps_pkey PRIMARY KEY (scrap_id);


--
-- Name: asset_transactions asset_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transactions
    ADD CONSTRAINT asset_transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: assets assets_asset_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_asset_code_key UNIQUE (asset_code);


--
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (asset_id);


--
-- Name: assets assets_serial_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_serial_number_key UNIQUE (serial_number);


--
-- Name: branches branches_branch_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_branch_code_key UNIQUE (branch_code);


--
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (branch_id);


--
-- Name: departments departments_department_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_department_code_key UNIQUE (department_code);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (department_id);


--
-- Name: employees employees_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_email_key UNIQUE (email);


--
-- Name: employees employees_employee_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_code_key UNIQUE (employee_code);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (employee_id);


--
-- Name: return_reasons return_reasons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_reasons
    ADD CONSTRAINT return_reasons_pkey PRIMARY KEY (reason_id);


--
-- Name: return_reasons return_reasons_reason_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_reasons
    ADD CONSTRAINT return_reasons_reason_name_key UNIQUE (reason_name);


--
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (vendor_id);


--
-- Name: idx_asset_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_asset_code ON public.assets USING btree (asset_code);


--
-- Name: idx_asset_make; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_asset_make ON public.assets USING btree (make);


--
-- Name: idx_asset_model; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_asset_model ON public.assets USING btree (model);


--
-- Name: idx_asset_serial; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_asset_serial ON public.assets USING btree (serial_number);


--
-- Name: idx_asset_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_asset_status ON public.assets USING btree (asset_status);


--
-- Name: idx_employee_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employee_code ON public.employees USING btree (employee_code);


--
-- Name: idx_transaction_asset; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transaction_asset ON public.asset_transactions USING btree (asset_id);


--
-- Name: idx_transaction_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transaction_employee ON public.asset_transactions USING btree (employee_id);


--
-- Name: asset_scraps asset_scraps_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_scraps
    ADD CONSTRAINT asset_scraps_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(asset_id);


--
-- Name: asset_transactions asset_transactions_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transactions
    ADD CONSTRAINT asset_transactions_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(asset_id);


--
-- Name: asset_transactions asset_transactions_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transactions
    ADD CONSTRAINT asset_transactions_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id);


--
-- Name: asset_transactions asset_transactions_reason_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transactions
    ADD CONSTRAINT asset_transactions_reason_id_fkey FOREIGN KEY (reason_id) REFERENCES public.return_reasons(reason_id);


--
-- Name: assets assets_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(branch_id);


--
-- Name: assets assets_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.asset_categories(category_id);


--
-- Name: assets assets_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(vendor_id);


--
-- Name: employees employees_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(branch_id);


--
-- Name: employees employees_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id);


--
-- PostgreSQL database dump complete
--

\unrestrict GZ10bnAAgzeBnK01zGdpO6uyTT1gWaXrfuR53Ur4ENHvh5ZZqC2Ok7PLsPT1Fvm

