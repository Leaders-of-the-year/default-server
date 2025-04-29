--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Ubuntu 14.17-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.17 (Ubuntu 14.17-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: doctor_general; Type: TABLE; Schema: public; Owner: mehdi
--

CREATE TABLE public.doctor_general (
    id integer NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    doctor_number character varying(50) NOT NULL,
    years_of_experience integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id integer,
    address_line1 text,
    state character varying(100),
    postal_code character varying(20),
    preferred_language character varying(50)
);


ALTER TABLE public.doctor_general OWNER TO mehdi;

--
-- Name: doctor_general_id_seq; Type: SEQUENCE; Schema: public; Owner: mehdi
--

CREATE SEQUENCE public.doctor_general_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.doctor_general_id_seq OWNER TO mehdi;

--
-- Name: doctor_general_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mehdi
--

ALTER SEQUENCE public.doctor_general_id_seq OWNED BY public.doctor_general.id;


--
-- Name: doctor_specialty; Type: TABLE; Schema: public; Owner: mehdi
--

CREATE TABLE public.doctor_specialty (
    id integer NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    specialty_name character varying(100) NOT NULL,
    description text,
    doctor_number character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id integer,
    address_line1 text,
    state character varying(100),
    postal_code character varying(20),
    preferred_language character varying(50),
    years_of_experience integer,
    available boolean DEFAULT false
);


ALTER TABLE public.doctor_specialty OWNER TO mehdi;

--
-- Name: doctor_specialty_id_seq; Type: SEQUENCE; Schema: public; Owner: mehdi
--

CREATE SEQUENCE public.doctor_specialty_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.doctor_specialty_id_seq OWNER TO mehdi;

--
-- Name: doctor_specialty_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mehdi
--

ALTER SEQUENCE public.doctor_specialty_id_seq OWNED BY public.doctor_specialty.id;


--
-- Name: patients; Type: TABLE; Schema: public; Owner: mehdi
--

CREATE TABLE public.patients (
    id integer NOT NULL,
    patient_id text NOT NULL,
    user_id integer,
    first_name character varying(100),
    last_name character varying(100),
    preferred_name character varying(100),
    date_of_birth date,
    age integer,
    gender text[],
    email character varying(100) NOT NULL,
    phone_number character varying(20),
    emergency_contact jsonb,
    chief_complaint text,
    vital_signs jsonb,
    height_cm numeric(5,2),
    weight_kg numeric(5,2),
    bmi numeric(5,2),
    allergies text[],
    current_medications text[],
    chronic_conditions text[],
    consultation_notes text,
    assessment text,
    plan text,
    follow_up_instructions text,
    blood_type character varying(3),
    address_line1 text,
    city character varying(100),
    state character varying(100),
    country character varying(100),
    postal_code character varying(20),
    insurance_info jsonb,
    past_medical_history text,
    family_medical_history text,
    lifestyle jsonb,
    preferred_language character varying(50),
    accessibility_needs text,
    video_call_session_id text,
    consultation_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    consultation_duration_minutes integer,
    has_technical_issues boolean DEFAULT false,
    technical_issues_notes text,
    next_appointment timestamp without time zone,
    follow_up_reason text,
    referrals text[],
    prescriptions jsonb[],
    doctor_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true
);


ALTER TABLE public.patients OWNER TO mehdi;

--
-- Name: patients_id_seq; Type: SEQUENCE; Schema: public; Owner: mehdi
--

CREATE SEQUENCE public.patients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.patients_id_seq OWNER TO mehdi;

--
-- Name: patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mehdi
--

ALTER SEQUENCE public.patients_id_seq OWNED BY public.patients.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: mehdi
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    role_name character varying(100) NOT NULL
);


ALTER TABLE public.roles OWNER TO mehdi;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: mehdi
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO mehdi;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mehdi
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: schedule; Type: TABLE; Schema: public; Owner: mehdi
--

CREATE TABLE public.schedule (
    id integer NOT NULL,
    doctor_id integer,
    patient_id text,
    appointment_date timestamp without time zone NOT NULL,
    reason text,
    status character varying(20) DEFAULT 'scheduled'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    emergency boolean DEFAULT false
);


ALTER TABLE public.schedule OWNER TO mehdi;

--
-- Name: schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: mehdi
--

CREATE SEQUENCE public.schedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.schedule_id_seq OWNER TO mehdi;

--
-- Name: schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mehdi
--

ALTER SEQUENCE public.schedule_id_seq OWNED BY public.schedule.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: mehdi
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role_id integer NOT NULL
);


ALTER TABLE public.users OWNER TO mehdi;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: mehdi
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO mehdi;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mehdi
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: doctor_general id; Type: DEFAULT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.doctor_general ALTER COLUMN id SET DEFAULT nextval('public.doctor_general_id_seq'::regclass);


--
-- Name: doctor_specialty id; Type: DEFAULT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.doctor_specialty ALTER COLUMN id SET DEFAULT nextval('public.doctor_specialty_id_seq'::regclass);


