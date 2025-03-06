--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-03-06 23:58:49

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
-- TOC entry 226 (class 1259 OID 16468)
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16467)
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_id_seq OWNER TO postgres;

--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 225
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- TOC entry 220 (class 1259 OID 16399)
-- Name: announcements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.announcements (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    file_url character varying(255),
    public_id character varying(255),
    date character varying(50) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.announcements OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16398)
-- Name: announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.announcements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.announcements_id_seq OWNER TO postgres;

--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 219
-- Name: announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.announcements_id_seq OWNED BY public.announcements.id;


--
-- TOC entry 228 (class 1259 OID 16480)
-- Name: data_anak; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.data_anak (
    id integer NOT NULL,
    nama character varying(255) NOT NULL,
    nik character varying(20) NOT NULL,
    tempat_lahir character varying(255),
    tanggal_lahir date,
    pendidikan_terakhir character varying(50),
    ranking integer,
    total_siswa integer,
    tinggal_kelas boolean,
    jumlah_saudara integer,
    anak_ke integer,
    tinggi_badan integer,
    berat_badan integer,
    kebiasaan text,
    alamat text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.data_anak OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 24765)
-- Name: data_pendaftaran; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.data_pendaftaran (
    id integer NOT NULL,
    user_id integer,
    nomor_kk character varying(20),
    nomor_pendaftaran character varying(50),
    nisn character varying(20),
    nama character varying(255),
    tempat_tanggal_lahir character varying(255),
    nik character varying(20),
    agama character varying(50) DEFAULT 'Islam'::character varying,
    berat_badan integer,
    tinggi_badan integer,
    pendidikan_masuk_panti character varying(100),
    nomor_bpjs character varying(30),
    status character varying(50),
    daerah_asal_kabupaten character varying(100),
    nama_ayah character varying(255),
    nik_ayah character varying(20),
    agama_ayah character varying(50) DEFAULT 'Islam'::character varying,
    pendidikan_ayah character varying(100),
    pekerjaan_ayah character varying(100),
    status_ayah character varying(50),
    nama_ibu character varying(255),
    nik_ibu character varying(20),
    agama_ibu character varying(50) DEFAULT 'Islam'::character varying,
    pendidikan_ibu character varying(100),
    pekerjaan_ibu character varying(100),
    nomor_hp character varying(20),
    sdn character varying(255),
    sltp character varying(255),
    slta character varying(255),
    khatam_quran character varying(255),
    prestasi_1 text,
    prestasi_2 text
);


ALTER TABLE public.data_pendaftaran OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 24764)
-- Name: data_pendaftaran_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.data_pendaftaran_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.data_pendaftaran_id_seq OWNER TO postgres;

--
-- TOC entry 5008 (class 0 OID 0)
-- Dependencies: 237
-- Name: data_pendaftaran_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.data_pendaftaran_id_seq OWNED BY public.data_pendaftaran.id;


--
-- TOC entry 234 (class 1259 OID 16524)
-- Name: hubungan_sosial_ibadah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hubungan_sosial_ibadah (
    id integer NOT NULL,
    user_id integer,
    hubungan_masyarakat character varying(50),
    semangat_kegiatan_sosial character varying(50),
    ibadah_anak character varying(50),
    ibadah_bapak character varying(50),
    ibadah_ibu character varying(50),
    anak_ibadah_sering character varying(50),
    bapak_ibadah_sering character varying(50),
    ibu_ibadah_sering character varying(50),
    baca_quran_anak character varying(50),
    baca_quran_bapak character varying(50),
    baca_quran_ibu character varying(50),
    CONSTRAINT hubungan_sosial_ibadah_baca_quran_anak_check CHECK (((baca_quran_anak)::text = ANY ((ARRAY['Sangat Baik'::character varying, 'Cukup Baik'::character varying, 'Kurang'::character varying])::text[]))),
    CONSTRAINT hubungan_sosial_ibadah_baca_quran_bapak_check CHECK (((baca_quran_bapak)::text = ANY ((ARRAY['Sangat Baik'::character varying, 'Cukup Baik'::character varying, 'Kurang'::character varying])::text[]))),
    CONSTRAINT hubungan_sosial_ibadah_baca_quran_ibu_check CHECK (((baca_quran_ibu)::text = ANY ((ARRAY['Sangat Baik'::character varying, 'Cukup Baik'::character varying, 'Kurang'::character varying])::text[]))),
    CONSTRAINT hubungan_sosial_ibadah_hubungan_masyarakat_check CHECK (((hubungan_masyarakat)::text = ANY ((ARRAY['Sangat'::character varying, 'Cukup'::character varying, 'Kurang'::character varying])::text[]))),
    CONSTRAINT hubungan_sosial_ibadah_ibadah_anak_check CHECK (((ibadah_anak)::text = ANY ((ARRAY['Rajin'::character varying, 'Sedang'::character varying, 'Kurang'::character varying])::text[]))),
    CONSTRAINT hubungan_sosial_ibadah_ibadah_bapak_check CHECK (((ibadah_bapak)::text = ANY ((ARRAY['Rajin'::character varying, 'Sedang'::character varying, 'Kurang'::character varying])::text[]))),
    CONSTRAINT hubungan_sosial_ibadah_ibadah_ibu_check CHECK (((ibadah_ibu)::text = ANY ((ARRAY['Rajin'::character varying, 'Sedang'::character varying, 'Kurang'::character varying])::text[]))),
    CONSTRAINT hubungan_sosial_ibadah_semangat_kegiatan_sosial_check CHECK (((semangat_kegiatan_sosial)::text = ANY ((ARRAY['Sangat'::character varying, 'Cukup'::character varying, 'Kurang'::character varying])::text[])))
);


