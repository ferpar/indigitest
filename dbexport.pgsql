--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1 (Debian 12.1-1.pgdg100+1)
-- Dumped by pg_dump version 12.1 (Debian 12.1-1.pgdg100+1)

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

--
-- Name: find_sym_trig(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.find_sym_trig() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
 BEGIN
  IF ( EXISTS(SELECT * FROM friendships WHERE befriender = NEW.userid AND userid = NEW.befriender) ) THEN
   RAISE EXCEPTION 'friendship already stored as symmetric';
  END IF;
  RETURN NEW;
 END;
$$;


ALTER FUNCTION public.find_sym_trig() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: friendships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.friendships (
    befriender character varying(25) NOT NULL,
    userid character varying(25) NOT NULL,
    CONSTRAINT irreflexive CHECK (((befriender)::text <> (userid)::text))
);


ALTER TABLE public.friendships OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    userid character varying(25) NOT NULL,
    email character varying(30) NOT NULL,
    password character varying(64) NOT NULL,
    username character varying(30) NOT NULL,
    browserlang character varying(10),
    latitude double precision,
    longitude double precision
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: friendships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.friendships (befriender, userid) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (userid, email, password, username, browserlang, latitude, longitude) FROM stdin;
\.


--
-- Name: friendships friendships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_pkey PRIMARY KEY (befriender, userid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- Name: friendships enforce_asymmetry; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER enforce_asymmetry BEFORE INSERT ON public.friendships FOR EACH ROW EXECUTE FUNCTION public.find_sym_trig();


--
-- Name: friendships friendships_befriender_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_befriender_fkey FOREIGN KEY (befriender) REFERENCES public.users(userid) ON DELETE CASCADE;


--
-- Name: friendships friendships_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