--
-- Name: patients id; Type: DEFAULT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.patients ALTER COLUMN id SET DEFAULT nextval('public.patients_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: schedule id; Type: DEFAULT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.schedule ALTER COLUMN id SET DEFAULT nextval('public.schedule_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: doctor_general; Type: TABLE DATA; Schema: public; Owner: mehdi
--

COPY public.doctor_general (id, first_name, last_name, doctor_number, years_of_experience, created_at, user_id, address_line1, state, postal_code, preferred_language) FROM stdin;
1	John	Doe	DG12345	10	2025-04-10 21:45:59.2324	19	\N	\N	\N	\N
2	Jane	Doe	DG67890	8	2025-04-11 18:27:58.824033	36	\N	\N	\N	\N
4	Michael	Smith	DG98765	12	2025-04-11 19:02:10.622526	38	\N	\N	\N	\N
5	adfadfa	dfafadf	24555555	5	2025-04-11 19:12:08.595645	39	\N	\N	\N	\N
6	Emily	Carter	DOC2025041201	8	2025-04-12 14:22:28.031531	45	\N	\N	\N	\N
10	John	Doe	DG145	10	2025-04-13 16:46:46.383481	71	\N	\N	\N	\N
11	Jokkkkkn	Dovvvve	DGuuuuuuu145	10	2025-04-13 16:50:49.957884	72	\N	\N	\N	\N
12	Jokkkkkn	b333333333333333333333333	DGuuuuuuu145b3333333333333333333	10	2025-04-13 17:24:05.828923	75	\N	\N	\N	\N
14	Jokkkkkn	b333333333333333333333333	DGuu33333	10	2025-04-15 00:25:47.671681	86	\N	\N	\N	\N
18	Eleanor	Greenfield	DR-102938	15	2025-04-15 13:16:58.316463	115	456 Health Ave	California	90001	English
15	John	Doe	DOC-34567	10	2025-04-15 13:32:18.534306	101	123 Main St	Texas	73301	Spanish
19	Eleanor	Greenfield	DR-102931	15	2025-04-15 23:58:07.705777	214	456 Health Ave	California	90001	English
20	anis	anis	7738674384783943	6	2025-04-21 21:48:07.41531	216	uk	usa	6757	English
\.


--
-- Data for Name: doctor_specialty; Type: TABLE DATA; Schema: public; Owner: mehdi
--

COPY public.doctor_specialty (id, first_name, last_name, specialty_name, description, doctor_number, created_at, user_id, address_line1, state, postal_code, preferred_language, years_of_experience, available) FROM stdin;
1	Amelia	Reed	Urology	Urology specialist with 8 years of experience.	DOC-2025001	2025-04-15 23:02:59.860833	173	100 Wellness Blvd	California	1000	Hindi	8	f
2	Rajiv	Menon	Psychiatry	Psychiatry specialist with 9 years of experience.	DOC-2025002	2025-04-15 23:02:59.912007	174	101 Wellness Blvd	Arizona	1001	Hindi	9	f
3	Linh	Nguyen	Gastroenterology	Gastroenterology specialist with 13 years of experience.	DOC-2025003	2025-04-15 23:02:59.962211	175	102 Wellness Blvd	Texas	1002	Vietnamese	13	f
4	Carlos	Martinez	Pediatrics	Pediatrics specialist with 2 years of experience.	DOC-2025004	2025-04-15 23:03:00.012705	176	103 Wellness Blvd	Texas	1003	Urdu	2	f
5	Fatima	Ali	Cardiology	Cardiology specialist with 17 years of experience.	DOC-2025005	2025-04-15 23:03:00.063268	177	104 Wellness Blvd	California	1004	Urdu	17	f
6	Kenji	Takahashi	Pediatrics	Pediatrics specialist with 4 years of experience.	DOC-2025006	2025-04-15 23:03:00.114254	178	105 Wellness Blvd	Arizona	1005	French	4	f
7	Sophia	Brown	Ophthalmology	Ophthalmology specialist with 6 years of experience.	DOC-2025007	2025-04-15 23:03:00.164745	179	106 Wellness Blvd	Texas	1006	Urdu	6	f
8	Ali	Khan	Cardiology	Cardiology specialist with 1 years of experience.	DOC-2025008	2025-04-15 23:03:00.215218	180	107 Wellness Blvd	Florida	1007	Spanish	1	f
9	Isabelle	Moreau	Endocrinology	Endocrinology specialist with 12 years of experience.	DOC-2025009	2025-04-15 23:03:00.265658	181	108 Wellness Blvd	Georgia	1008	English	12	f
10	Omar	Youssef	Endocrinology	Endocrinology specialist with 5 years of experience.	DOC-2025010	2025-04-15 23:03:00.31787	182	109 Wellness Blvd	Texas	1009	Hindi	5	f
11	Nina	Chen	Orthopedics	Orthopedics specialist with 1 years of experience.	DOC-2025011	2025-04-15 23:03:00.3698	183	110 Wellness Blvd	Georgia	10010	Urdu	1	f
12	Leo	Silva	Pediatrics	Pediatrics specialist with 9 years of experience.	DOC-2025012	2025-04-15 23:03:00.420993	184	111 Wellness Blvd	Michigan	10011	Arabic	9	f
13	Aisha	Abdi	Pediatrics	Pediatrics specialist with 6 years of experience.	DOC-2025013	2025-04-15 23:03:00.472643	185	112 Wellness Blvd	Florida	10012	Spanish	6	f
14	Victor	Lopez	Pediatrics	Pediatrics specialist with 13 years of experience.	DOC-2025014	2025-04-15 23:03:00.522718	186	113 Wellness Blvd	Texas	10013	Vietnamese	13	f
15	Mei	Zhang	Pediatrics	Pediatrics specialist with 5 years of experience.	DOC-2025015	2025-04-15 23:03:00.572938	187	114 Wellness Blvd	Florida	10014	Vietnamese	5	f
16	Yara	Hassan	Dermatology	Dermatology specialist with 12 years of experience.	DOC-2025016	2025-04-15 23:03:00.62306	188	115 Wellness Blvd	Michigan	10015	Vietnamese	12	f
17	Jonas	Muller	Endocrinology	Endocrinology specialist with 4 years of experience.	DOC-2025017	2025-04-15 23:03:00.673025	189	116 Wellness Blvd	Arizona	10016	Spanish	4	f
18	Anika	Singh	Urology	Urology specialist with 2 years of experience.	DOC-2025018	2025-04-15 23:03:00.72286	190	117 Wellness Blvd	Texas	10017	Hindi	2	f
19	Samir	Farouk	Gastroenterology	Gastroenterology specialist with 2 years of experience.	DOC-2025019	2025-04-15 23:03:00.772805	191	118 Wellness Blvd	New York	10018	Vietnamese	2	f
20	Layla	Hamid	Gastroenterology	Gastroenterology specialist with 9 years of experience.	DOC-2025020	2025-04-15 23:03:00.822682	192	119 Wellness Blvd	New York	10019	Vietnamese	9	f
21	Noah	Walker	Cardiology	Cardiology specialist with 5 years of experience.	DOC-2025021	2025-04-15 23:03:00.87268	193	120 Wellness Blvd	Georgia	10020	French	5	f
22	Elena	Ivanova	Endocrinology	Endocrinology specialist with 16 years of experience.	DOC-2025022	2025-04-15 23:03:00.922213	194	121 Wellness Blvd	Texas	10021	Japanese	16	f
23	Ravi	Patel	Neurology	Neurology specialist with 3 years of experience.	DOC-2025023	2025-04-15 23:03:00.972292	195	122 Wellness Blvd	New York	10022	English	3	f
24	Tariq	Qureshi	Endocrinology	Endocrinology specialist with 11 years of experience.	DOC-2025024	2025-04-15 23:03:01.022152	196	123 Wellness Blvd	California	10023	Urdu	11	f
25	Sara	Ahmed	Neurology	Neurology specialist with 7 years of experience.	DOC-2025025	2025-04-15 23:03:01.072608	197	124 Wellness Blvd	Arizona	10024	Spanish	7	f
26	Miguel	Ramos	Urology	Urology specialist with 20 years of experience.	DOC-2025026	2025-04-15 23:03:01.122243	198	125 Wellness Blvd	California	10025	French	20	f
27	Dina	Nasr	Gastroenterology	Gastroenterology specialist with 9 years of experience.	DOC-2025027	2025-04-15 23:03:01.171722	199	126 Wellness Blvd	Illinois	10026	Hindi	9	f
28	Louis	Dupont	Dermatology	Dermatology specialist with 4 years of experience.	DOC-2025028	2025-04-15 23:03:01.220749	200	127 Wellness Blvd	Illinois	10027	Vietnamese	4	f
29	Maya	Sharma	Urology	Urology specialist with 17 years of experience.	DOC-2025029	2025-04-15 23:03:01.271024	201	128 Wellness Blvd	Washington	10028	French	17	f
30	Reza	Moradi	Cardiology	Cardiology specialist with 16 years of experience.	DOC-2025030	2025-04-15 23:03:01.320733	202	129 Wellness Blvd	Texas	10029	Vietnamese	16	f
32	Amelia	Reed	Cardiology	Specializes in heart disease and preventive care.	DOC-2095900	2025-04-15 23:39:31.051501	206	123 Heartbeat Lane	California	90001	English	12	f
33	Amelia	Reed	Cardiology	Specializes in heart disease and preventive care.	DOC-2095908	2025-04-15 23:40:14.631058	207	123 Heartbeat Lane	California	90001	English	12	f
31	Yasser	Reed	Cardiology	Specializes in heart disease and preventive care.	DOC-2095901	2025-04-15 23:25:46.864955	204	123 Heartbeat Lane	California	90001	English	12	f
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: mehdi
--

COPY public.patients (id, patient_id, user_id, first_name, last_name, preferred_name, date_of_birth, age, gender, email, phone_number, emergency_contact, chief_complaint, vital_signs, height_cm, weight_kg, bmi, allergies, current_medications, chronic_conditions, consultation_notes, assessment, plan, follow_up_instructions, blood_type, address_line1, city, state, country, postal_code, insurance_info, past_medical_history, family_medical_history, lifestyle, preferred_language, accessibility_needs, video_call_session_id, consultation_date, consultation_duration_minutes, has_technical_issues, technical_issues_notes, next_appointment, follow_up_reason, referrals, prescriptions, doctor_id, created_at, updated_at, is_active) FROM stdin;
3	PAT-0w4o9N9MRvyjy_dWB86rpA	82	Jane	Doe	Janettttttttttty	1990-05-20	\N	{female}	johoe@examle.com	+2348012345678	{"name": "John Doe", "phone": "+2348098765432", "relationship": "Brother"}	Recurring migraines and blurred vision	{"heart_rate": 78, "temperature": 36.7, "blood_pressure": "120/80", "oxygen_saturation": "98%"}	162.50	58.20	22.10	{Peanuts,Penicillin}	{Ibuprofen,"Vitamin D"}	{Migraines}	Advised patient to track headaches and avoid screen time before bed.	Likely tension-type headache	Continue hydration, monitor stress levels	Return in two weeks with headache log	A+	45 Allen Avenue	Ikeja	Lagos	Nigeria	100271	{"coverage": "Full", "provider": "AXA Mansard", "policy_no": "AXA-NG-2025-00123"}	Had chickenpox at age 10	Mother has hypertension	{"diet": "vegetarian", "smoker": false, "exercise": "Yoga 4x/week", "alcohol_use": "occasionally"}	English	Prefers large font on forms	\N	2025-04-15 00:01:55.096107	\N	f	\N	2025-05-01 09:30:00	Review headache diary	{Neurology}	{"{\\"drug\\": \\"Paracetamol\\", \\"dosage\\": \\"500mg\\", \\"frequency\\": \\"Twice daily\\"}","{\\"drug\\": \\"Magnesium supplement\\", \\"dosage\\": \\"250mg\\", \\"frequency\\": \\"Once daily\\"}"}	\N	2025-04-15 00:01:55.096107	2025-04-15 13:28:51.032528	t
5	PAT-JHK_Jns9SYWz6chtYVve-w	102	Jane	Doe	Janettttttttttty	1990-05-20	\N	{female}	johoe@emlel.com	+2348012345678	{"name": "John Doe", "phone": "+2348098765432", "relationship": "Brother"}	Recurring migraines and blurred vision	{"heart_rate": 78, "temperature": 36.7, "blood_pressure": "120/80", "oxygen_saturation": "98%"}	162.50	58.20	22.10	{Peanuts,Penicillin}	{Ibuprofen,"Vitamin D"}	{Migraines}	Advised patient to track headaches and avoid screen time before bed.	Likely tension-type headache	Continue hydration, monitor stress levels	Return in two weeks with headache log	A+	45 Allen Avenue	Ikeja	Lagos	Nigeria	100271	{"coverage": "Full", "provider": "AXA Mansard", "policy_no": "AXA-NG-2025-00123"}	Had chickenpox at age 10	Mother has hypertension	{"diet": "vegetarian", "smoker": false, "exercise": "Yoga 4x/week", "alcohol_use": "occasionally"}	English	Prefers large font on forms	\N	2025-04-15 01:08:07.114734	\N	f	\N	2025-05-01 09:30:00	Review headache diary	{Neurology}	{"{\\"drug\\": \\"Paracetamol\\", \\"dosage\\": \\"500mg\\", \\"frequency\\": \\"Twice daily\\"}","{\\"drug\\": \\"Magnesium supplement\\", \\"dosage\\": \\"250mg\\", \\"frequency\\": \\"Once daily\\"}"}	\N	2025-04-15 01:08:07.114734	2025-04-15 13:28:51.032528	t
6	PAT-YKdN9uK3QA6mbNfEcSQEMw	103	Jane	Doe	Janettttttttttty	1990-05-20	\N	{female}	jo@emlel.com	+2348012345678	{"name": "John Doe", "phone": "+2348098765432", "relationship": "Brother"}	Recurring migraines and blurred vision	{"heart_rate": 78, "temperature": 36.7, "blood_pressure": "120/80", "oxygen_saturation": "98%"}	162.50	58.20	22.10	{Peanuts,Penicillin}	{Ibuprofen,"Vitamin D"}	{Migraines}	Advised patient to track headaches and avoid screen time before bed.	Likely tension-type headache	Continue hydration, monitor stress levels	Return in two weeks with headache log	A+	45 Allen Avenue	Ikeja	Lagos	Nigeria	100271	{"coverage": "Full", "provider": "AXA Mansard", "policy_no": "AXA-NG-2025-00123"}	Had chickenpox at age 10	Mother has hypertension	{"diet": "vegetarian", "smoker": false, "exercise": "Yoga 4x/week", "alcohol_use": "occasionally"}	English	Prefers large font on forms	\N	2025-04-15 11:11:43.931574	\N	f	\N	2025-05-01 09:30:00	Review headache diary	{Neurology}	{"{\\"drug\\": \\"Paracetamol\\", \\"dosage\\": \\"500mg\\", \\"frequency\\": \\"Twice daily\\"}","{\\"drug\\": \\"Magnesium supplement\\", \\"dosage\\": \\"250mg\\", \\"frequency\\": \\"Once daily\\"}"}	\N	2025-04-15 11:11:43.931574	2025-04-15 13:28:51.032528	t
7	PAT-x2LoVIhfQ6-JgMjSVSuHrQ	104	Jane	Doe	Janettttttttttty	1990-05-20	\N	{female}	jo@emlell.com	+2348012345678	{"name": "John Doe", "phone": "+2348098765432", "relationship": "Brother"}	Recurring migraines and blurred vision	{"heart_rate": 78, "temperature": 36.7, "blood_pressure": "120/80", "oxygen_saturation": "98%"}	162.50	58.20	22.10	{Peanuts,Penicillin}	{Ibuprofen,"Vitamin D"}	{Migraines}	Advised patient to track headaches and avoid screen time before bed.	Likely tension-type headache	Continue hydration, monitor stress levels	Return in two weeks with headache log	A+	45 Allen Avenue	Ikeja	Lagos	Nigeria	100271	{"coverage": "Full", "provider": "AXA Mansard", "policy_no": "AXA-NG-2025-00123"}	Had chickenpox at age 10	Mother has hypertension	{"diet": "vegetarian", "smoker": false, "exercise": "Yoga 4x/week", "alcohol_use": "occasionally"}	English	Prefers large font on forms	\N	2025-04-15 12:11:12.709555	\N	f	\N	2025-05-01 09:30:00	Review headache diary	{Neurology}	{"{\\"drug\\": \\"Paracetamol\\", \\"dosage\\": \\"500mg\\", \\"frequency\\": \\"Twice daily\\"}","{\\"drug\\": \\"Magnesium supplement\\", \\"dosage\\": \\"250mg\\", \\"frequency\\": \\"Once daily\\"}"}	\N	2025-04-15 12:11:12.709555	2025-04-15 13:28:51.032528	t
8	PAT-ap2WS-TbRCqwrsZwXWOXdw	105	Jane	Doe	Janettttttttttty	1990-05-20	\N	{female}	jo@emlel.cohhhhjhjhhhhhhhhhhhhm	+2348012345678	{"name": "John Doe", "phone": "+2348098765432", "relationship": "Brother"}	Recurring migraines and blurred vision	{"heart_rate": 78, "temperature": 36.7, "blood_pressure": "120/80", "oxygen_saturation": "98%"}	162.50	58.20	22.10	{Peanuts,Penicillin}	{Ibuprofen,"Vitamin D"}	{Migraines}	Advised patient to track headaches and avoid screen time before bed.	Likely tension-type headache	Continue hydration, monitor stress levels	Return in two weeks with headache log	A+	45 Allen Avenue	Ikeja	Lagos	Nigeria	100271	{"coverage": "Full", "provider": "AXA Mansard", "policy_no": "AXA-NG-2025-00123"}	Had chickenpox at age 10	Mother has hypertension	{"diet": "vegetarian", "smoker": false, "exercise": "Yoga 4x/week", "alcohol_use": "occasionally"}	English	Prefers large font on forms	\N	2025-04-15 12:23:54.094042	\N	f	\N	2025-05-01 09:30:00	Review headache diary	{Neurology}	{"{\\"drug\\": \\"Paracetamol\\", \\"dosage\\": \\"500mg\\", \\"frequency\\": \\"Twice daily\\"}","{\\"drug\\": \\"Magnesium supplement\\", \\"dosage\\": \\"250mg\\", \\"frequency\\": \\"Once daily\\"}"}	\N	2025-04-15 12:23:54.094042	2025-04-15 13:28:51.032528	t
4	PAT-LS-suOcbQfi1VvoNf8ukrQ	87	Jane	Doegggggggg	Janey	1990-05-20	\N	{female}	johoe@examlel.com	+2348012345678	{"name": "John Doe", "phone": "+2348098765432", "relationship": "Brother"}	Recurring migraines and blurred vision	{"heart_rate": 78, "temperature": 36.7, "blood_pressure": "120/80", "oxygen_saturation": "98%"}	162.50	58.20	22.10	{Peanuts,Penicillin}	{Ibuprofen,"Vitamin D"}	{Migraines}	Advised patient to track headaches and avoid screen time before bed.	Likely tension-type headache	Continue hydration, monitor stress levels	Return in two weeks with headache log	A+	45 Allen Avenue	Ikeja	Lagos	Nigeria	100271	{"coverage": "Full", "provider": "AXA Mansard", "policy_no": "AXA-NG-2025-00123"}	Had chickenpox at age 10	Mother has hypertension	{"diet": "vegetarian", "smoker": false, "exercise": "Yoga 4x/week", "alcohol_use": "occasionally"}	English	Prefers large font on forms	\N	2025-04-15 00:34:19.525983	\N	f	\N	2025-05-01 09:30:00	Review headache diary	{Neurology}	{"{\\"drug\\": \\"Paracetamol\\", \\"dosage\\": \\"500mg\\", \\"frequency\\": \\"Twice daily\\"}","{\\"drug\\": \\"Magnesium supplement\\", \\"dosage\\": \\"250mg\\", \\"frequency\\": \\"Once daily\\"}"}	\N	2025-04-15 00:34:19.525983	2025-04-15 22:15:06.039792	t
10	PAT-Xhfo9tZ-QHqLo4zB-C_YAg	108	Jane	Doe	Janettttttttttty	1990-05-20	\N	{female}	jo@emlel.chhhhm	+2348012345678	{"name": "John Doe", "phone": "+2348098765432", "relationship": "Brother"}	Recurring migraines and blurred vision	{"heart_rate": 78, "temperature": 36.7, "blood_pressure": "120/80", "oxygen_saturation": "98%"}	162.50	58.20	22.10	{Peanuts,Penicillin}	{Ibuprofen,"Vitamin D"}	{Migraines}	Advised patient to track headaches and avoid screen time before bed.	Likely tension-type headache	Continue hydration, monitor stress levels	Return in two weeks with headache log	A+	45 Allen Avenue	Ikeja	Lagos	Nigeria	100271	{"coverage": "Full", "provider": "AXA Mansard", "policy_no": "AXA-NG-2025-00123"}	Had chickenpox at age 10	Mother has hypertension	{"diet": "vegetarian", "smoker": false, "exercise": "Yoga 4x/week", "alcohol_use": "occasionally"}	English	Prefers large font on forms	\N	2025-04-15 12:50:40.679715	\N	f	\N	2025-05-01 09:30:00	Review headache diary	{Neurology}	{"{\\"drug\\": \\"Paracetamol\\", \\"dosage\\": \\"500mg\\", \\"frequency\\": \\"Twice daily\\"}","{\\"drug\\": \\"Magnesium supplement\\", \\"dosage\\": \\"250mg\\", \\"frequency\\": \\"Once daily\\"}"}	\N	2025-04-15 12:50:40.679715	2025-04-15 13:28:51.032528	t
9	PAT-SU2ZE2bFSvCpM6H1KCMboQ	106	Jane	Duuuuuuujjjjjjje	Janey	1990-05-20	\N	{female}	jo@emlel.cohhhhjhjhhhhhhhm	+2348012345678	{"name": "John Doe", "phone": "+2348098765432", "relationship": "Brother"}	Recurring migraines and blurred vision	{"heart_rate": 78, "temperature": 36.7, "blood_pressure": "120/80", "oxygen_saturation": "98%"}	162.50	58.20	22.10	{Peanuts,Penicillin}	{Ibuprofen,"Vitamin D"}	{Migraines}	Advised patient to track headaches and avoid screen time before bed.	Likely tension-type headache	Continue hydration, monitor stress levels	Return in two weeks with headache log	A+	45 Allen Avenue	Ikeja	Lagos	Nigeria	100271	{"coverage": "Full", "provider": "AXA Mansard", "policy_no": "AXA-NG-2025-00123"}	Had chickenpox at age 10	Mother has hypertension	{"diet": "vegetarian", "smoker": false, "exercise": "Yoga 4x/week", "alcohol_use": "occasionally"}	English	Prefers large font on forms	\N	2025-04-15 12:40:48.888749	\N	f	\N	2025-05-01 09:30:00	Review headache diary	{Neurology}	{"{\\"drug\\": \\"Paracetamol\\", \\"dosage\\": \\"500mg\\", \\"frequency\\": \\"Twice daily\\"}","{\\"drug\\": \\"Magnesium supplement\\", \\"dosage\\": \\"250mg\\", \\"frequency\\": \\"Once daily\\"}"}	\N	2025-04-15 12:40:48.888749	2025-04-15 13:32:24.991632	t
11	PAT-JINa0McZR7Kj9fbcYj7DPQ	117	ahmed	dr	\N	\N	\N	\N	ay@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	hello	\N	ourgla	UK	7010	\N	\N	\N	\N	French	\N	\N	2025-04-15 14:02:59.735473	\N	f	\N	\N	\N	\N	\N	\N	2025-04-15 14:02:59.735473	2025-04-15 14:02:59.735473	t
12	PAT-cthPsQ0ZQ3Oyet-5skR3xw	123	a	a	\N	\N	\N	\N	a	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	a397492734	\N	a	a	945948594	\N	\N	\N	\N	German	\N	\N	2025-04-15 21:03:09.554141	\N	f	\N	\N	\N	\N	\N	\N	2025-04-15 21:03:09.554141	2025-04-15 21:03:09.554141	t
13	PAT-zGyx6vYzTOW4MBzlmDvPCw	124	a	a	\N	\N	\N	\N	aa	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	a	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-15 21:03:42.622748	\N	f	\N	\N	\N	\N	\N	\N	2025-04-15 21:03:42.622748	2025-04-15 21:03:42.622748	t
14	PAT-p53KU17NRnu2VIl8Ivuatw	126	John	Doe	\N	\N	\N	\N	a@a.a	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	123 Main St	\N	Illinois	USA	62704	\N	\N	\N	\N	English	\N	\N	2025-04-15 21:21:25.834376	\N	f	\N	\N	\N	\N	\N	\N	2025-04-15 21:21:25.834376	2025-04-15 21:21:25.834376	t
15	PAT-mXNznSOaRJSRlaLUGJKiag	215	aym	tff	\N	\N	\N	\N	x@v.v	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	New york	\N	UK	uk	2324	\N	\N	\N	\N	English	\N	\N	2025-04-19 20:14:19.113031	\N	f	\N	\N	\N	\N	\N	\N	2025-04-19 20:14:19.113031	2025-04-19 20:14:19.113031	t
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: mehdi
--

COPY public.roles (id, role_name) FROM stdin;
1	doctor_general
2	doctor_special
3	patient
\.


--
-- Data for Name: schedule; Type: TABLE DATA; Schema: public; Owner: mehdi
--

COPY public.schedule (id, doctor_id, patient_id, appointment_date, reason, status, created_at, updated_at, emergency) FROM stdin;
3	204	PAT-JHK_Jns9SYWz6chtYVve-w	2025-04-20 10:00:00	Follow-up check	scheduled	2025-04-17 18:53:10.103964	2025-04-17 18:53:10.103964	f
7	204	PAT-JHK_Jns9SYWz6chtYVve-w	2025-11-22 14:30:00	Follow-up consultation	scheduled	2025-04-17 20:14:24.676484	2025-04-17 20:14:24.676484	f
9	207	PAT-YKdN9uK3QA6mbNfEcSQEMw	2024-11-23 14:30:00	Follow-up consultation	completed	2025-04-17 20:42:58.705766	2025-04-17 20:42:58.705766	f
2	204	PAT-JHK_Jns9SYWz6chtYVve-w	2024-04-25 14:00:00	Follow-up check	completed	2025-04-17 18:24:28.764665	2025-04-17 21:03:23.364437	f
13	179	PAT-YKdN9uK3QA6mbNfEcSQEMw	2025-04-26 03:04:00	hello how hru doing	cancelled	2025-04-18 00:12:24.437759	2025-04-18 00:12:24.437759	f
11	173	PAT-YKdN9uK3QA6mbNfEcSQEMw	2025-08-31 20:56:00	hello  mehdi 	scheduled	2025-04-17 22:52:36.126493	2025-04-17 22:52:36.126493	f
15	173	PAT-YKdN9uK3QA6mbNfEcSQEMw	2025-07-27 21:22:00	uioluggoijanlajjnl	cancelled	2025-04-19 20:18:05.975334	2025-04-19 20:18:05.975334	f
10	204	PAT-JHK_Jns9SYWz6chtYVve-w	2025-09-01 12:00:00	Follow-up consultation for chronic disease	cancelled	2025-04-17 21:47:52.340186	2025-04-21 22:52:14.842893	f
14	183	PAT-YKdN9uK3QA6mbNfEcSQEMw	2024-05-01 14:06:00	this is a test for the history	cancelled	2025-04-18 00:49:59.820148	2025-04-22 00:19:03.202093	t
12	173	PAT-YKdN9uK3QA6mbNfEcSQEMw	2025-04-25 03:05:00	hey how are you 	cancelled	2025-04-18 00:05:48.550721	2025-04-22 00:20:47.739228	t
8	204	PAT-YKdN9uK3QA6mbNfEcSQEMw	2025-11-23 14:30:00	Follow-up consultation	cancelled	2025-04-17 20:23:26.565708	2025-04-22 00:22:38.558442	t
16	207	PAT-YKdN9uK3QA6mbNfEcSQEMw	2025-10-22 14:30:00	Follow-up consultation	scheduled	2025-04-22 00:28:00.050763	2025-04-22 00:28:00.050763	t
17	173	PAT-YKdN9uK3QA6mbNfEcSQEMw	2026-05-05 00:01:00	im done i will die 	scheduled	2025-04-22 00:39:42.878301	2025-04-22 00:39:42.878301	t
18	173	PAT-YKdN9uK3QA6mbNfEcSQEMw	2025-06-06 10:11:00	fdaf	scheduled	2025-04-22 11:57:56.996573	2025-04-22 11:57:56.996573	t
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: mehdi
--

COPY public.users (id, username, email, password, created_at, role_id) FROM stdin;
78	bb_brown	bvbnmnbvcyu@ekkde.om	$2b$10$Je5d2a3gcooHpzAgRx5TpecK.cML5FNLPAzTSndVsD4w2yHriRUlC	2025-04-14 23:48:55.343383	3
79	testpatient	patient@example.com	$2b$10$IkBuDRn5uBK2.d7ytpwAo.MYoN6A84Ct8Bm9raamGT/mMoEVSn6cW	2025-04-14 23:53:04.596071	3
80	john_doe_92	john.doe@example.com	$2b$10$w00JKBfgDiv.38k72h59AeyD6PNnIZd/fdPHE7dhyGwlBoR1Y6Noq	2025-04-14 23:57:55.142315	3
81	john_doe_92	john.doe@examle.com	$2b$10$cnytPDmVCOEJRxUjnvcXXef4z6EWPhTaDd/r3RG3rp4r5488.iq2.	2025-04-14 23:59:48.578621	3
82	john_doe_92	johoe@examle.com	$2b$10$rYlOiK8BlgrvkrZUGpuSOeL4AnCtF5AO4gfFAT1/3zgVzTBd99Ozi	2025-04-15 00:01:55.089353	3
83	drjohn	hn@saexb3333333333333333amp.com	$2b$10$.YO2htboJCjTGOD4g5Sk5OITg1GT2HJmwG2Ixr243wwA6LU2/CaaG	2025-04-15 00:13:10.446954	1
84	drjohn	hn@saexb33amp.com	$2b$10$U4wk3YvJzQuyp1HYAIR.bu782fzQsOBaFEvNad7xtL4ySwJnhDDn.	2025-04-15 00:23:12.96962	1
85	drjohn	hn@saexb333amp.com	$2b$10$R3DJ6/fraDfyURCKkKnFweR6MLNvtl1kBRsvmci2f1dS5uM4v3Bea	2025-04-15 00:25:30.38017	1
86	drjohn	hn@saexbp.com	$2b$10$NdgQCcAEJgY5V9XPf7sGvuQqZesnpWrcUIkEQlai/dplrnypeVD6S	2025-04-15 00:25:47.664612	1
87	john_doe_92	johoe@examlel.com	$2b$10$9v154OSuoDr.Epk7nqzI0eyHguyOg5fkF1e15kX93/kD8anUdeMCy	2025-04-15 00:34:19.518891	3
88	drsmith87	smith.dr87@examphhhhom	$2b$10$h0hecEcHIgQC.BBHLSwa6ehde7D0pPDQ0GqO6cQbV.jZ65a02sZFy	2025-04-15 00:39:30.273641	2
89	drjohn	hn@.com	$2b$10$NFn/qv0hwWmlSLiLB.DG5OxS4xziFQxWFnU37ttnx4cXPrtkHKIFa	2025-04-15 00:43:06.370012	1
90	drjohn	h@.com	$2b$10$qeqmE5JIw5F7CRbxrjLjIeajGVpXJtvKaQ2xLqo.vXSeBKqS8Pwe2	2025-04-15 00:43:18.955216	1
91	drjohn	h@.cm	$2b$10$A0SIuCL6FMbf7bjlC8Eib.obpLurFV0h9E6tLCT3ZZFnUXjlH/Zxu	2025-04-15 00:43:29.339264	1
92	drjohn	h@.cjnhtrewm	$2b$10$TKIOf7yhxf3LDbgJYxnC8OYLfy.4yWvHLibvagT5N7JY0H1dLVQOa	2025-04-15 00:43:41.967599	1
93	drjohn	h@.cjnhtffffffffffffffffffffffffffffffffffffffffffffffffffrewm	$2b$10$RyPo4Y2sj7gi6J6vHw0GB.woKFU59C4N6T3crPW2Dd7Bke4QMzP8C	2025-04-15 00:43:52.283341	1
94	drjohn	h@.cjnhtfffffffffffffffffffffffffffffffffffffffffffffffjygfffrewm	$2b$10$eKtWqyT6VAyZWtCWfeSccOfn0Dq/DP/Ue1zrTnJOGrXW1B2KEWsa.	2025-04-15 00:44:05.702553	1
95	drsmith87	smith.dr87@examphhhuytreewjjggfhom	$2b$10$EjNOS1a7zR7KcRohiEU/Gefhi5XSVtlgpJWEa.npmGNACJ5.iTQmK	2025-04-15 00:44:22.019359	2
96	drsmith87	sh.dr87@eamphhhuytreewjjggfhom	$2b$10$nGt4w7sl3qfdMJHFVGlIgurDvAIyTMwbXNbsUqpVukt8q8qqmyK/S	2025-04-15 00:53:11.555142	3
97	drsmith87	sh.dr87@eamphhhggfhom	$2b$10$Go/JUmllgwKVUtmAPg2lm.8OAfzufAKypvtpBQVc9umgFWO85uboa	2025-04-15 00:54:16.135792	3
98	drsmith87	sh.dr87@eam]jklafskjhafsdkjphhhggfhom	$2b$10$AQed6UQSsqfIv.yWty8uHOfmHtLAz1D1ULC84jrff9CjDPoR5WiPG	2025-04-15 00:54:27.554274	3
99	drsmith87	sh.dr87@eam]jklafskjhafsdkgggggjphhhggfhom	$2b$10$2yc3EfivJFvWNmBIczsfpevGrA4RbR9YcuUYG3RPzs1bXrsjKbSyy	2025-04-15 00:54:38.223886	2
100	drjohn	h@.cjnhtfffffffffffffffffffffjygfffrewm	$2b$10$4tH5mG1mABEnDeI6IO0FouIhQwXPuii1w0XY0kidG7ArrGJx/3zPG	2025-04-15 00:54:53.513081	1
101	drjohn	h@.cjnhtffffffffffffnnnnnjahkjfahkjhfakjhfkajhkjafdshkafjsdhfffffffffjygfffrewm	$2b$10$LyueD.qxjoWtmklXJYUJJuMbd6YmjfpsVtC70c8UM/u3IQsezAImW	2025-04-15 00:55:07.880486	1
102	john_doe_92	johoe@emlel.com	$2b$10$H/.DRPVT9DiMFkQlKQ.I8usFPnqp0vJ4sKw9nG4VeLd72iilZcS5K	2025-04-15 01:08:07.10778	3
103	john_doe_92	jo@emlel.com	$2b$10$Ah5rUTJ7A3RD70vLaWiGjuX0xjqUvrYX5OvdIz0cU1kCHA/B0epvu	2025-04-15 11:11:43.925832	3
104	john_doe_92	jo@emlell.com	$2b$10$d4jcThvxhRVZdwGac0DDkOIH.mpyKghiTO3bezUyuwP4gY9B/oVUi	2025-04-15 12:11:12.70646	3
105	john_doe_92	jo@emlel.cohhhhjhjhhhhhhhhhhhhm	$2b$10$D9EeBkCjvJcCp4t04vVh3.tKvNg/vzOVTkxWwTnm4e2jpzxckZIeq	2025-04-15 12:23:54.092436	3
106	john_doe_92	jo@emlel.cohhhhjhjhhhhhhhm	$2b$10$15HZ/S1Kik2V.I2YF6.1PebkvvqJncjcLy7u/YZKzBLsFamWJiayC	2025-04-15 12:40:48.882061	3
107	drsmith87	sh.dr87@eam]jklhom	$2b$10$J2wYG3gFjT9jMmq9H0IJaOwnLBPmb4jxQ2oZZqEg2Y7udcq2DKhFG	2025-04-15 12:42:23.148178	2
108	john_doe_92	jo@emlel.chhhhm	$2b$10$D2NNuGLNzszxeINoF3/6reM3cIyWZOaGdLVj9WVyWLgvvKnvxhdDK	2025-04-15 12:50:40.673449	3
109	john_doe_92	jo@emel.chhhhm	$2b$10$DMx5.ffR2pvPDz.GdRAx1esVyo24xSGXtvgKWmVZSv1Nfra0arlzW	2025-04-15 13:07:21.690243	1
110	john_doe_92	jo@emel.chhhjjjjhm	$2b$10$mvGL2XE27NolzZsRsZRFyeuJn0mtwO0fbS4Ljf2UfSjxXEg5dyY6q	2025-04-15 13:07:33.71806	1
111	dr_jane_94	jane.specialist@example.com	$2b$10$z8VZX9tnQWDI25bYj9uX9.VqT1zsU8nP5wL7QaZ6gRIW9LhJHWuRW	2025-04-15 13:09:17.041739	2
112	dr_greenfield	dr.greenfield@example.com	$2b$10$W1MNft72RRROaL5AnfZZAOOSsJ4TW50qRSiuseVx/xV0Z/wtOzyyC	2025-04-15 13:13:19.556098	1
113	dr_greenfield	dr.greenfield@evxample.com	$2b$10$WC4MrCLfMjIEqYJsTQsaJOwYqEz2y6YTrLkf9xoNFwfXQxw.TFVBW	2025-04-15 13:14:02.35611	1
114	dr_jane_94	jane.specialist@nexample.com	$2b$10$SvfVrJg8MWO0evXlgbsloe04F87BeVH7Jbcklm0AHqzGuipgGmGxC	2025-04-15 13:14:11.805101	2
115	dr_greenfield	dr.greenfield@evxbample.com	$2b$10$wzr68/EVRimzXiO.mzGq9uUva3X3b35zOVirYbm24yoHDgXptDP/m	2025-04-15 13:16:58.308039	1
116	dr_jane_94	jane.sp,,ecialist@nexample.com	$2b$10$rVDH9o1fSLkDN/k7bst8LOHvpeBfLGsqHxsB4eLSDB7fr0d6jofHO	2025-04-15 13:17:35.244881	2
117	bbfdfad	ay@gmail.com	$2b$10$fyTYZFAKwD4WX4FRQEY.WeSmypXc.wMsqCULt1ncp3/3YbfhpCLja	2025-04-15 14:02:59.727746	3
118	B3333	IMPRA@GOAT.com	$2b$10$.H4XcEu3oUTYHHaSahYzxeYc57JQsYM4KMguLnVyIl.z/jo7elXbi	2025-04-15 14:05:35.192505	3
119	B3333	IMPRRRRA@GOAT.com	$2b$10$oJugJo.3ZSFiQdslZ1cST.CxxKLhS9tMPxeENG1/g/5ZrKUKAVUKm	2025-04-15 14:06:37.603026	3
120	MOHAMED	ahmed@gmail.com	$2b$10$pMSLX4XbNgV4lUfKLP086O31hUgLQd4XpQOk/6Y0PnKSDt9gV4A9W	2025-04-15 14:09:15.810435	3
121	fjalkjslkjlafdjlkadjf	ikkikeinlnfadslkjlk@gmail.com	$2b$10$jl1OwoUYK.uZp5DIS2iLIOb9UyT8Pn0av7OkxHQboVDJqnK9LqJzi	2025-04-15 14:19:27.3638	2
122	aymen	ytu@gmail.com	$2b$10$DfLXdw2U73nomFZTw48E6OO7G9s9TFm/Eng/WDqfa6NHJO/eFpErq	2025-04-15 20:21:29.709889	2
123	a	a	$2b$10$XHFKwugrxyirqKGmalbffO3Qa2M71m7FJPBWv49Vc9EoBVncRZeeO	2025-04-15 21:03:09.546993	3
124	a	aa	$2b$10$zPViN0pyZHggpVtrAT2lkOBa1P94Mn2OOnK6gCdciS9BGuIK7yGuK	2025-04-15 21:03:42.61564	3
126	a	a@a.a	$2b$10$nmxSGo6k71txRSJNgj6HVOKcALXeMGEUeQw4OfUuVODZyBeBk./i2	2025-04-15 21:21:25.827882	3
127	dr_jane_94	jane.sp,,ecialist@nexamplllllle.com	$2b$10$mtYL4xIRrlrxCl5oUkYXvu/.dPWWgvfHd/DLsfZRzjqpUJ3ZNYjR2	2025-04-15 21:47:48.132102	2
128	dr_jane_94	jane.sp,,ecialist@nexampujmlllllle.com	$2b$10$IJyX4mFFbWABBkaqoohQpO5OfhzaiIUjq0daNGCglkX2l2690Ryra	2025-04-15 21:50:15.45667	2
129	dr_jane_94	jane.sup,,ecialist@nexampujmlllllle.com	$2b$10$ErLOUaTX9T0NtP2DvpT17u7WPMW9ZWXMSgW4PWNhDUyOzYWU5SsQC	2025-04-15 21:52:23.207849	2
130	dr_jane_94	jane.suup,,ecialist@nexampujmlllllle.com	$2b$10$IyAllLZ5KUotdPFHm5S.qu7S5Ok9TCL6bwxqBTNbXEjI3Vn7Tz5su	2025-04-15 21:55:19.432674	2
131	dr_jane_94	jane.suup,,eciakkkkkklist@nexampujmlllllle.com	$2b$10$zjSynKVxOc0TbTdyQI.XvOYuZx8OIkD2j7a2J/9j1Lwhiby2CLaUq	2025-04-15 21:55:26.6088	2
132	dr_jane_94	jane.suup,,eciakkkkkklist@nexampujmllllllooooooe.com	$2b$10$dei8UoylHPscDdENZgOAcuj.SSZkXFvYvuaDlaniXM9m7TBmKR8hO	2025-04-15 21:58:41.342493	2
133	dr_jane_94	janeoe.com	$2b$10$5mJ0TP9wVyHFLEMyYqJ0c.H9OfRqpLp0A7g1tKisjtctr26ziY.R2	2025-04-15 21:58:52.886131	2
134	dr_jane_94	janueoe.com	$2b$10$pQKO8KsHWwkCnlmGzRmMAu3E.ct66l25YTjbSaVaCPSXQixQWaJoC	2025-04-15 22:01:37.604325	2
135	dr_jane_94	jaqqnueoe.com	$2b$10$cgkXBZ6ev.AimNvG7MQkre7JAfFJe469rOFkY39xctQtcIwCYvizS	2025-04-15 22:05:32.53763	2
136	dr_jane_94	jaqqnuuuueoe.com	$2b$10$2n0LlDRk.cNO.N/q7TfkBunnbeX9aWv0RJBcob2Mk5.5QcFyuXr9S	2025-04-15 22:05:42.336079	2
137	dr_jane_94	jqqnuuuueoe.com	$2b$10$2q/Y9qLDYe3.IGEBMuuQdOkOCgbf3K8/Y26PcHSrnat21M3y6CHS2	2025-04-15 22:06:07.35867	2
138	dr_jane_94	jqqnuunuuueoe.com	$2b$10$I9vGHBBLFLSZqJrxRp9mT.z7iifrtFZ0Scn5GlquR7WTEsZYwEmJa	2025-04-15 22:10:11.216267	2
139	dr_jane_94	jqqnubbunuuueoe.com	$2b$10$QkixMRXhwmxeUZ/dYKgP4OMbOm/fUoRj3RbWVHkFhIwLIWTVagqZm	2025-04-15 22:11:56.497329	2
140	dr_jane_94	jqqnubbunuuuee.com	$2b$10$VWlXxZEPi5E0FSnYlkaeL.6J3zNOHHxB5p96bDn2FIITXNCRoLEVa	2025-04-15 22:50:09.314472	2
141	dr_jane_94	jqqnubbunuue.com	$2b$10$.OMQoNCEdlLNSafckD/ReeFnXRbLATJsZflCXePtV4G2CzW4LetyC	2025-04-15 22:52:13.533202	2
142	dr_amelia_cardiac	amelia.reed@example.com	$2b$10$7HxBVy2gucF9fOWLNw8yQOe4Ld7OeeYGAZGDFBcRBcZK2saYeK4f2	2025-04-15 22:58:58.202146	2
143	dr_user_1	dr_user_1@example.com	$2b$10$e1k5oaexeQWUPdX.SR9.ZOYzvQ3doG5m..Bz5J8.gAiys2fbDThKW	2025-04-15 23:00:52.090046	2
144	dr_user_2	dr_user_2@example.com	$2b$10$7lqPwksHDUSNuhmqVP.CSuFFI4kwaQTBr3GdEFvIKBCOi.e9.x.0O	2025-04-15 23:00:52.14311	2
145	dr_user_3	dr_user_3@example.com	$2b$10$sSQxGeAa3Mty23AfVflcLOlUOzVabycoIC9bN8yA98qhfLdbxwdBe	2025-04-15 23:00:52.195378	2
146	dr_user_4	dr_user_4@example.com	$2b$10$zvt/7oBt5k2Z6nx7FPgP1.VGGMxWJtgk06L7Nm9hqpXBff61ixisO	2025-04-15 23:00:52.248697	2
147	dr_user_5	dr_user_5@example.com	$2b$10$0CEmkJB5l65VWNK7oChlBeJPmJeQpnSa/2IGLUwVef8sglqfc/poq	2025-04-15 23:00:52.301735	2
148	dr_user_6	dr_user_6@example.com	$2b$10$e/79WqtzdOwh5sgcQwOK.ubsXWqT98uWUtNPz2wINAazmEJRS6ZBm	2025-04-15 23:00:52.353842	2
149	dr_user_7	dr_user_7@example.com	$2b$10$7oy6.KiUqFowd0XqM4jaDuFiOfVDDlQKJQlXopUU3WfS3zacD/POO	2025-04-15 23:00:52.405761	2
150	dr_user_8	dr_user_8@example.com	$2b$10$3KSxN2ikpRBSfxBApycHt.nWl9CIGmE51Gljeu0R0Fq1OfxHpUNee	2025-04-15 23:00:52.457303	2
151	dr_user_9	dr_user_9@example.com	$2b$10$fv5064BC5419Md73fl6ewuyeIrJZP2j0M0W4edv1/jdpdE7T1uKie	2025-04-15 23:00:52.509838	2
152	dr_user_10	dr_user_10@example.com	$2b$10$8ZldEO3M4ht5oV5MmtHdyOFuGreIp6Xa1Jz5MqdlVKCDgPMA.BIBS	2025-04-15 23:00:52.561738	2
153	dr_user_11	dr_user_11@example.com	$2b$10$3tCvVnVW0cbwfyI/tlltL.b3MsKmUiZNuGJhw/lkdf0.dfApKRFBK	2025-04-15 23:00:52.614569	2
154	dr_user_12	dr_user_12@example.com	$2b$10$W9FNwqlwzBc/nBSUVlD3JOq5wG2fDvi3XXi2sZ7Snz8hMh8JthGFu	2025-04-15 23:00:52.665896	2
155	dr_user_13	dr_user_13@example.com	$2b$10$daUenqyCcnNMO4wKj.NnFu.iK4b7bgHPQ3zxCIXpJPyfhbEKONb86	2025-04-15 23:00:52.717989	2
156	dr_user_14	dr_user_14@example.com	$2b$10$6dFZvMGlCL4PF3vvUsvIIe3UbOsSWxtDIHRaC3BZkVd6pfirjvw8m	2025-04-15 23:00:52.771098	2
157	dr_user_15	dr_user_15@example.com	$2b$10$9Jb9BRPB9pp8sMUVhYmHOeUUmXbkVEdmINbT46H9k9QZ4Zk7FEWh6	2025-04-15 23:00:52.823308	2
158	dr_user_16	dr_user_16@example.com	$2b$10$dsslUNhHwk7PbF32xaZu0etfXEmBzTu39vp0ZB6A3y6On0sGEO8Yy	2025-04-15 23:00:52.875446	2
159	dr_user_17	dr_user_17@example.com	$2b$10$/mguhm67uxb/9U9yVhMN0O0emwNcxewbaeLnB.rRrajLZWae/iG0y	2025-04-15 23:00:52.927115	2
160	dr_user_18	dr_user_18@example.com	$2b$10$yjoUYKKmNr/0hLd6lsaNTeUmxYyo68xH6rqM/gtKyYLeO1ES7WVIm	2025-04-15 23:00:52.978618	2
161	dr_user_19	dr_user_19@example.com	$2b$10$UK/huiIKfwDe6bJ75q5DpunswUxpJxeFwuX4ylv7.kX8bPlAys3he	2025-04-15 23:00:53.029838	2
162	dr_user_20	dr_user_20@example.com	$2b$10$Wm.dnR3Yr3hQT4U29PKdIO1Aeler8MkiyjeqcZZMvdd/kb1bFz.vC	2025-04-15 23:00:53.082224	2
163	dr_user_21	dr_user_21@example.com	$2b$10$vmJN8g52IbL1EqOKyTWNaeKRJFu8jQV62AqzyDAr44ZXKyIk5qOCu	2025-04-15 23:00:53.134165	2
164	dr_user_22	dr_user_22@example.com	$2b$10$qLkLcobM/QWRJJlO06LnFeMH5tUPiHtR4mglZfI4NIO7mG.RExYpW	2025-04-15 23:00:53.185703	2
165	dr_user_23	dr_user_23@example.com	$2b$10$DenlhhQwe7uEfnkspixNCeWCqQ.e3vbwm2jfOlMCypXiYODnWhihy	2025-04-15 23:00:53.237385	2
166	dr_user_24	dr_user_24@example.com	$2b$10$SCNuDcR/eMhEeWaSdbuVgOw6usMargIptXfFuEPg5a5EJKp.EeJza	2025-04-15 23:00:53.289079	2
167	dr_user_25	dr_user_25@example.com	$2b$10$V8nlg1jFXD3WEVAFO2c0iOEiPIUezpMCgYiG48R28Yu564yAQUAhS	2025-04-15 23:00:53.341637	2
168	dr_user_26	dr_user_26@example.com	$2b$10$pgEPa2Gptcug8ExxdsEg8euj7lST7MzHAj6BzX.FNx9TwwEYke1Q2	2025-04-15 23:00:53.394632	2
169	dr_user_27	dr_user_27@example.com	$2b$10$r4.Cz0l.KI4NBEDPzeoWveuE/YJjcrrTCdOavqe6L5acXhaOVL34y	2025-04-15 23:00:53.447762	2
170	dr_user_28	dr_user_28@example.com	$2b$10$SMDAraz0R8nWeewq5cvMze0XBpdKnCFdLE6FQ21rHdW28vF6zHpkq	2025-04-15 23:00:53.50019	2
171	dr_user_29	dr_user_29@example.com	$2b$10$rQr3dD4t/P64HaC3lzjj6OH6roi6pi5QmRLpU3Ic3lI1Y4u0.Refi	2025-04-15 23:00:53.551921	2
172	dr_user_30	dr_user_30@example.com	$2b$10$42ZsREWyk6RUCHVogAnGr.ej/kHT8vPg.ZgJa9YtWrMb78dyq8jJu	2025-04-15 23:00:53.604195	2
173	dr_amelia_reed	dr_amelia_reed@example.com	$2b$10$uTpcWRDtBoxQAX1lBQGj1OQGlFpLaPPtwYbT7MxxdJV/Ffy8dDOqm	2025-04-15 23:02:59.854344	2
174	dr_rajiv_menon	dr_rajiv_menon@example.com	$2b$10$iTFs5WsbLaahEDzHQn/gI.PfKQljegttzOoaE7gL5IUpFkGl11Gdu	2025-04-15 23:02:59.91075	2
175	dr_linh_nguyen	dr_linh_nguyen@example.com	$2b$10$nKmmdb2SHGgixEUw5KoPL.Ag72gN8Ru8pdWBDpOhWdaeSpJOxm2Fe	2025-04-15 23:02:59.961045	2
176	dr_carlos_martinez	dr_carlos_martinez@example.com	$2b$10$OK3AY.it5sD6FgIKD6ePVuwMkJxUZScFrkYn6kzXrOE9Y9eEiZrZa	2025-04-15 23:03:00.011269	2
177	dr_fatima_ali	dr_fatima_ali@example.com	$2b$10$FUryii1z19DUrIniz/NhZuZ.t121bk4X9w72pj16pvCtdxlI.MqXG	2025-04-15 23:03:00.062092	2
178	dr_kenji_takahashi	dr_kenji_takahashi@example.com	$2b$10$IHvA/cSEP090dF.S1dHbpu059D0neSVnOM.GHuYeEnEnVHdN0jRlm	2025-04-15 23:03:00.113108	2
179	dr_sophia_brown	dr_sophia_brown@example.com	$2b$10$xO/HXkLzf3l93WA5TOXSBueQ6q1KL48beZPQw4GcCXb6cTTmkA2Ce	2025-04-15 23:03:00.16333	2
180	dr_ali_khan	dr_ali_khan@example.com	$2b$10$n3P5KiPfkKf2UGPq45XntuLXVUFQeC96jRYwRZHGFz4rXX5JJa4Eq	2025-04-15 23:03:00.213973	2
181	dr_isabelle_moreau	dr_isabelle_moreau@example.com	$2b$10$QohHY.qV64K6V2R0heZb2ergFFcBpxrRoAJOS6RzyZrGPr0H0lVTa	2025-04-15 23:03:00.264194	2
182	dr_omar_youssef	dr_omar_youssef@example.com	$2b$10$h2EvG2FCm2IfGEBsAOx5GOkwVco85DtAzW1GnAyAoSf78AEsBO0US	2025-04-15 23:03:00.316018	2
183	dr_nina_chen	dr_nina_chen@example.com	$2b$10$7vA5OM29yFvkFjgSPf8ZEey44cmcYHqo13.XxO4oPdH89lZ/x9gR.	2025-04-15 23:03:00.368101	2
184	dr_leo_silva	dr_leo_silva@example.com	$2b$10$kUMhXGjFbR34ZGqS3/AU8uarvZLCm./gAcvbYGEaV3RgXzDLpuSBu	2025-04-15 23:03:00.41964	2
185	dr_aisha_abdi	dr_aisha_abdi@example.com	$2b$10$Oz/dNX.DSVDn/Nxok.iUMeQMkhluANRo7.mBtBdqWMn4K0GAOm23q	2025-04-15 23:03:00.47151	2
186	dr_victor_lopez	dr_victor_lopez@example.com	$2b$10$UOuRuyDuVyCxcztSUHoff.UFYT2afVJGUXxNvIiQKcezwonlTNe9W	2025-04-15 23:03:00.521595	2
187	dr_mei_zhang	dr_mei_zhang@example.com	$2b$10$5ANYUcx.vVcc3qVBwJR7p.ByzzpHhPvK/bAhmU0hrFTUswKx5TFQK	2025-04-15 23:03:00.57193	2
188	dr_yara_hassan	dr_yara_hassan@example.com	$2b$10$iWNGoKR2fWw.Epbwik8C2uX61uZoJzi8xIfSajWJRB7nBZzU1O6BC	2025-04-15 23:03:00.621868	2
189	dr_jonas_muller	dr_jonas_muller@example.com	$2b$10$IA8y5Mqihlz4fgAEsiOgXuAlmO44hsH4d0ojNl2bKwExm0qM6CbLa	2025-04-15 23:03:00.67173	2
190	dr_anika_singh	dr_anika_singh@example.com	$2b$10$B4yD1l7232TQPB21Cca2YeQOM832CzQlf3hw8GEkKno6LeLNQ5jee	2025-04-15 23:03:00.72179	2
191	dr_samir_farouk	dr_samir_farouk@example.com	$2b$10$CIS1IS6EyCvpKau/jD91TuO6UtgX4.om6aHSJkznpw9NYvfiBuxJG	2025-04-15 23:03:00.771691	2
192	dr_layla_hamid	dr_layla_hamid@example.com	$2b$10$Yd51u/Rwfe27S9tdyOMZNOPw.9cuLuH5Vv8OJR3Zx5jGbvsoHkqvS	2025-04-15 23:03:00.821643	2
193	dr_noah_walker	dr_noah_walker@example.com	$2b$10$gl1NFjRBYqAvSDUD.ODVz..EQJQuV3navyt0U0PpfRbFywcm/WFGm	2025-04-15 23:03:00.87139	2
194	dr_elena_ivanova	dr_elena_ivanova@example.com	$2b$10$igpNqGxaeTH6fExrmWTTle4C8sgVUSBAA3neJP5vnrfB1wuqk1TF6	2025-04-15 23:03:00.921239	2
195	dr_ravi_patel	dr_ravi_patel@example.com	$2b$10$GrLq0bSERaQ0SENpwajJI.u/CdEqkDKuCYtJhnuTNtMrujFL43V8q	2025-04-15 23:03:00.971261	2
196	dr_tariq_qureshi	dr_tariq_qureshi@example.com	$2b$10$x02dNkm6eWAG6c2j0jfiAu.dREo8mjzx2i/JWYghj.jXkoafHheYG	2025-04-15 23:03:01.020854	2
197	dr_sara_ahmed	dr_sara_ahmed@example.com	$2b$10$nWmQG.EdQaLK6VK5AJ1QYe4CioXem3BcgsLZx1GUp1trruVGOQrX6	2025-04-15 23:03:01.071687	2
198	dr_miguel_ramos	dr_miguel_ramos@example.com	$2b$10$e3YF9SxOZGKjjP9suHb8.uIoBNPpBf5P.toVQCbUoHIOxCfHNpXOq	2025-04-15 23:03:01.121272	2
199	dr_dina_nasr	dr_dina_nasr@example.com	$2b$10$5HdcBRry4A5JZ26h19.PRe9MggwI/.6KKCPOSF1B7JRXLtOje/tgS	2025-04-15 23:03:01.170793	2
200	dr_louis_dupont	dr_louis_dupont@example.com	$2b$10$wkQsSrfUwMJ9cCFaJEp/m.bpoCTM3LRFN/YhqICAVaKN9nPqtBgx6	2025-04-15 23:03:01.219767	2
201	dr_maya_sharma	dr_maya_sharma@example.com	$2b$10$WCkssoGP9vnA3BZXO5umK.X6bodSOPBvtYQi9igtVOpGML5ifyY0i	2025-04-15 23:03:01.270048	2
202	dr_reza_moradi	dr_reza_moradi@example.com	$2b$10$OTR6MmutW59uAcukrVUlM.4Ct.q6T2VTcdZM0f/YNPDwGxNcSBwXS	2025-04-15 23:03:01.319748	2
203	dr_amelia_cardiac	a@aa.a	$2b$10$cphGsDPixdTI2vlZ4nVrHulg9P5ZW8UeM2sDVifa6Z.6bteisczkG	2025-04-15 23:25:23.575287	2
204	dr_amelia_cardiac	b@a.a	$2b$10$owhNCDAioU5tWSmpqNvoF.vpk38Kn9h9tDdew4I2nf1zYVtxKNLsK	2025-04-15 23:25:46.857782	2
205	dr_amelia_cardiac	c@a.a	$2b$10$WN6SCv79JJVyZpKB7WE1keq8xV/5pfcecMXOSgwZXa02cxcd2L2DK	2025-04-15 23:27:24.372664	2
206	dr_amelia_cardiac	hell@a.a	$2b$10$NMRAeXHDGoug3faj9xnCR.GdGCgcAGjgNu4TswC6OJnADT/qQOjwy	2025-04-15 23:39:31.044217	2
207	dr_amelia_cardiac	h@a.a	$2b$10$LdJKm2FAS.YTUKrr.2kZsOhDj.cApcFFmv5.Uwb5bFm2o4vX1ky.m	2025-04-15 23:40:14.624275	2
208	dr_greenfield	b@b.b	$2b$10$1oXU25vrIV.yp4//.bmfU.elex6QLvKMtsva6PHebV6CvbwGMuaRi	2025-04-15 23:50:48.59225	1
209	dr_greenfield	b@be.b	$2b$10$uZN4y4J3lX4xcjFc59sD.O0Z4j7zqKkLChxKrjMRzgLvL1V9VrATa	2025-04-15 23:51:33.757333	1
210	dr_greenfield	b@e.b	$2b$10$ML.AL1LYwjJQ7bVIYk0UpO5Q6Yze.wGVDOqcJei5UIbvAC6qWliM6	2025-04-15 23:52:00.386979	1
211	dr_greenfield	b@c.b	$2b$10$dYpXQuxGRV.CD.y9Hj5D2ehkgN9STRt7d5BINTANdS5yCyGfsvrHO	2025-04-15 23:52:29.433454	1
212	dr_greenfield	b@f.b	$2b$10$O/J9CS4EiRrEGiLFgzC7SOi.VWzhc.pvS9uaT8DrGfUYsgRekLtAO	2025-04-15 23:54:50.955605	1
213	dr_greenfield	gb@f.b	$2b$10$.8clUOYzq7JsvFZXaiMwiuV30jYv/Zmep2yenOePO5S4MiWIGhxl2	2025-04-15 23:56:19.741444	1
214	dr_greenfield	r@f.b	$2b$10$WOwY.qV0rhkIBvnJ.gh/TuTKRs4rPtqWkLB.ryZIP.cD1oqGvuveK	2025-04-15 23:58:07.70369	1
215	aymen	x@v.v	$2b$10$QY27cVT3aZQA59A55V4tDO57Ts4fWt.ZcG8L2GB4AsLgPSr7XmSgG	2025-04-19 20:14:19.108402	3
216	anis	anisdz@gmail.com	$2b$10$5F7vCRPt06ZwKSxUAFaSH.IZ48jTabzCUbR3DpO5CI3chGb.5Ekpi	2025-04-21 21:48:07.408813	1
\.