ALTER TABLE public.hubungan_sosial_ibadah OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16523)
-- Name: hubungan_sosial_ibadah_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hubungan_sosial_ibadah_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hubungan_sosial_ibadah_id_seq OWNER TO postgres;

--
-- TOC entry 5009 (class 0 OID 0)
-- Dependencies: 233
-- Name: hubungan_sosial_ibadah_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hubungan_sosial_ibadah_id_seq OWNED BY public.hubungan_sosial_ibadah.id;


--
-- TOC entry 232 (class 1259 OID 16509)
-- Name: kondisi_ekonomi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kondisi_ekonomi (
    id integer NOT NULL,
    user_id integer,
    gambaran_rumah text,
    status_rumah character varying(50),
    penghasilan_bulanan integer,
    pengeluaran_bulanan integer,
    perabotan text,
    tempat_bekerja character varying(100),
    sumber_pendapatan character varying(50),
    jarak_sd numeric(5,2),
    jarak_sltp numeric(5,2),
    jarak_slta numeric(5,2),
    jarak_pusat_keramaian numeric(5,2),
    kunjungan_pasar_orang_tua integer,
    kunjungan_pasar_anak integer,
    sanitasi character varying(50),
    makanan_suka text,
    makanan_tidak_suka text,
    dukungan_pendidikan_orang_tua boolean,
    dukungan_pendidikan_mamak boolean,
    dukungan_pendidikan_saudara_ibu boolean,
    dukungan_pendidikan_saudara_bapak boolean,
    CONSTRAINT kondisi_ekonomi_status_rumah_check CHECK (((status_rumah)::text = ANY ((ARRAY['Milik Sendiri'::character varying, 'Sewa'::character varying, 'Numpang'::character varying])::text[])))
);


ALTER TABLE public.kondisi_ekonomi OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16508)
-- Name: kondisi_ekonomi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kondisi_ekonomi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kondisi_ekonomi_id_seq OWNER TO postgres;

--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 231
-- Name: kondisi_ekonomi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kondisi_ekonomi_id_seq OWNED BY public.kondisi_ekonomi.id;


--
-- TOC entry 224 (class 1259 OID 16446)
-- Name: media_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media_items (
    id integer NOT NULL,
    url character varying(255) NOT NULL,
    public_id character varying(255),
    title character varying(255) NOT NULL,
    description text,
    author character varying(255) NOT NULL,
    media_type character varying(50) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.media_items OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16445)
-- Name: media_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.media_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_items_id_seq OWNER TO postgres;

--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 223
-- Name: media_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.media_items_id_seq OWNED BY public.media_items.id;


--
-- TOC entry 218 (class 1259 OID 16389)
-- Name: news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    writer character varying(255) NOT NULL,
    image_url character varying(255),
    public_id character varying(255),
    date character varying(50) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.news OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16388)
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_id_seq OWNER TO postgres;

--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 217
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- TOC entry 230 (class 1259 OID 16492)
-- Name: orang_tua; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orang_tua (
    id integer NOT NULL,
    user_id integer,
    jenis character varying(10),
    nama character varying(255) NOT NULL,
    nik character varying(20) NOT NULL,
    nama_kecil character varying(255),
    jumlah_saudara integer,
    pendidikan character varying(50),
    pekerjaan character varying(100),
    alamat text,
    no_hp character varying(20),
    CONSTRAINT orang_tua_jenis_check CHECK (((jenis)::text = ANY ((ARRAY['Ayah'::character varying, 'Ibu'::character varying])::text[])))
);


ALTER TABLE public.orang_tua OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16491)
-- Name: orang_tua_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orang_tua_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orang_tua_id_seq OWNER TO postgres;

--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 229
-- Name: orang_tua_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orang_tua_id_seq OWNED BY public.orang_tua.id;


--
-- TOC entry 242 (class 1259 OID 32972)
-- Name: persyaratan_sekolah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.persyaratan_sekolah (
    id integer NOT NULL,
    user_id integer,
    fotocopy_akte_kelahiran_sekolah text,
    fotocopy_nisn_sekolah text,
    fotocopy_rapor_5_semester text,
    pas_foto_sekolah text,
    fotocopy_kartu_keluarga_sekolah text,
    fotocopy_ijazah_sementara text,
    fotocopy_surat_tanda_kelulusan text,
    fotocopy_sktm text,
    fotocopy_sertifikat_prestasi text,
    fotocopy_sertifikat_akreditasi text,
    fotocopy_user_password_ppdb text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.persyaratan_sekolah OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 32971)
-- Name: persyaratan_sekolah_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.persyaratan_sekolah_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.persyaratan_sekolah_id_seq OWNER TO postgres;

--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 241
-- Name: persyaratan_sekolah_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.persyaratan_sekolah_id_seq OWNED BY public.persyaratan_sekolah.id;


--
-- TOC entry 240 (class 1259 OID 32957)
-- Name: syarat_administrasi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.syarat_administrasi (
    id integer NOT NULL,
    user_id integer,
    surat_rekomendasi text,
    surat_permohonan text,
    surat_keterangan_miskin text,
    nisn text,
    surat_keterangan_sehat text,
    fotocopy_rapor_skhu_sttb text,
    fotocopy_akte_kelahiran text,
    ijazah_khatam text,
    fotocopy_kartu_keluarga text,
    fotocopy_ijazah_terakhir text,
    no_hp text,
    rapor_surat_pindah text,
    kartu_kis_bpjs text,
    surat_dtks text,
    ukuran_seragam_sepatu text,
    pas_foto text,
    pakaian_harian text,
    pakaian_seragam_sekolah text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.syarat_administrasi OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 32956)
-- Name: syarat_administrasi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.syarat_administrasi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.syarat_administrasi_id_seq OWNER TO postgres;

--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 239
-- Name: syarat_administrasi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.syarat_administrasi_id_seq OWNED BY public.syarat_administrasi.id;


--
-- TOC entry 222 (class 1259 OID 16409)
-- Name: test_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test_table (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.test_table OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16408)
-- Name: test_table_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.test_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.test_table_id_seq OWNER TO postgres;

--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 221
-- Name: test_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.test_table_id_seq OWNED BY public.test_table.id;


--
-- TOC entry 236 (class 1259 OID 16573)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    nik character varying(20) DEFAULT ''::character varying,
    nama character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16479)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 227
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.data_anak.id;


--
-- TOC entry 235 (class 1259 OID 16572)
-- Name: users_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq1 OWNER TO postgres;

--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 235
-- Name: users_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq1 OWNED BY public.users.id;


--
-- TOC entry 4762 (class 2604 OID 16471)
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- TOC entry 4757 (class 2604 OID 16402)
-- Name: announcements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements ALTER COLUMN id SET DEFAULT nextval('public.announcements_id_seq'::regclass);


--
-- TOC entry 4764 (class 2604 OID 16483)
-- Name: data_anak id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_anak ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4772 (class 2604 OID 24768)
-- Name: data_pendaftaran id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_pendaftaran ALTER COLUMN id SET DEFAULT nextval('public.data_pendaftaran_id_seq'::regclass);


--
-- TOC entry 4768 (class 2604 OID 16527)
-- Name: hubungan_sosial_ibadah id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hubungan_sosial_ibadah ALTER COLUMN id SET DEFAULT nextval('public.hubungan_sosial_ibadah_id_seq'::regclass);


--
-- TOC entry 4767 (class 2604 OID 16512)
-- Name: kondisi_ekonomi id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kondisi_ekonomi ALTER COLUMN id SET DEFAULT nextval('public.kondisi_ekonomi_id_seq'::regclass);


--
-- TOC entry 4760 (class 2604 OID 16449)
-- Name: media_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_items ALTER COLUMN id SET DEFAULT nextval('public.media_items_id_seq'::regclass);


--
-- TOC entry 4755 (class 2604 OID 16392)
-- Name: news id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- TOC entry 4766 (class 2604 OID 16495)
-- Name: orang_tua id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orang_tua ALTER COLUMN id SET DEFAULT nextval('public.orang_tua_id_seq'::regclass);


--
-- TOC entry 4778 (class 2604 OID 32975)
-- Name: persyaratan_sekolah id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persyaratan_sekolah ALTER COLUMN id SET DEFAULT nextval('public.persyaratan_sekolah_id_seq'::regclass);


--
-- TOC entry 4776 (class 2604 OID 32960)
-- Name: syarat_administrasi id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.syarat_administrasi ALTER COLUMN id SET DEFAULT nextval('public.syarat_administrasi_id_seq'::regclass);


--
-- TOC entry 4759 (class 2604 OID 16412)
-- Name: test_table id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_table ALTER COLUMN id SET DEFAULT nextval('public.test_table_id_seq'::regclass);


--
-- TOC entry 4769 (class 2604 OID 16576)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq1'::regclass);