--
-- Name: doctor_general_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mehdi
--

SELECT pg_catalog.setval('public.doctor_general_id_seq', 20, true);


--
-- Name: doctor_specialty_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mehdi
--

SELECT pg_catalog.setval('public.doctor_specialty_id_seq', 33, true);


--
-- Name: patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mehdi
--

SELECT pg_catalog.setval('public.patients_id_seq', 15, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mehdi
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- Name: schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mehdi
--

SELECT pg_catalog.setval('public.schedule_id_seq', 18, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mehdi
--

SELECT pg_catalog.setval('public.users_id_seq', 216, true);


--
-- Name: doctor_general doctor_general_doctor_number_key; Type: CONSTRAINT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.doctor_general
    ADD CONSTRAINT doctor_general_doctor_number_key UNIQUE (doctor_number);


--
-- Name: doctor_general doctor_general_pkey; Type: CONSTRAINT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.doctor_general
    ADD CONSTRAINT doctor_general_pkey PRIMARY KEY (id);


--
-- Name: doctor_specialty doctor_specialty_pkey; Type: CONSTRAINT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.doctor_specialty
    ADD CONSTRAINT doctor_specialty_pkey PRIMARY KEY (id);


--
-- Name: patients patients_email_key; Type: CONSTRAINT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_email_key UNIQUE (email);


--
-- Name: patients patients_patient_id_key; Type: CONSTRAINT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_patient_id_key UNIQUE (patient_id);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- Name: schedule schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT schedule_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: patients patients_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.users(id);


--
-- Name: patients patients_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: schedule schedule_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT schedule_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.users(id);


--
-- Name: schedule schedule_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT schedule_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id);


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mehdi
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- PostgreSQL database dump complete
--