--
-- TOC entry 4984 (class 0 OID 16468)
-- Dependencies: 226
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, email, password_hash, created_at) FROM stdin;
1	rikob132@gmail.com	riko2003;	2025-02-24 12:54:07.076548
2	admin@example.com	$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW	2025-02-24 13:37:18.594387
3	1	1	2025-02-24 14:06:33.111659
4	admin@admin.com	$2y$10$H3dLTTIn2cVDINk219es3OwtIbmSC.lSpkY4fDgLkZzUgpoyKqLhW	2025-02-24 14:16:37.696635
5	test@admin.com	$2b$10$1.u5wemo.eylS3GVWTxmBeuPgnshxsJtmdUYpuwA/w17XkmVQeej6	2025-02-24 14:42:54.889395
\.


--
-- TOC entry 4978 (class 0 OID 16399)
-- Dependencies: 220
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.announcements (id, title, description, file_url, public_id, date, "timestamp") FROM stdin;
17	try1	1		ryrw63d0ujsrfrx9gyqi.pdf	Selasa, 25 Februari 2025	2025-02-25 10:31:45.915
18	Peraturan Terbaru	2025	https://res.cloudinary.com/df4qrohsq/raw/upload/v1741243849/nsdeulfdjyxedrbje13x.pdf	nsdeulfdjyxedrbje13x.pdf	Selasa, 25 Februari 2025	2025-02-25 10:47:39.307
21	Pengumuman 	Admin	https://res.cloudinary.com/df4qrohsq/raw/upload/v1740797213/skmvzijvkcucucvfku5a.pdf	skmvzijvkcucucvfku5a.pdf	Sabtu, 1 Maret 2025	2025-03-01 02:46:52.199
20	Perubahan Jadwal Visit	-	https://res.cloudinary.com/df4qrohsq/raw/upload/v1740709957/ittdrnlwj9ewaruf4vxs.pdf	ittdrnlwj9ewaruf4vxs.pdf	Jumat, 28 Februari 2025	2025-02-28 02:30:52.449
19	Pergantian Staff Tata Usaha Panti	2025			Selasa, 25 Februari 2025	2025-02-25 14:22:11.218
\.


--
-- TOC entry 4986 (class 0 OID 16480)
-- Dependencies: 228
-- Data for Name: data_anak; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.data_anak (id, nama, nik, tempat_lahir, tanggal_lahir, pendidikan_terakhir, ranking, total_siswa, tinggal_kelas, jumlah_saudara, anak_ke, tinggi_badan, berat_badan, kebiasaan, alamat, created_at) FROM stdin;
5	Riko Firmansyah2rest	1111	Dumai	2025-02-24	SD	1	11	f	3	1	12	122	hidup	Jl.Srigunting	2025-03-03 20:19:56.829568
6	Syahir	12345678901011	Jakarta	2025-02-24	SMA	1	29	f	2	2	181	80	hidup	Jl. Siteba	2025-03-04 11:41:02.122699
9	SyahirLosss	12345678901012	Jakarta	2025-02-23	SMA	1	29	f	2	2	181	80	hidup	Jl. Siteba	2025-03-04 12:59:46.39046
10	Uni	1234	Dumai	2025-03-02	SMA	1	1	f	1	1	123	33	hidup	Jl. Siteba	2025-03-04 13:10:30.578425
20	Riko Firmansyahedit	1472012705030001	Dumai	2025-02-20	SMA	1	31	f	2	-1	181	90	hidup	Jl. Siteba	2025-03-01 12:06:55.703668
15	Riko Firmansyah2rest	11111	Dumai	2025-02-24	SD	1	11	f	3	1	12	122	hidup	Jl. Siteba	2025-03-05 09:40:25.386675
17	looss	111111	Dumai	2025-02-25	SD	1	11	f	3	1	12	122	hidup	Jl. Siteba	2025-03-05 09:48:35.890541
18	adit	123456	Dumai	2025-02-24	SMA	1	1	f	1	1	123	33	hidup	Jl. Siteba	2025-03-05 09:53:57.617198
21	budi	999	Dumai	2025-03-04	SMA	1	5	f	1	1	100	29	hidup	Jl. Siteba	2025-03-05 09:58:29.547714
22	Firman	888	Dumai	2025-02-24	SMA	1	2	f	1	2	181	81	hidup	Jl. Siteba	2025-03-05 10:01:46.139386
\.


--
-- TOC entry 4996 (class 0 OID 24765)
-- Dependencies: 238
-- Data for Name: data_pendaftaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.data_pendaftaran (id, user_id, nomor_kk, nomor_pendaftaran, nisn, nama, tempat_tanggal_lahir, nik, agama, berat_badan, tinggi_badan, pendidikan_masuk_panti, nomor_bpjs, status, daerah_asal_kabupaten, nama_ayah, nik_ayah, agama_ayah, pendidikan_ayah, pekerjaan_ayah, status_ayah, nama_ibu, nik_ibu, agama_ibu, pendidikan_ibu, pekerjaan_ibu, nomor_hp, sdn, sltp, slta, khatam_quran, prestasi_1, prestasi_2) FROM stdin;
2	20	14720127030001	p45	edit	Riko Firmansyah	\N	1472012705030001	Islam	\N	\N	\N	\N	Aktif	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	SDS YEKAP	SMPN DWAA	SMANJUR	2	gak ada	
\.


--
-- TOC entry 4992 (class 0 OID 16524)
-- Dependencies: 234
-- Data for Name: hubungan_sosial_ibadah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hubungan_sosial_ibadah (id, user_id, hubungan_masyarakat, semangat_kegiatan_sosial, ibadah_anak, ibadah_bapak, ibadah_ibu, anak_ibadah_sering, bapak_ibadah_sering, ibu_ibadah_sering, baca_quran_anak, baca_quran_bapak, baca_quran_ibu) FROM stdin;
1	20	Cukup	Cukup	Sedang	Sedang	Sedang	Sholat Sendiri Saja	Berjamah di Masjid/Rumah	Berjamah di Masjid/Rumah	Kurang	Cukup Baik	Sangat Baik
\.


--
-- TOC entry 4990 (class 0 OID 16509)
-- Dependencies: 232
-- Data for Name: kondisi_ekonomi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kondisi_ekonomi (id, user_id, gambaran_rumah, status_rumah, penghasilan_bulanan, pengeluaran_bulanan, perabotan, tempat_bekerja, sumber_pendapatan, jarak_sd, jarak_sltp, jarak_slta, jarak_pusat_keramaian, kunjungan_pasar_orang_tua, kunjungan_pasar_anak, sanitasi, makanan_suka, makanan_tidak_suka, dukungan_pendidikan_orang_tua, dukungan_pendidikan_mamak, dukungan_pendidikan_saudara_ibu, dukungan_pendidikan_saudara_bapak) FROM stdin;
2	\N	Gubuk	Sewa	100000	10000	Lemari	Indomaret	Bapak saja	2.00	2.00	2.00	2.00	1	1	Sungai	Mi	sayur	t	t	f	f
3	20	Gubuk3editinging	Milik Sendiri	10000	10000	Lemari	Indomaret	Bapak saja	2.00	2.00	2.00	2.00	1	1	WC Umum	Mi	sayur	t	t	t	t
\.


--
-- TOC entry 4982 (class 0 OID 16446)
-- Dependencies: 224
-- Data for Name: media_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media_items (id, url, public_id, title, description, author, media_type, "timestamp") FROM stdin;
4	https://res.cloudinary.com/df4qrohsq/image/upload/v1740489000/opuhfwdffczng0wi5adp.png	opuhfwdffczng0wi5adp	Struktur UTPD PSAA	Panti Sosial Asuhan Anak Tri Murni	admin	struktur	2025-02-25 13:10:00.371
5	https://res.cloudinary.com/df4qrohsq/image/upload/v1740489597/gvshpq6aufjdsbjgpq9y.png	gvshpq6aufjdsbjgpq9y	testgalery	wea	ew	gallery	2025-02-25 13:19:58.464
7	https://res.cloudinary.com/df4qrohsq/image/upload/v1740709517/lwplwdz3peftc4bhma45.jpg	lwplwdz3peftc4bhma45	UPTD-PSAA	Apel Pagi	admin	slideshow	2025-02-28 02:25:17.488
3	https://res.cloudinary.com/df4qrohsq/image/upload/v1740709587/g2zkjgjs6hruac5sm7ye.jpg	g2zkjgjs6hruac5sm7ye	Panti Sosial Asuhan Anak Tri Murni	-	admin	slideshow	2025-02-25 06:53:40.634
2	https://res.cloudinary.com/df4qrohsq/image/upload/v1740709657/u7d4dalgrfffcn4wwnyb.png	u7d4dalgrfffcn4wwnyb	Sejarah Pict	-	admin	sejarah	2025-02-24 18:39:20.367
8	https://res.cloudinary.com/df4qrohsq/image/upload/v1740709694/vclvat5xite02jpfsvzz.png	vclvat5xite02jpfsvzz	Gallery	-	admin	gallery	2025-02-28 02:28:14.232
9	https://res.cloudinary.com/df4qrohsq/image/upload/v1740709743/b3nwgounma7f9mezftci.jpg	b3nwgounma7f9mezftci	Prestasi Anak Panti	-	admin	gallery	2025-02-28 02:29:03.265
10	https://res.cloudinary.com/df4qrohsq/image/upload/v1740709776/jvnfldeazgoytbovqi7b.jpg	jvnfldeazgoytbovqi7b	Buka Bersama Anak Panti	-	admin	gallery	2025-02-28 02:29:36.871
\.


--
-- TOC entry 4976 (class 0 OID 16389)
-- Dependencies: 218
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news (id, title, content, writer, image_url, public_id, date, "timestamp") FROM stdin;
1	Test Title	Test Content	Test Writer	test.jpg	12345	2024-02-24	2025-02-24 17:39:29.12699
10	please work1edit2wkwk3	1	11	https://res.cloudinary.com/df4qrohsq/image/upload/v1740397527/cr5etuewt3y4dleludaq.png	cr5etuewt3y4dleludaq	Senin, 24 Februari 2025	2025-02-25 05:49:09.079
20	asdaediyasdasd	asdasd	sd	https://res.cloudinary.com/df4qrohsq/image/upload/v1740481882/sezmkoqeyryfvd4z0twj.png	sezmkoqeyryfvd4z0twj	Selasa, 25 Februari 2025	2025-02-25 11:11:23.258
21	Berita1	-	admin	https://res.cloudinary.com/df4qrohsq/image/upload/v1740709815/leaaxm2pmfo2qcyk2lca.jpg	leaaxm2pmfo2qcyk2lca	Jumat, 28 Februari 2025	2025-02-28 02:30:15.713
22	Prestasi Anak Panti Asuhan	-	Admin	https://res.cloudinary.com/df4qrohsq/image/upload/v1741243355/pakmgya18icexa7agce7.jpg	pakmgya18icexa7agce7	Kamis, 6 Maret 2025	2025-03-06 06:42:33.219
23	Buka Bersama Anak Panti	-	admin	https://res.cloudinary.com/df4qrohsq/image/upload/v1741243379/uronslnqlund40n36fr9.jpg	uronslnqlund40n36fr9	Kamis, 6 Maret 2025	2025-03-06 06:42:57.27
\.


--
-- TOC entry 4988 (class 0 OID 16492)
-- Dependencies: 230
-- Data for Name: orang_tua; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orang_tua (id, user_id, jenis, nama, nik, nama_kecil, jumlah_saudara, pendidikan, pekerjaan, alamat, no_hp) FROM stdin;
23	\N	Ayah	Uni	1472012705030001	uni	1	SMA	halal	Jl. Siteba	082289254481
25	\N	Ayah	Uni	1472012705030011	uni	1	SMA	halal	Jl. Siteba	082289254481
27	\N	Ayah	Uni	1472012705030099	uni	1	SMA	halal	Jl. Siteba	082289254481
28	\N	Ibu	Uda	1472012705030088	uni	5	S1	bakwan	Jl. Siteba	082289254481
54	\N	Ayah	Uni	1472012705031000	uni	1	SMA	halal	Jl. Siteba	082289254481
55	\N	Ibu	Uda	1472012705031001	uni	5	S1	bakwan	Jl. Siteba	082289254481
62	5	Ayah	Uni	15	uni	1	SMA	halal	Jl.Srigunting	082289254481
63	5	Ibu	Uda	16	uni	5	S1	bakwan	Jl. Siteba	082289254481
64	6	Ayah	Riko Firmansyah	1472010527030011	uni	3	SMA	halal	Jl. Siteba	082289254481
65	6	Ibu	Uni	1472012703050011	uni	4	SMA	halal	Jl. Siteba	082289254481
66	9	Ayah	Riko Firmansyah	1472010527030012	uni	3	SMA	halal	Jl.Srigunting	082289254481
67	9	Ibu	Uni	1472012703050012	uni	4	SMA	halal	Jl. Siteba	082289254481
68	10	Ayah	Uni	12345	uni	1	sd	halal	Jl.Srigunting	082289254481
69	10	Ibu	Riko 	123456	uni	1	SMA	halal	Jl. Siteba	082289254481
16	20	Ayah	Uniedit	1472012705030002	uni	1	SMA	halal	Jl. Siteba	082289254481
17	20	Ibu	Uda	1472012705030003	uni	5	S1	bakwan	Jl. Siteba	082289254481
70	15	Ayah	Uni	11116	uni	1	SMA	halal	Jl. Siteba	082289254481
71	15	Ibu	Uda	11117	uni	5	S1	bakwan	Jl. Siteba	082289254481
72	17	Ayah	Uni	111163	uni	1	SMA	halal		082289254481
73	17	Ibu	Uda	111173	uni	5	S1	bakwan	Jl. Siteba	082289254481
74	18	Ayah	Uni	1234563	uni	1	sd	halal	Jl. Siteba	082289254481
75	18	Ibu	Riko 	1234564	uni	1	SMA	halal	Jl. Siteba	082289254481
76	21	Ayah	Syahir	9991	hir	2	SMA	halal	Jl. Siteba	082289254481
77	21	Ibu	Evi	9992	epi	2	SMA	halal	Jl. Siteba	082289254481
78	22	Ayah	Uni	8882	uni	1	SMA	halal	Jl. Siteba	082289254481
79	22	Ibu	Uni	8881	uni	0	SMA	halal	Jl. Siteba	082289254481
\.


--
-- TOC entry 5000 (class 0 OID 32972)
-- Dependencies: 242
-- Data for Name: persyaratan_sekolah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.persyaratan_sekolah (id, user_id, fotocopy_akte_kelahiran_sekolah, fotocopy_nisn_sekolah, fotocopy_rapor_5_semester, pas_foto_sekolah, fotocopy_kartu_keluarga_sekolah, fotocopy_ijazah_sementara, fotocopy_surat_tanda_kelulusan, fotocopy_sktm, fotocopy_sertifikat_prestasi, fotocopy_sertifikat_akreditasi, fotocopy_user_password_ppdb, created_at) FROM stdin;
1	5	https://res.cloudinary.com/df4qrohsq/raw/upload/v1741015244/iuztrsaewyhcmvwocf1r.pdf											2025-03-03 22:20:40.620896
2	20	https://res.cloudinary.com/df4qrohsq/raw/upload/v1741015982/vid2mymg7a846gboxiwy.pdf											2025-03-03 22:32:59.055458
\.


--
-- TOC entry 4998 (class 0 OID 32957)
-- Dependencies: 240
-- Data for Name: syarat_administrasi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.syarat_administrasi (id, user_id, surat_rekomendasi, surat_permohonan, surat_keterangan_miskin, nisn, surat_keterangan_sehat, fotocopy_rapor_skhu_sttb, fotocopy_akte_kelahiran, ijazah_khatam, fotocopy_kartu_keluarga, fotocopy_ijazah_terakhir, no_hp, rapor_surat_pindah, kartu_kis_bpjs, surat_dtks, ukuran_seragam_sepatu, pas_foto, pakaian_harian, pakaian_seragam_sekolah, created_at) FROM stdin;
1	20	https://res.cloudinary.com/df4qrohsq/raw/upload/v1741015960/fioc35ab7d2ut5vkcy87.pdf	https://res.cloudinary.com/df4qrohsq/raw/upload/v1741069114/buzp6pqutkknu9w4aaev.pdf	https://res.cloudinary.com/df4qrohsq/raw/upload/v1741074085/kakmknpbctsgalgwzaqq.pdf								082289254481				13				2025-03-03 17:49:09.456869
7	5	https://res.cloudinary.com/df4qrohsq/raw/upload/v1741015874/h7volzovu2lvrn6qxbv9.pdf	https://res.cloudinary.com/df4qrohsq/raw/upload/v1741015911/diraxkjcahjlwg0hziqh.pdf									082289254481				11				2025-03-03 20:20:55.990432
\.


--
-- TOC entry 4980 (class 0 OID 16409)
-- Dependencies: 222
-- Data for Name: test_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test_table (id, name) FROM stdin;
\.


--
-- TOC entry 4994 (class 0 OID 16573)
-- Dependencies: 236
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, created_at, nik, nama) FROM stdin;
4	riko	riko	2025-03-01 12:41:08.444292		\N
20	users	password	2025-03-01 12:00:32.356306	1472012705030001	\N
5	test	test	2025-03-03 19:33:42.301349	1111	\N
6	Syahir	passwordedit	2025-03-04 11:41:02.119178	12345678901011	\N
9	SyahirLos	password	2025-03-04 12:59:46.377949	12345678901012	\N
10	UniEdit	gantipassword	2025-03-04 13:10:30.57472	1234	\N
14	userbaru	123	2025-03-05 09:37:05.407819	\N	\N
15	Riko Firmansyah2rest	password	2025-03-05 09:40:25.380128	11111	\N
17	looss	password	2025-03-05 09:48:35.873431	111111	\N
18	adit	1234	2025-03-05 09:51:08.242363	123456	\N
21	budi	budi	2025-03-05 09:56:13.936556	999	\N
22	Firman	password	2025-03-05 10:01:46.136343	888	\N
23	Ani	1234	2025-03-05 10:04:55.780687	\N	\N
24	Rio	1234	2025-03-05 10:06:26.678205	555	\N
25	koole	1234	2025-03-05 15:02:08.089329	222	\N
26	qwe	$2b$10$ijcsafqoNi4AAMguBVlqDet/XdgH71532PPr2Zu.H.ESm3FsL25TC	2025-03-05 15:13:22.601688	72	rty
27	mio	$2b$10$GpZKhCBcpb3oD3sfjp8zHewoBsK7xYQDedbXDyTzzaO1dJ.UDGETK	2025-03-05 15:16:01.871918	12346789	miosuzaku
\.


--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 225
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 5, true);


--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 219
-- Name: announcements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.announcements_id_seq', 21, true);


--
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 237
-- Name: data_pendaftaran_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.data_pendaftaran_id_seq', 2, true);


--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 233
-- Name: hubungan_sosial_ibadah_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hubungan_sosial_ibadah_id_seq', 1, true);


--
-- TOC entry 5023 (class 0 OID 0)
-- Dependencies: 231
-- Name: kondisi_ekonomi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kondisi_ekonomi_id_seq', 3, true);


--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 223
-- Name: media_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.media_items_id_seq', 10, true);


--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 217
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.news_id_seq', 23, true);


--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 229
-- Name: orang_tua_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orang_tua_id_seq', 79, true);


--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 241
-- Name: persyaratan_sekolah_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.persyaratan_sekolah_id_seq', 2, true);


--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 239
-- Name: syarat_administrasi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.syarat_administrasi_id_seq', 7, true);


--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 221
-- Name: test_table_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_table_id_seq', 1, false);


--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 227
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 22, true);


--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 235
-- Name: users_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq1', 27, true);


--
-- TOC entry 4799 (class 2606 OID 16478)
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- TOC entry 4801 (class 2606 OID 16476)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- TOC entry 4793 (class 2606 OID 16407)
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- TOC entry 4819 (class 2606 OID 24775)
-- Name: data_pendaftaran data_pendaftaran_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_pendaftaran
    ADD CONSTRAINT data_pendaftaran_pkey PRIMARY KEY (id);


--
-- TOC entry 4813 (class 2606 OID 16539)
-- Name: hubungan_sosial_ibadah hubungan_sosial_ibadah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hubungan_sosial_ibadah
    ADD CONSTRAINT hubungan_sosial_ibadah_pkey PRIMARY KEY (id);


--
-- TOC entry 4811 (class 2606 OID 16517)
-- Name: kondisi_ekonomi kondisi_ekonomi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kondisi_ekonomi
    ADD CONSTRAINT kondisi_ekonomi_pkey PRIMARY KEY (id);


--
-- TOC entry 4797 (class 2606 OID 16454)
-- Name: media_items media_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_items
    ADD CONSTRAINT media_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4791 (class 2606 OID 16397)
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- TOC entry 4807 (class 2606 OID 16502)
-- Name: orang_tua orang_tua_nik_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orang_tua
    ADD CONSTRAINT orang_tua_nik_key UNIQUE (nik);


--
-- TOC entry 4809 (class 2606 OID 16500)
-- Name: orang_tua orang_tua_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orang_tua
    ADD CONSTRAINT orang_tua_pkey PRIMARY KEY (id);


--
-- TOC entry 4823 (class 2606 OID 32980)
-- Name: persyaratan_sekolah persyaratan_sekolah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persyaratan_sekolah
    ADD CONSTRAINT persyaratan_sekolah_pkey PRIMARY KEY (id);


--
-- TOC entry 4821 (class 2606 OID 32965)
-- Name: syarat_administrasi syarat_administrasi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.syarat_administrasi
    ADD CONSTRAINT syarat_administrasi_pkey PRIMARY KEY (id);


--
-- TOC entry 4795 (class 2606 OID 16414)
-- Name: test_table test_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_table
    ADD CONSTRAINT test_table_pkey PRIMARY KEY (id);


--
-- TOC entry 4803 (class 2606 OID 16490)
-- Name: data_anak users_nik_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_anak
    ADD CONSTRAINT users_nik_key UNIQUE (nik);


--
-- TOC entry 4805 (class 2606 OID 16488)
-- Name: data_anak users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_anak
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4815 (class 2606 OID 16581)
-- Name: users users_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey1 PRIMARY KEY (id);


--
-- TOC entry 4817 (class 2606 OID 16583)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4827 (class 2606 OID 24776)
-- Name: data_pendaftaran data_pendaftaran_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_pendaftaran
    ADD CONSTRAINT data_pendaftaran_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.data_anak(id) ON DELETE CASCADE;


--
-- TOC entry 4826 (class 2606 OID 16540)
-- Name: hubungan_sosial_ibadah hubungan_sosial_ibadah_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hubungan_sosial_ibadah
    ADD CONSTRAINT hubungan_sosial_ibadah_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.data_anak(id) ON DELETE CASCADE;


--
-- TOC entry 4825 (class 2606 OID 16518)
-- Name: kondisi_ekonomi kondisi_ekonomi_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kondisi_ekonomi
    ADD CONSTRAINT kondisi_ekonomi_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.data_anak(id) ON DELETE CASCADE;


--
-- TOC entry 4824 (class 2606 OID 16503)
-- Name: orang_tua orang_tua_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orang_tua
    ADD CONSTRAINT orang_tua_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.data_anak(id) ON DELETE CASCADE;


--
-- TOC entry 4829 (class 2606 OID 32981)
-- Name: persyaratan_sekolah persyaratan_sekolah_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persyaratan_sekolah
    ADD CONSTRAINT persyaratan_sekolah_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.data_anak(id) ON DELETE CASCADE;


--
-- TOC entry 4828 (class 2606 OID 32966)
-- Name: syarat_administrasi syarat_administrasi_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.syarat_administrasi
    ADD CONSTRAINT syarat_administrasi_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.data_anak(id) ON DELETE CASCADE;


-- Completed on 2025-03-06 23:58:49

--
-- PostgreSQL database dump complete
--

